import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Disc, Radio } from 'lucide-react';
import { festivalAudio } from '../utils/audioEngine';
import { THEME_SONG_LYRICS } from '../data/festivalData';
import confetti from 'canvas-confetti';

interface AudioPlayerVisualizerProps {
  onPlayStateChange?: (playing: boolean) => void;
}

export const AudioPlayerVisualizer: React.FC<AudioPlayerVisualizerProps> = ({
  onPlayStateChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);
  const [comboScore, setComboScore] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const duration = festivalAudio.trackDuration;

  // Sync lyrics with audio playback
  useEffect(() => {
    festivalAudio.onTimeUpdate((time) => {
      setCurrentTime(time);

      // Find current lyric
      let currentIdx = 0;
      for (let i = 0; i < THEME_SONG_LYRICS.length; i++) {
        if (time >= THEME_SONG_LYRICS[i].timeSec) {
          currentIdx = i;
        } else {
          break;
        }
      }
      setActiveLyricIndex(currentIdx);
    });

    return () => {
      festivalAudio.onTimeUpdate(() => {});
    };
  }, []);

  // Sync isPlaying state
  const handleTogglePlay = () => {
    if (isPlaying) {
      festivalAudio.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      festivalAudio.play();
      setIsPlaying(true);
      if (onPlayStateChange) onPlayStateChange(true);
    }
  };

  const handleReset = () => {
    festivalAudio.stop();
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveLyricIndex(0);
    if (onPlayStateChange) onPlayStateChange(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    festivalAudio.seek(newTime);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    festivalAudio.setVolume(newVol);
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnimationFrame: number;

    const render = () => {
      localAnimationFrame = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background subtle gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, 'rgba(10, 15, 26, 0.95)');
      bgGrad.addColorStop(1, 'rgba(6, 8, 14, 0.98)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      if (festivalAudio.analyser && isPlaying) {
        const bufferLength = festivalAudio.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        festivalAudio.analyser.getByteFrequencyData(dataArray);

        const barCount = 48;
        const barWidth = (width / barCount) - 3;
        const step = Math.floor(bufferLength / barCount) || 1;

        for (let i = 0; i < barCount; i++) {
          const value = dataArray[i * step] || 0;
          const percent = value / 255;
          const barHeight = Math.max(4, percent * (height * 0.78));
          const x = i * (barWidth + 3);
          const y = height - barHeight;

          // Gradient color from Cyan to Magenta
          const barGrad = ctx.createLinearGradient(x, y, x, height);
          if (i % 2 === 0) {
            barGrad.addColorStop(0, '#00f0ff');
            barGrad.addColorStop(1, 'rgba(0, 240, 255, 0.15)');
          } else {
            barGrad.addColorStop(0, '#ff0055');
            barGrad.addColorStop(1, 'rgba(255, 0, 85, 0.15)');
          }

          ctx.fillStyle = barGrad;
          ctx.fillRect(x, y, barWidth, barHeight);

          // Top luminous cap
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y, barWidth, 2);
        }

        // Oscilloscope waveform overlay
        const timeData = new Uint8Array(bufferLength);
        festivalAudio.analyser.getByteTimeDomainData(timeData);

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let px = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const py = (v * height) / 2;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
          px += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Idle state wave animation
        const time = Date.now() * 0.002;
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.02 + time) * 12;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS PLAY TO ACTIVATE SOUND SPECTRUM & SYNTHESIZER', width / 2, height / 2 + 35);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(localAnimationFrame);
    };
  }, [isPlaying]);

  // Handle Beat Pad trigger
  const triggerPad = (padIndex: number) => {
    setActivePad(padIndex);
    setComboScore((prev) => prev + 1);

    setTimeout(() => setActivePad(null), 150);

    if (padIndex === 0) festivalAudio.playKick();
    else if (padIndex === 1) festivalAudio.playSnare();
    else if (padIndex === 2) festivalAudio.playLaserFX();
    else if (padIndex === 3) festivalAudio.playBassDropFX();

    if ((comboScore + 1) % 15 === 0) {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#00f0ff', '#ff0055', '#ffffff'],
      });
    }
  };

  // Keyboard controls for beat pads (1, 2, 3, 4, Space for play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '1') triggerPad(0);
      else if (e.key === '2') triggerPad(1);
      else if (e.key === '3') triggerPad(2);
      else if (e.key === '4') triggerPad(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [comboScore]);

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentLyric = THEME_SONG_LYRICS[activeLyricIndex] || THEME_SONG_LYRICS[0];
  const nextLyric = THEME_SONG_LYRICS[activeLyricIndex + 1] || null;

  return (
    <section id="theme-player" className="py-12 bg-neutral-950 border-t border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 mb-2">
              <span>OFFICIAL FESTIVAL ANTHEM</span>
              <span aria-hidden="true">·</span>
              <span>138 BPM HIGH-OCTANE CYBER BEAT</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              公式テーマ曲『ZONE INFINITY』
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              文化祭の鼓動を高鳴らせるシンセEDMトラック。歌詞リアルタイム表示 ＆ インタラクティブ・ビートパッド連動。
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono">
              BEAT COMBO: <span className="text-cyan-400 font-bold text-base tabular-nums">{comboScore}</span>
            </span>
            <button
              onClick={() => {
                festivalAudio.playCheerFX();
                confetti({
                  particleCount: 50,
                  spread: 70,
                  origin: { y: 0.6 },
                });
              }}
              className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800 hover:border-cyan-400 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>歓声エフェクト (CHEER)</span>
            </button>
          </div>
        </div>

        {/* Visualizer & Lyric Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-6">
          {/* Visualizer Canvas & Controls */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
            {/* Top Bar with Track Info */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                  <Disc className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white tracking-tight">ZONE INFINITY (Original Festival Mix)</div>
                  <div className="text-xs text-neutral-400">作曲: 文化祭音響プロジェクト / BPM: 138 / Key: Bm</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${isPlaying ? 'bg-cyan-500/20 text-cyan-300' : 'bg-neutral-800 text-neutral-400'}`}>
                  {isPlaying ? 'LIVE STREAM' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* Canvas Spectrum Display */}
            <div className="my-4 relative rounded-xl overflow-hidden border border-neutral-800 bg-[#06080e]">
              <canvas
                ref={canvasRef}
                width={800}
                height={220}
                className="w-full h-[200px] sm:h-[230px] block"
              />
              {/* Corner Watermark */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-cyan-400/70 tracking-widest pointer-events-none">
                FREQ ANALYZER // 48-BAND SPECTRUM
              </div>
            </div>

            {/* Track Time Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.5}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Playback Controls Row */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-cyan-500/20"
                  aria-label={isPlaying ? '一時停止' : '再生'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black ml-0.5" />}
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors cursor-pointer"
                  title="最初に戻す"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 sm:w-28 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <span className="text-xs font-mono text-neutral-400 w-8 tabular-nums">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Synced Lyrics Card */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">SYNCED LYRICS</span>
                </div>
                <span className="text-xs font-mono text-neutral-500 tabular-nums">
                  LINE {activeLyricIndex + 1}/{THEME_SONG_LYRICS.length}
                </span>
              </div>

              {/* Active Lyric Display */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 mb-4 transition-all">
                <div className="text-xs font-mono text-cyan-400 mb-1">
                  [{formatTime(currentLyric.timeSec)}] NOW SINGING
                </div>
                <div className="font-display text-xl sm:text-2xl font-black text-white leading-snug">
                  {currentLyric.text}
                </div>
                {currentLyric.subtext && (
                  <div className="text-xs text-neutral-400 mt-1 italic">
                    {currentLyric.subtext}
                  </div>
                )}
              </div>

              {/* Next Lyric Preview */}
              {nextLyric && (
                <div className="p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/40">
                  <div className="text-[11px] font-mono text-neutral-500">NEXT UP</div>
                  <div className="text-sm text-neutral-400 font-medium">
                    {nextLyric.text}
                  </div>
                </div>
              )}
            </div>

            {/* Lyric full scroll list preview */}
            <div className="mt-4 pt-3 border-t border-neutral-800 max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {THEME_SONG_LYRICS.map((line, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    festivalAudio.seek(line.timeSec);
                    if (!isPlaying) {
                      festivalAudio.play();
                      setIsPlaying(true);
                    }
                  }}
                  className={`w-full text-left p-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    idx === activeLyricIndex
                      ? 'bg-cyan-500/10 text-cyan-300 font-bold'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                  }`}
                >
                  <span className="truncate pr-2">{line.text}</span>
                  <span className="font-mono text-[10px] text-neutral-500 shrink-0 tabular-nums">
                    {formatTime(line.timeSec)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Cyber Beat Pad for Visitors */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                インタラクティブ・ビートパッド (LIVE BEAT PAD)
              </h3>
              <p className="text-xs text-neutral-400">
                曲に合わせてパッドをタップ（キーボード [1] [2] [3] [4] でも操作可能）してリズムに乗ろう！
              </p>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              KEYBOARD SHORTCUTS: [1] [2] [3] [4]
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => triggerPad(0)}
              className={`p-4 rounded-xl border text-center transition-all transform active:scale-95 cursor-pointer ${
                activePad === 0
                  ? 'bg-cyan-500 text-black border-cyan-400 scale-95 shadow-lg shadow-cyan-500/40'
                  : 'bg-neutral-950 border-neutral-800 hover:border-cyan-500/50 text-white'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 mb-1">KEY: 1</div>
              <div className="font-display text-lg font-bold">KICK</div>
              <div className="text-xs text-neutral-400">加速する鼓動</div>
            </button>

            <button
              onClick={() => triggerPad(1)}
              className={`p-4 rounded-xl border text-center transition-all transform active:scale-95 cursor-pointer ${
                activePad === 1
                  ? 'bg-rose-500 text-white border-rose-400 scale-95 shadow-lg shadow-rose-500/40'
                  : 'bg-neutral-950 border-neutral-800 hover:border-rose-500/50 text-white'
              }`}
            >
              <div className="text-[10px] font-mono text-rose-400 mb-1">KEY: 2</div>
              <div className="font-display text-lg font-bold">SNARE</div>
              <div className="text-xs text-neutral-400">限界突破スネア</div>
            </button>

            <button
              onClick={() => triggerPad(2)}
              className={`p-4 rounded-xl border text-center transition-all transform active:scale-95 cursor-pointer ${
                activePad === 2
                  ? 'bg-amber-400 text-black border-amber-300 scale-95 shadow-lg shadow-amber-400/40'
                  : 'bg-neutral-950 border-neutral-800 hover:border-amber-400/50 text-white'
              }`}
            >
              <div className="text-[10px] font-mono text-amber-400 mb-1">KEY: 3</div>
              <div className="font-display text-lg font-bold">LASER</div>
              <div className="text-xs text-neutral-400">光線エフェクト</div>
            </button>

            <button
              onClick={() => triggerPad(3)}
              className={`p-4 rounded-xl border text-center transition-all transform active:scale-95 cursor-pointer ${
                activePad === 3
                  ? 'bg-purple-500 text-white border-purple-400 scale-95 shadow-lg shadow-purple-500/40'
                  : 'bg-neutral-950 border-neutral-800 hover:border-purple-500/50 text-white'
              }`}
            >
              <div className="text-[10px] font-mono text-purple-400 mb-1">KEY: 4</div>
              <div className="font-display text-lg font-bold">BASS DROP</div>
              <div className="text-xs text-neutral-400">重低音ゾーン</div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
