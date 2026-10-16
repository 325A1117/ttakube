import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AudioPlayerVisualizer } from './components/AudioPlayerVisualizer';
import { StageSchedule } from './components/StageSchedule';
import { ExhibitShowcase } from './components/ExhibitShowcase';
import { FoodStallsMap } from './components/FoodStallsMap';
import { HypeVoteSection } from './components/HypeVoteSection';
import { MyScheduleModal } from './components/MyScheduleModal';
import { Footer } from './components/Footer';
import { festivalAudio } from './utils/audioEngine';

export default function App() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load bookmarks
  useEffect(() => {
    try {
      const saved = localStorage.getItem('urayama_bookmarks');
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveBookmarks = (newIds: string[]) => {
    setBookmarkedIds(newIds);
    try {
      localStorage.setItem('urayama_bookmarks', JSON.stringify(newIds));
    } catch {
      // ignore
    }
  };

  const handleToggleBookmark = (id: string, title: string) => {
    if (bookmarkedIds.includes(id)) {
      const updated = bookmarkedIds.filter((item) => item !== id);
      saveBookmarks(updated);
      showToast(`「${title}」を予定から削除しました`);
    } else {
      const updated = [...bookmarkedIds, id];
      saveBookmarks(updated);
      showToast(`「${title}」をマイ予定に追加しました！`);
      festivalAudio.playLaserFX();
    }
  };

  const handleRemoveBookmark = (id: string) => {
    const updated = bookmarkedIds.filter((item) => item !== id);
    saveBookmarks(updated);
  };

  const handleClearAllBookmarks = () => {
    saveBookmarks([]);
    showToast('マイ予定をすべてクリアしました');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleToggleSong = () => {
    if (festivalAudio.getIsPlaying()) {
      festivalAudio.pause();
      setIsPlayingSong(false);
    } else {
      festivalAudio.play();
      setIsPlayingSong(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 selection:bg-cyan-500 selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-neutral-900 border border-cyan-500/50 text-cyan-300 text-xs font-semibold shadow-2xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenBookmarks={() => setIsScheduleModalOpen(true)}
        bookmarkCount={bookmarkedIds.length}
        onScrollToSection={handleScrollToSection}
        isPlayingSong={isPlayingSong}
        onToggleSong={handleToggleSong}
      />

      {/* Main Content */}
      <main>
        {/* Hero Banner */}
        <Hero
          onPlaySong={() => {
            handleScrollToSection('theme-player');
            if (!festivalAudio.getIsPlaying()) {
              festivalAudio.play();
              setIsPlayingSong(true);
            }
          }}
          onExploreSchedule={() => handleScrollToSection('stages')}
          onExploreMap={() => handleScrollToSection('food-map')}
        />

        {/* Official Theme Song & Real-Time Audio Visualizer */}
        <AudioPlayerVisualizer
          onPlayStateChange={(playing) => setIsPlayingSong(playing)}
        />

        {/* Live Stage Lineup & Timetable */}
        <StageSchedule
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* Digital & Creative Club Exhibits */}
        <ExhibitShowcase
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />

        {/* Food Stalls & Interactive Campus Map */}
        <FoodStallsMap />

        {/* Audience Hype Voltage & Voting */}
        <HypeVoteSection />
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* My Schedule Modal */}
      <MyScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        bookmarkedIds={bookmarkedIds}
        onRemoveBookmark={handleRemoveBookmark}
        onClearAll={handleClearAllBookmarks}
      />
    </div>
  );
}
