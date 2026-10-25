import React from 'react';
import {
  Waves,
  UtensilsCrossed,
  Flower2,
  Anchor,
  Dumbbell,
  Briefcase,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AmenitiesPageProps {
  onExploreRooms: () => void;
}

export const AmenitiesPage: React.FC<AmenitiesPageProps> = ({ onExploreRooms }) => {
  const experiences = [
    {
      title: 'Ocean Horizon Infinity Pool',
      category: 'Aquatic Wellness',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80',
      description: 'An architectural marvel cantilevered over coastal cliffs. Features temperature-controlled saline water, private submerged loungers, and complimentary poolside refreshments.',
      inclusions: ['Cabana attendants', 'Chilled towel service', 'Sunset cocktail hour', 'Children shallow splash bay'],
    },
    {
      title: 'The Azure Room (Michelin-Rated Dining)',
      category: 'Gastronomy',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      description: 'Led by Chef Jean-Luc Fontaine. Celebrating the rich bounties of local coastal waters with an 8-course tasting menu paired with grand cru wines.',
      inclusions: ['Farm-to-table organic produce', 'Cellar of 2,400+ vintage wines', 'Private dining salons', 'Chef omakase counter'],
    },
    {
      title: 'Ocean Beach Club & Private Cabanas',
      category: 'Seaside Leisure',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      description: 'Exclusive beachside haven with reserved daybed cabanas, beachfront beverage butler service, water sport gear, and private sunset firepits.',
      inclusions: ['Private teak cabanas', 'Chilled beverage service', 'Paddleboards & kayaks', 'Sunset lounge music sessions'],
    },
    {
      title: 'Private Catamaran & Coastal Charters',
      category: 'Adventures',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      description: 'Charter the hotel’s custom 65-foot sailing yacht for dolphin watching, twilight champagne cruises, and secluded beach picnics.',
      inclusions: ['Licensed captain & crew', 'Gourmet charcuterie & vintage champagne', 'Snorkeling & paddleboards', 'Sunset photography package'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Bespoke Luxury Amenities</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          An Unparalleled World of Leisure & Indulgence
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          From sunrise yoga on secluded shores to candlelit seaside gastronomy, immerse yourself in world-class amenities designed to elevate your stay into an enduring memory.
        </p>
      </div>

      {/* Grid of Experiences */}
      <div className="space-y-12">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className={`flex flex-col lg:flex-row items-center gap-8 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs p-6 sm:p-8 ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shrink-0">
              <img
                src={exp.image}
                alt={exp.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="w-full lg:w-1/2 space-y-4">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
                {exp.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {exp.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {exp.description}
              </p>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block mb-2">Featured Inclusions:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {exp.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resort Quick Perks Grid */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold">Complimentary for All In-House Guests</h3>
          <p className="text-xs text-slate-400">Included automatically with any suite or room reservation.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <Wifi className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm">Ultra Fiber Wi-Fi</h4>
            <p className="text-[11px] text-slate-400">1 Gbps throughout all grounds</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <Dumbbell className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm">Fitness Pavilion</h4>
            <p className="text-[11px] text-slate-400">Technogym gear & personal trainers</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <Briefcase className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm">Executive Lounge</h4>
            <p className="text-[11px] text-slate-400">Boardrooms & printing services</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <ShieldCheck className="w-6 h-6 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm">24/7 Concierge</h4>
            <p className="text-[11px] text-slate-400">Custom excursions & reservations</p>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onExploreRooms}
            className="px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Book Your Stay Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
