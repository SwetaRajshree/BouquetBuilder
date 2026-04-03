import { useState } from 'react';
import FlowersPage        from './FlowersPage';
import PlantShop          from './PlantShop';
import AIPage             from './AIPage';
import FlashSalePage      from './FlashSalePage';
import ShopsPage          from './ShopsPage';

const TABS = [
  { id: 'flowers',    label: '🌸 Flowers'       },
  { id: 'plants',     label: '🌿 Plants'        },
  { id: 'flora-ai',   label: '🤖 Flora AI'      },
  { id: 'flash-sale', label: '🔥 Flash Sale'    },
  { id: 'shops',      label: '🏪 Shops'          },
];

export default function BuyPage() {
  const [active, setActive] = useState('flowers');

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Inner tab bar */}
      <div className="sticky top-[62px] z-40 bg-white border-b border-pink-100 shadow-soft-s">
        <div className="max-w-[1200px] mx-auto px-4 flex gap-1 overflow-x-auto py-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all flex-shrink-0
                ${active === tab.id
                  ? 'bg-pink-500 border-pink-500 text-white shadow-soft-s'
                  : 'bg-white border-pink-200 text-pink-500 hover:border-pink-400 hover:bg-pink-50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        {active === 'flowers'    && <FlowersPage />}
        {active === 'plants'     && <PlantShop />}
        {active === 'flora-ai'   && <AIPage />}
        {active === 'flash-sale' && <FlashSalePage />}
        {active === 'shops'      && <ShopsPage />}
      </div>
    </div>
  );
}
