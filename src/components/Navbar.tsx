import React from 'react';
import { Bookmark, Volume2 } from 'lucide-react';

interface NavbarProps {
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  onScrollToSection: (sectionId: string) => void;
  isPlayingSong: boolean;
  onToggleSong: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBookmarks,
  bookmarkCount,
  onScrollToSection,
  isPlayingSong,
  onToggleSong,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#07090e]/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <span className="font-display text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
            URAYAMA FES <span className="text-cyan-400 font-mono text-sm ml-1">'26</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onScrollToSection('theme-player')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            THEME SONG
          </button>
          <button
            onClick={() => onScrollToSection('stages')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            STAGE ACTS
          </button>
          <button
            onClick={() => onScrollToSection('exhibits')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            EXHIBITS
          </button>
          <button
            onClick={() => onScrollToSection('food-map')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            FOOD & MAP
          </button>
          <button
            onClick={() => onScrollToSection('hype-vote')}
            className="hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer text-left"
          >
            HYPE VOTE
          </button>
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleSong}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              isPlayingSong
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
            title="テーマ曲の再生/一時停止"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingSong ? 'animate-pulse text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">{isPlayingSong ? 'PAUSE BGM' : 'PLAY BGM'}</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-700 hover:border-cyan-400 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
            <span>MY SCHEDULE</span>
            {bookmarkCount > 0 && (
              <span className="ml-1 bg-cyan-500 text-black font-mono font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
