/**
 * Web Audio API synthesizer for the Cultural Festival Cyber EDM Theme
 * Provides full real-time audio playback, frequency analyzer connection, and sound FX.
 */

class FestivalAudioEngine {
  private ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private tempo: number = 138;
  private currentStep: number = 0;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private onTimeUpdateCallback: ((currentTime: number) => void) | null = null;
  private playbackStartTime: number = 0;
  private pauseOffset: number = 0;
  public trackDuration: number = 158; // 2m 38s matching user's audio length

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public onTimeUpdate(cb: (currentTime: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  // Play punchy kick
  public playKick(time?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 0.16);

    gain.gain.setValueAtTime(1.0, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  // Play snappy EDM snare + noise
  public playSnare(time?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;

    // Tonal body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
    oscGain.gain.setValueAtTime(0.7, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);

    // Noise snap
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 0.19);
  }

  // Play hi-hat
  public playHiHat(open: boolean = false, time?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;
    const duration = open ? 0.25 : 0.05;

    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(open ? 0.45 : 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + duration + 0.01);
  }

  // Play Cyber Synth Note (Sawtooth with filter envelope)
  public playSynthNote(freq: number, duration: number = 0.2, time?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + duration);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Play Bass note
  public playBassNote(freq: number, duration: number = 0.22, time?: number) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = time ?? this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(250, t + duration);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  // Cyber Sound FX
  public playLaserFX() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.3);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playBassDropFX() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.9);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.95);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 1.0);
  }

  public playCheerFX() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    // Layered crowd cheer chord
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, t + 0.4);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5 + idx * 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  }

  // Musical sequencer for full track playback
  private stepSequence() {
    if (!this.isPlaying || !this.ctx) return;

    const stepInBar = this.currentStep % 16;
    const barIndex = Math.floor(this.currentStep / 16);

    // Chords: Bm (B3, D4, F#4) -> G (G3, B3, D4) -> Em (E3, G3, B3) -> F# (F#3, A#3, C#4)
    const chordIndex = barIndex % 4;
    const chordNotes = [
      [246.94, 293.66, 369.99, 493.88], // Bm
      [196.00, 246.94, 293.66, 392.00], // G
      [164.81, 196.00, 246.94, 329.63], // Em
      [185.00, 233.08, 277.18, 369.99], // F#
    ][chordIndex];

    const bassNotes = [123.47, 98.00, 82.41, 92.50][chordIndex];

    // Drums
    if (stepInBar % 4 === 0) {
      this.playKick();
    }
    if (stepInBar === 4 || stepInBar === 12) {
      this.playSnare();
    }
    if (stepInBar % 2 === 0) {
      this.playHiHat(stepInBar % 4 === 2);
    }

    // Driving Bass
    if (stepInBar % 2 === 0) {
      this.playBassNote(bassNotes, 0.18);
    }

    // Lead Arpeggio
    const note = chordNotes[stepInBar % 4];
    this.playSynthNote(note, 0.15);

    this.currentStep++;

    const currentElapsed = (this.ctx.currentTime - this.playbackStartTime) + this.pauseOffset;
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(Math.min(currentElapsed, this.trackDuration));
    }

    if (currentElapsed >= this.trackDuration) {
      this.stop();
      return;
    }

    const stepIntervalMs = (60 / this.tempo / 4) * 1000;
    this.timerId = window.setTimeout(() => this.stepSequence(), stepIntervalMs);
  }

  public play() {
    this.initContext();
    if (!this.ctx) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.playbackStartTime = this.ctx.currentTime;
    this.stepSequence();
  }

  public pause() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.pauseOffset += (this.ctx.currentTime - this.playbackStartTime);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentStep = 0;
    this.pauseOffset = 0;
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0);
    }
  }

  public seek(seconds: number) {
    this.pauseOffset = Math.max(0, Math.min(seconds, this.trackDuration));
    const stepIntervalSec = (60 / this.tempo / 4);
    this.currentStep = Math.floor(this.pauseOffset / stepIntervalSec);
    if (this.ctx) {
      this.playbackStartTime = this.ctx.currentTime;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.pauseOffset);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const festivalAudio = new FestivalAudioEngine();
