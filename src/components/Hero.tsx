import React, { useState, useEffect } from 'react';
import { Play, Calendar, MapPin, Zap } from 'lucide-react';

interface HeroProps {
  onPlaySong: () => void;
  onExploreSchedule: () => void;
  onExploreMap: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onPlaySong,
  onExploreSchedule,
  onExploreMap,
}) => {
  // Festival Date: 2026-10-24 09:00:00 JST
  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 14,
    minutes: 32,
    seconds: 45,
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-24T09:00:00+09:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full pt-4 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Left Column: Typography, Value Proposition & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              {/* Clean unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 mb-3">
                <span>URAYAMA ACADEMY CULTURAL FESTIVAL 2026</span>
                <span aria-hidden="true">·</span>
                <span>OCTOBER 24-25</span>
              </div>

              {/* Display Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4 text-balance">
                限界を打ち破れ。
                <br />
                <span className="text-gradient-cyan">ZONE INFINITY</span>
              </h1>

              {/* Concrete Subheading */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mb-6">
                最先端のサイバー音響演出、白熱のバンドバトル、体験型デジタルインスタレーション、そして名物グルメ屋台。情熱が渦巻くステージで、青春の頂点へ駆け上がれ。
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <button
                  onClick={onPlaySong}
                  className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>公式テーマ曲を再生</span>
                </button>

                <button
                  onClick={onExploreSchedule}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-neutral-900 border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>タイムテーブル一覧</span>
                </button>
              </div>
            </div>

            {/* Countdown Clock Module */}
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                <span className="font-semibold text-neutral-200">開幕カウントダウン</span>
                <span className="font-mono text-cyan-400">STAGE OPEN: OCT 24 09:00</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
                  <span className="block font-mono text-2xl font-bold text-white tabular-nums">
                    {String(timeLeft.days).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-neutral-400">DAYS</span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
                  <span className="block font-mono text-2xl font-bold text-white tabular-nums">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-neutral-400">HOURS</span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
                  <span className="block font-mono text-2xl font-bold text-white tabular-nums">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-neutral-400">MINS</span>
                </div>
                <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
                  <span className="block font-mono text-2xl font-bold text-cyan-400 tabular-nums">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-neutral-400">SECS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visualizer Media Asset */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 group shadow-2xl">
              <img
                src="/src/assets/images/hero_cyber_festival_1792127180384.jpg"
                alt="文化祭 メイン野外ステージ サイバーレーザー演出"
                className="w-full h-full object-cover min-h-[380px] sm:min-h-[460px] group-hover:scale-102 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Bottom Scrim Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>MAIN STAGE AREA A // NIGHT FESTIVAL</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  文化祭特設メインステージ ＆ サイバー鳥居ゲート
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300">
                  最新鋭のマルチレーザー投影と重低音サラウンドシステムが響き渡る全校集結の中庭エリア。
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>中央グラウンド特設ステージ</span>
                  </span>
                  <button
                    onClick={onExploreMap}
                    className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold cursor-pointer"
                  >
                    マップで確認 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Feature & Proof Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">出展・企画ブース数</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">48+</span>
            <span className="text-xs text-neutral-500">教室展示・体験型アトラクション</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">ステージパフォーマンス</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-cyan-400 tabular-nums">16組</span>
            <span className="text-xs text-neutral-500">軽音・ダンス・吹奏楽・DJ</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">グルメ模擬店</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-white tabular-nums">24店</span>
            <span className="text-xs text-neutral-500">名物焼きそば・スイーツ・カフェ</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-400">入場料・参加資格</span>
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">完全無料</span>
            <span className="text-xs text-neutral-500">一般・他校生・地域の方々歓迎</span>
          </div>
        </div>
      </div>
    </section>
  );
};
