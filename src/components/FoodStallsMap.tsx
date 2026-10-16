import React, { useState } from 'react';
import { FOOD_STALLS } from '../data/festivalData';
import { MapPin, Utensils, AlertCircle } from 'lucide-react';

export const FoodStallsMap: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string>('All');

  const areas = ['All', 'Central Courtyard', 'North Gate Plaza', 'East Gym Alley'];

  const filteredStalls = FOOD_STALLS.filter((stall) => {
    return selectedArea === 'All' || stall.locationArea === selectedArea;
  });

  return (
    <section id="food-map" className="py-16 bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
              <span>FESTIVAL GASTRONOMY & CAMPUS MAP</span>
              <span aria-hidden="true">·</span>
              <span>24 GOURMET STALLS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              模擬店フード ＆ 校内マップ
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              鉄板焼きそば、光るネオンかき氷、特製ステーキ串など、各クラス・部活自慢のグルメストリート。
            </p>
          </div>

          {/* Area Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedArea === area
                    ? 'bg-amber-400 text-black font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {area === 'All' ? '全エリア' : area === 'Central Courtyard' ? '中庭広場' : area === 'North Gate Plaza' ? '正門前プラザ' : '東体育館通り'}
              </button>
            ))}
          </div>
        </div>

        {/* Top Grid: Night Stalls Photo + Interactive Campus Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
          {/* Night Stalls Visual Asset */}
          <div className="lg:col-span-6 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 relative group shadow-xl">
            <img
              src="/src/assets/images/food_night_stalls_1792127183627.jpg"
              alt="文化祭 模擬店 夜の屋台ストリート 焼きそばとかき氷"
              className="w-full h-full object-cover min-h-[300px] sm:min-h-[360px] group-hover:scale-102 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 mb-1">
                <Utensils className="w-3.5 h-3.5 text-amber-400" />
                <span>YATAI GOURMET ALLEY // CENTRAL COURTYARD</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-1">
                熱気あふれる夜店ストリート
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                提灯とネオンが灯る中庭屋台街。電子マネー・QRコード決済にも全店対応。
              </p>
            </div>
          </div>

          {/* Interactive Campus Map Diagram */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">CAMPUS MAP OVERVIEW</span>
                </div>
                <span className="text-xs text-neutral-400">エリアをクリックして絞り込み</span>
              </div>

              {/* Simplified stylized SVG / interactive block map */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedArea('Central Courtyard')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedArea === 'Central Courtyard'
                      ? 'bg-amber-400/10 border-amber-400/80 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-amber-400 mb-1">ZONE A</div>
                  <div className="font-bold text-sm text-white">中庭広場 (Central Courtyard)</div>
                  <div className="text-xs text-neutral-400 mt-1">極太焼きそば / ネオンかき氷</div>
                </button>

                <button
                  onClick={() => setSelectedArea('North Gate Plaza')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedArea === 'North Gate Plaza'
                      ? 'bg-cyan-400/10 border-cyan-400/80 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-cyan-400 mb-1">ZONE B</div>
                  <div className="font-bold text-sm text-white">正門前プラザ (North Gate)</div>
                  <div className="text-xs text-neutral-400 mt-1">牛サイコロステーキ / チュロス</div>
                </button>

                <button
                  onClick={() => setSelectedArea('East Gym Alley')}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedArea === 'East Gym Alley'
                      ? 'bg-rose-400/10 border-rose-400/80 text-white shadow-md'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-rose-400 mb-1">ZONE C</div>
                  <div className="font-bold text-sm text-white">東体育館通り (East Gym)</div>
                  <div className="text-xs text-neutral-400 mt-1">抹茶ラテ / クラフトレモネード</div>
                </button>

                <div className="p-4 rounded-xl text-left bg-neutral-950 border border-neutral-800 text-neutral-300">
                  <div className="text-[10px] font-mono text-purple-400 mb-1">ZONE D</div>
                  <div className="font-bold text-sm text-white">中央グラウンド</div>
                  <div className="text-xs text-neutral-400 mt-1">メインアリーナ特設ライブステージ</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5 text-xs text-neutral-400">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>エコキャップ分別回収にご協力ください。マイバッグ・マイボトルの持参を歓迎しています。</span>
            </div>
          </div>
        </div>

        {/* Food Stalls Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStalls.map((stall) => (
            <div
              key={stall.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-2">
                  <span className="font-medium text-amber-400">{stall.organizer}</span>
                  <span className="font-mono text-neutral-400">
                    {stall.locationArea === 'Central Courtyard' ? '中庭広場' : stall.locationArea === 'North Gate Plaza' ? '正門前' : '体育館通り'}
                  </span>
                </div>

                <h4 className="font-display text-lg font-bold text-white mb-2">
                  {stall.name}
                </h4>

                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {stall.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <div>
                  <span className="text-[11px] text-neutral-500 block">価格 (税込)</span>
                  <span className="font-mono text-lg font-bold text-white tabular-nums">
                    ¥{stall.price}
                  </span>
                </div>

                <div className="text-xs">
                  <span
                    className={`font-semibold ${
                      stall.status === 'In Stock'
                        ? 'text-cyan-400'
                        : stall.status === 'Crowded'
                        ? 'text-amber-400'
                        : 'text-neutral-500'
                    }`}
                  >
                    {stall.status === 'In Stock' ? '● 即購入OK' : stall.status === 'Crowded' ? '▲ 混雑中 (5分待ち)' : '✕ 完売'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
