import React from 'react';
import { Hotel, Phone, Mail, MapPin, Shield, Heart, Award, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  openDbModal: () => void;
  openMernModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openDbModal, openMernModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Hotel Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white">HotelPro</span>
                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest">
                  Luxury Oceanfront Hotel & Suites
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Curating exceptional coastal getaways and five-star hospitality. Where architectural refinement meets world-class personalized service.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Award className="w-4 h-4" />
              <span>Ranked #1 Luxury Seaside Hotel 2026</span>
            </div>
          </div>

          {/* Col 2: Concierge & Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">Concierge & Inquiries</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>1088 Ocean Drive, Coral Bay Haven, CA 90210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+1 (800) 555-HOTEL (24/7)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>reservations@hotelpro.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Guaranteed Best Rate & Flexible Cancellation</span>
              </li>
            </ul>
          </div>

          {/* Col 3: MERN Stack Architecture */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">MERN Stack Power</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered with full production MERN architecture for fast response times, real-time booking safety, and persistent MongoDB storage.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">React.js 19</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700">Node.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">Express.js</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-green-400 border border-slate-700">MongoDB Mongoose</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">JWT Auth</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">Tailwind CSS</span>
            </div>
            <div className="pt-1 flex gap-2">
              <button
                onClick={openDbModal}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                Database Status <ArrowUpRight className="w-3 h-3" />
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={openMernModal}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 underline underline-offset-4 cursor-pointer"
              >
                Setup & Deploy Guide <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white">Guest Privileges</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Complimentary valet parking & airport shuttle</li>
              <li>• Access to infinity edge oceanfront pool</li>
              <li>• Signature Michelin-guide restaurant reservations</li>
              <li>• 24-hour in-suite dining & sommelier service</li>
              <li>• High-speed fiber Wi-Fi throughout resort</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HotelPro Hotel & Suites. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Hospitality Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
