import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#05070a] border-t border-neutral-800/80 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-neutral-900">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <span className="font-display text-xl font-black tracking-tight text-white">
              URAYAMA FESTIVAL <span className="text-cyan-400 font-mono">2026</span>
            </span>
            <p className="text-neutral-400 leading-relaxed max-w-sm">
              スローガン: 『ZONE INFINITY 〜 限界の先にある頂点へ』。浦山学園 文化祭実行委員会 主催。
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-xs pt-1">
              <span>開催日: 2026年10月24日(土) - 10月25日(日)</span>
              <span aria-hidden="true">·</span>
              <span>入場無料</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <span className="font-bold text-white text-xs tracking-wider uppercase mb-1">
              FESTIVAL NAVIGATION
            </span>
            <a href="#theme-player" className="hover:text-cyan-400 transition-colors">
              公式テーマ曲『ZONE INFINITY』
            </a>
            <a href="#stages" className="hover:text-cyan-400 transition-colors">
              メインステージ・タイムテーブル
            </a>
            <a href="#exhibits" className="hover:text-cyan-400 transition-colors">
              企画・デジタル展示一覧
            </a>
            <a href="#food-map" className="hover:text-cyan-400 transition-colors">
              模擬店フード＆校内マップ
            </a>
            <a href="#hype-vote" className="hover:text-cyan-400 transition-colors">
              リアルタイム熱気投票
            </a>
          </div>

          {/* Access & Guidelines */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="font-bold text-white text-xs tracking-wider uppercase mb-1">
              来場者へのご案内
            </span>
            <p className="text-neutral-400 leading-relaxed">
              会場: 浦山学園メインキャンパス（最寄り駅より徒歩8分）。近隣への路上駐車はご遠慮ください。全館敷地内禁煙、ゴミ分別回収へのご協力をお願いいたします。
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500">
            &copy; 2026 Urayama School Festival Executive Committee. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>ページ上部へ</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
