import React, { useState } from 'react';
import { STAGE_ACTS } from '../data/festivalData';
import { StageAct } from '../types/festival';
import { Bookmark, BookmarkCheck, Clock, MapPin, ChevronDown, ChevronUp, Music } from 'lucide-react';

interface StageScheduleProps {
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, title: string) => void;
}

export const StageSchedule: React.FC<StageScheduleProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [selectedDay, setSelectedDay] = useState<1 | 2>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedActId, setExpandedActId] = useState<string | null>('stage-1');

  const categories = ['All', 'Band', 'Dance', 'DJ / Vocal', 'Special Ceremony'];

  const filteredActs = STAGE_ACTS.filter((act) => {
    const matchesDay = act.day === selectedDay;
    const matchesCat = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesDay && matchesCat;
  });

  // Featured headliner
  const headlinerAct = STAGE_ACTS[0];

  return (
    <section id="stages" className="py-16 bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2">
              <span>LIVE TIMETABLE</span>
              <span aria-hidden="true">·</span>
              <span>2 DAYS FESTIVAL STAGE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ステージ・タイムテーブル
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              全16組の精鋭バンド、LEDダンスチーム、吹奏楽×シンセコラボが繰り広げる熱狂のライブステージ。
            </p>
          </div>

          {/* Day Segmented Control (Functional buttons conforming to frontend design) */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
            <button
              onClick={() => setSelectedDay(1)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedDay === 1
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              DAY 1 (10.24 SAT)
            </button>
            <button
              onClick={() => setSelectedDay(2)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedDay === 2
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              DAY 2 (10.25 SUN)
            </button>
          </div>
        </div>

        {/* Headliner Spotlight Banner (Day 1) */}
        {selectedDay === 1 && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 mb-10 group shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={headlinerAct.image || '/src/assets/images/stage_live_band_1792127181539.jpg'}
                  alt={headlinerAct.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-neutral-900 pointer-events-none" />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                    <span className="text-rose-400 font-bold">SPECIAL HEADLINER</span>
                    <span aria-hidden="true">·</span>
                    <span>{headlinerAct.startTime} - {headlinerAct.endTime}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                    {headlinerAct.title}
                  </h3>
                  <div className="text-sm font-semibold text-cyan-400 mb-3">
                    {headlinerAct.artist}
                  </div>

                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {headlinerAct.description}
                  </p>

                  <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 mb-6">
                    <span className="font-semibold text-white">注目演出: </span>
                    {headlinerAct.highlight}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{headlinerAct.stageName}</span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(headlinerAct.id, headlinerAct.title)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                      bookmarkedIds.includes(headlinerAct.id)
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    }`}
                  >
                    {bookmarkedIds.includes(headlinerAct.id) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>保存済み</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>マイ予定に追加</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6">
          <span className="text-xs text-neutral-400 mr-2 whitespace-nowrap">カテゴリ:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-800 text-cyan-400 border border-cyan-500/40'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timetable List Grid */}
        <div className="space-y-4">
          {filteredActs.map((act) => {
            const isBookmarked = bookmarkedIds.includes(act.id);
            const isExpanded = expandedActId === act.id;

            return (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Time & Title */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[90px] p-2 rounded-lg bg-neutral-950 border border-neutral-800/80 shrink-0">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 mb-1" />
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        {act.startTime}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-500 tabular-nums">
                        ~ {act.endTime}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                        <span className="font-medium text-cyan-400">{act.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{act.stageName}</span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-white">
                        {act.title}
                      </h4>
                      <p className="text-xs text-neutral-300 mt-0.5">
                        出演: <span className="font-semibold text-neutral-200">{act.artist}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => setExpandedActId(isExpanded ? null : act.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? '詳細を閉じる' : 'セットリスト'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => onToggleBookmark(act.id, act.title)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                      }`}
                    >
                      {isBookmarked ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>保存済み</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>マイ予定に追加</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-neutral-300 mb-1">ステージ概要</div>
                      <p className="text-neutral-400 leading-relaxed mb-2">
                        {act.description}
                      </p>
                      <div className="text-cyan-400">
                        <span className="font-semibold">演出ハイライト: </span>
                        {act.highlight}
                      </div>
                    </div>

                    {act.setlist && act.setlist.length > 0 && (
                      <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800">
                        <div className="flex items-center gap-1.5 font-semibold text-white mb-2">
                          <Music className="w-3.5 h-3.5 text-rose-400" />
                          <span>予定演奏楽曲 (SETLIST)</span>
                        </div>
                        <ul className="space-y-1 text-neutral-400">
                          {act.setlist.map((song, sIdx) => (
                            <li key={sIdx} className="flex items-center gap-2">
                              <span className="font-mono text-neutral-500">{String(sIdx + 1).padStart(2, '0')}.</span>
                              <span className="text-neutral-300">{song}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
