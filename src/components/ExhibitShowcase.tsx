import React, { useState } from 'react';
import { EXHIBIT_ITEMS } from '../data/festivalData';
import { ExhibitItem } from '../types/festival';
import { MapPin, Clock, ArrowRight, X } from 'lucide-react';

interface ExhibitShowcaseProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, title: string) => void;
}

export const ExhibitShowcase: React.FC<ExhibitShowcaseProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<ExhibitItem | null>(null);

  const categories = ['All', 'Digital Tech', 'Game & Attraction', 'Art & Media'];

  const filteredItems = EXHIBIT_ITEMS.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  return (
    <section id="exhibits" className="py-16 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
              <span>ACADEMIC & CREATIVE EXHIBITS</span>
              <span aria-hidden="true">·</span>
              <span>INNOVATION & ART</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              企画・展示ブース
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              生徒たちが数ヶ月かけて創り上げた最先端メディアアート、体験型脱出ゲーム、ロボット対戦。
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-rose-400 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Featured Digital Art Room (Spans 7 cols) */}
          {filteredItems.slice(0, 1).map((item) => (
            <div
              key={item.id}
              className="lg:col-span-7 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-64 sm:h-80 overflow-hidden bg-neutral-950">
                <img
                  src={item.image || '/src/assets/images/exhibit_digital_art_1792127181927.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono text-cyan-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md border border-neutral-700/60">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>待ち時間: {item.waitTimeMins}分 (混雑中)</span>
                </div>
              </div>

              <div className="p-6">
                {/* Clean unboxed metadata */}
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                  <span className="font-semibold text-rose-400">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.organizer}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.location}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="font-medium text-white">注目:</span>
                    <span>{item.highlight}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(item.id, item.title)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        bookmarkedIds.includes(item.id)
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {bookmarkedIds.includes(item.id) ? '保存済み' : 'マイ予定に追加'}
                    </button>
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>企画詳細</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Secondary Exhibit Cards (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {filteredItems.slice(1).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-cyan-400">{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.organizer}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-300">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{item.waitTimeMins === 0 ? '待ちなし' : `${item.waitTimeMins}分`}</span>
                    </div>
                  </div>

                  <h4 className="font-display text-lg font-bold text-white mb-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1 text-xs text-neutral-400 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                  <span className="text-[11px] text-neutral-400">
                    {item.tags.join(' / ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(item.id, item.title)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        bookmarkedIds.includes(item.id)
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {bookmarkedIds.includes(item.id) ? '保存済み' : '追加'}
                    </button>
                    <button
                      onClick={() => setActiveModalItem(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                    >
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Exhibit Detail */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg p-6 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl">
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold mb-2">
                <span>{activeModalItem.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeModalItem.organizer}</span>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-3">
                {activeModalItem.title}
              </h3>

              <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 pb-3 border-b border-neutral-800">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{activeModalItem.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>待ち時間: {activeModalItem.waitTimeMins}分</span>
                </span>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed mb-4">
                {activeModalItem.description}
              </p>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-6">
                <div className="font-semibold text-white mb-1">企画のポイント</div>
                <div>{activeModalItem.highlight}</div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    onToggleBookmark(activeModalItem.id, activeModalItem.title);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  {bookmarkedIds.includes(activeModalItem.id) ? '保存済みを解除' : 'マイ予定に追加する'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
