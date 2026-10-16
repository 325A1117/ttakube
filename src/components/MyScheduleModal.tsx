import React, { useState } from 'react';
import { X, Trash2, Calendar, MapPin, Share2, Check } from 'lucide-react';
import { STAGE_ACTS, EXHIBIT_ITEMS } from '../data/festivalData';

interface MyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedIds: string[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
}

export const MyScheduleModal: React.FC<MyScheduleModalProps> = ({
  isOpen,
  onClose,
  bookmarkedIds,
  onRemoveBookmark,
  onClearAll,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Resolve items
  const savedStages = STAGE_ACTS.filter((act) => bookmarkedIds.includes(act.id));
  const savedExhibits = EXHIBIT_ITEMS.filter((item) => bookmarkedIds.includes(item.id));
  const totalCount = savedStages.length + savedExhibits.length;

  const handleShare = () => {
    const textLines = [
      '【URAYAMA FES 2026 - マイフェススケジュール】',
      ...savedStages.map((s) => `・[DAY${s.day} ${s.startTime}] ${s.title} (${s.stageName})`),
      ...savedExhibits.map((e) => `・[展示] ${e.title} (${e.location})`),
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-xl font-bold text-white">
              マイ・スケジュール ({totalCount}件)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6">
          {totalCount === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-300 font-semibold mb-1">保存された予定がありません</p>
              <p className="text-xs text-neutral-500">
                ステージタイムテーブルや企画展示の「マイ予定に追加」ボタンを押して、自分だけのフェス行程表を作成しましょう。
              </p>
            </div>
          ) : (
            <>
              {/* Saved Stage Acts */}
              {savedStages.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                    ライブステージ ({savedStages.length})
                  </h4>
                  <div className="space-y-2.5">
                    {savedStages.map((stage) => (
                      <div
                        key={stage.id}
                        className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                            <span className="font-mono text-cyan-400 font-bold">
                              DAY {stage.day} {stage.startTime} - {stage.endTime}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{stage.stageName}</span>
                          </div>
                          <div className="text-sm font-bold text-white">{stage.title}</div>
                          <div className="text-xs text-neutral-400">{stage.artist}</div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(stage.id)}
                          className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Exhibits */}
              {savedExhibits.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3">
                    企画・展示ブース ({savedExhibits.length})
                  </h4>
                  <div className="space-y-2.5">
                    {savedExhibits.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                            <span className="text-rose-400 font-semibold">{item.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </span>
                          </div>
                          <div className="text-sm font-bold text-white">{item.title}</div>
                          <div className="text-xs text-neutral-400">{item.organizer}</div>
                        </div>

                        <button
                          onClick={() => onRemoveBookmark(item.id)}
                          className="p-2 text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {totalCount > 0 && (
          <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              すべてクリア
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-400 text-black hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'クリップボードにコピー完了！' : '行程表をコピー'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
