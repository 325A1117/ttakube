import React, { useState, useEffect } from 'react';
import { Flame, Trophy, ThumbsUp, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { festivalAudio } from '../utils/audioEngine';

interface VoteOption {
  id: string;
  name: string;
  votes: number;
}

export const HypeVoteSection: React.FC = () => {
  const [hypeLevel, setHypeLevel] = useState<number>(88);
  const [hasCheered, setHasCheered] = useState<boolean>(false);
  const [votedStageId, setVotedStageId] = useState<string | null>(null);
  const [votedExhibitId, setVotedExhibitId] = useState<string | null>(null);

  // Initial stage nominees
  const [stageVotes, setStageVotes] = useState<VoteOption[]>([
    { id: 's-1', name: 'ZONE INFINITY: 公式オープニングライブ', votes: 412 },
    { id: 's-2', name: 'AXIS CLASH: 軽音学フェス頂点決戦', votes: 389 },
    { id: 's-3', name: 'CYBER PULSE: LEDダンスパフォーマンス', votes: 345 },
    { id: 's-4', name: 'VOCAL SYNTHESIZER ORCHESTRA', votes: 298 },
  ]);

  // Initial exhibit nominees
  const [exhibitVotes, setExhibitVotes] = useState<VoteOption[]>([
    { id: 'e-1', name: 'CYBER-SYNC: 没入型デジタルアート空間', votes: 468 },
    { id: 'e-2', name: 'CYBER LABYRINTH: 超難関サイバー脱出ゲーム', votes: 394 },
    { id: 'e-3', name: 'URAYAMA ROBO-CLASH 2026', votes: 312 },
  ]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedVotedStage = localStorage.getItem('urayama_vote_stage');
      const savedVotedExhibit = localStorage.getItem('urayama_vote_exhibit');
      if (savedVotedStage) setVotedStageId(savedVotedStage);
      if (savedVotedExhibit) setVotedExhibitId(savedVotedExhibit);
    } catch {
      // ignore
    }
  }, []);

  const handleSendHype = () => {
    setHypeLevel((prev) => Math.min(100, prev + 1));
    setHasCheered(true);
    festivalAudio.playCheerFX();

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#00f0ff', '#ff0055', '#ffb800', '#ffffff'],
    });

    setTimeout(() => setHasCheered(false), 800);
  };

  const handleVoteStage = (id: string) => {
    if (votedStageId === id) return;
    setStageVotes((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    setVotedStageId(id);
    localStorage.setItem('urayama_vote_stage', id);
    festivalAudio.playLaserFX();
  };

  const handleVoteExhibit = (id: string) => {
    if (votedExhibitId === id) return;
    setExhibitVotes((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt))
    );
    setVotedExhibitId(id);
    localStorage.setItem('urayama_vote_exhibit', id);
    festivalAudio.playLaserFX();
  };

  // Total votes calculate
  const totalStageVotes = stageVotes.reduce((acc, curr) => acc + curr.votes, 0);
  const totalExhibitVotes = exhibitVotes.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <section id="hype-vote" className="py-16 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 mb-2">
              <span>AUDIENCE INTERACTION & AWARDS</span>
              <span aria-hidden="true">·</span>
              <span>LIVE PARTICIPATION</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              熱気ボルテージ ＆ 投票システム
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              来場者全員で会場の熱気を最高潮へ。あなたの1票がベストステージ＆ベスト企画を決定します。
            </p>
          </div>
        </div>

        {/* Live Voltage Meter Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-900/90 border border-neutral-800 mb-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:max-w-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
                  <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                  CROWD VOLTAGE LEVEL
                </span>
                <span className="font-mono text-2xl font-black text-rose-400 tabular-nums">
                  {hypeLevel}% {hypeLevel >= 95 ? '🔥 MAX ZONE' : 'HIGH HEAT'}
                </span>
              </div>

              {/* Meter bar */}
              <div className="w-full h-4 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-neutral-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-300"
                  style={{ width: `${hypeLevel}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-2">
                <span>0% COOL</span>
                <span>50% HEATING UP</span>
                <span>100% MAXIMUM ZONE</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={handleSendHype}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-display font-extrabold text-sm transition-all transform active:scale-95 cursor-pointer shadow-lg ${
                  hasCheered
                    ? 'bg-rose-500 text-white scale-105'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-rose-500/25'
                }`}
              >
                <Sparkles className="w-5 h-5 fill-white" />
                <span>歓声を送る (HYPE BOOST)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Voting Polls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Poll 1: Best Stage Act */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white tracking-wider">
                    ベスト・ステージアクト部門
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400 tabular-nums">
                  総投票数: {totalStageVotes}票
                </span>
              </div>

              <p className="text-xs text-neutral-400 mb-4">
                最も心を揺さぶられたバンド・ダンス・DJステージを選んで投票してください。
              </p>

              <div className="space-y-3">
                {stageVotes.map((opt) => {
                  const percent = Math.round((opt.votes / totalStageVotes) * 100);
                  const isVoted = votedStageId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isVoted
                          ? 'bg-cyan-500/10 border-cyan-400/80'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-white">
                          {opt.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs text-cyan-400 font-bold tabular-nums">
                            {opt.votes}票 ({percent}%)
                          </span>
                          <button
                            onClick={() => handleVoteStage(opt.id)}
                            disabled={isVoted}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                              isVoted
                                ? 'bg-cyan-500 text-black cursor-default'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                            }`}
                          >
                            {isVoted ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>投票済</span>
                              </>
                            ) : (
                              <>
                                <ThumbsUp className="w-3 h-3" />
                                <span>投票</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Vote Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Poll 2: Best Club Exhibit */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white tracking-wider">
                    ベスト・企画展示部門
                  </span>
                </div>
                <span className="font-mono text-xs text-neutral-400 tabular-nums">
                  総投票数: {totalExhibitVotes}票
                </span>
              </div>

              <p className="text-xs text-neutral-400 mb-4">
                最もクオリティが高く感動した教室企画・アトラクションを選んで投票してください。
              </p>

              <div className="space-y-3">
                {exhibitVotes.map((opt) => {
                  const percent = Math.round((opt.votes / totalExhibitVotes) * 100);
                  const isVoted = votedExhibitId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isVoted
                          ? 'bg-rose-500/10 border-rose-400/80'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-white">
                          {opt.name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-xs text-rose-400 font-bold tabular-nums">
                            {opt.votes}票 ({percent}%)
                          </span>
                          <button
                            onClick={() => handleVoteExhibit(opt.id)}
                            disabled={isVoted}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                              isVoted
                                ? 'bg-rose-500 text-white cursor-default'
                                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                            }`}
                          >
                            {isVoted ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                <span>投票済</span>
                              </>
                            ) : (
                              <>
                                <ThumbsUp className="w-3 h-3" />
                                <span>投票</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Vote Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
