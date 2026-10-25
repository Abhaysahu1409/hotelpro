import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Terminal,
  Server,
  Database,
  Cloud,
  CheckCircle,
  Copy,
  Check,
  Code2,
  KeyRound,
  Compass,
} from 'lucide-react';

interface MernDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MernDocsModal: React.FC<MernDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'local' | 'deployment' | 'api'>('architecture');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">HotelPro – Beginner MERN Architecture & Guide</h3>
              <p className="text-xs text-amber-200/80">Complete Walkthrough: Codebase Structure, MongoDB, & Deployment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2">
          {[
            { id: 'architecture', label: 'MERN Stack Flow', icon: Code2 },
            { id: 'local', label: 'Run Locally (5 Min)', icon: Terminal },
            { id: 'deployment', label: 'Deploy & GitHub', icon: Cloud },
            { id: 'api', label: 'API Endpoints', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-amber-600 text-amber-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-semibold text-amber-950 text-sm mb-1">What makes this a true MERN application?</h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>MERN</strong> stands for <strong>MongoDB</strong> (Database), <strong>Express.js</strong> (Backend REST framework), <strong>React.js</strong> (Interactive UI), and <strong>Node.js</strong> (JavaScript runtime). HotelPro demonstrates how all 4 layers communicate cleanly.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>MongoDB & Mongoose</span>
                  </div>
                  <p className="text-slate-500">
                    Defined in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">server/models/</code>. Schemas for Users (with bcrypt hashed passwords), Rooms (with capacities & amenities), and Bookings (with dates & reference IDs).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Server className="w-4 h-4 text-amber-600" />
                    <span>Express.js & Node.js</span>
                  </div>
                  <p className="text-slate-500">
                    Organized in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">server/routes/</code>. Exposes clean REST endpoints for auth, room search, booking conflicts, and admin controls.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    <span>JWT Authentication</span>
                  </div>
                  <p className="text-slate-500">
                    Located in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">server/middleware/auth.ts</code>. Signs tokens on login/register and guards private routes using <code className="font-mono">verifyToken</code> & <code className="font-mono">requireAdmin</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>React.js 19 Frontend</span>
                  </div>
                  <p className="text-slate-500">
                    Reactive components in <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">src/</code> with React Context for global authentication, date-range availability checks, and printable booking receipts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Step-by-Step Local Machine Setup:</h4>

              <div className="space-y-3">
                {[
                  {
                    step: '1. Clone repository & install dependencies',
                    code: 'git clone https://github.com/your-username/hotelpro.git\ncd hotelpro\nnpm install',
                  },
                  {
                    step: '2. Create your .env file',
                    code: 'cp .env.example .env',
                  },
                  {
                    step: '3. (Optional) Set your MongoDB Atlas URI',
                    code: 'MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hotelpro?retryWrites=true&w=majority\n# If omitted, HotelPro automatically uses embedded zero-config mode!',
                  },
                  {
                    step: '4. Start the Full-Stack Dev Server',
                    code: 'npm run dev',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>{item.step}</span>
                      <button
                        onClick={() => copyCode(item.code, idx)}
                        className="text-slate-500 hover:text-slate-900 flex items-center gap-1 text-[11px]"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre">
                      {item.code}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 text-sm">Pushing to GitHub & Public Deployment</h4>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-semibold text-slate-900 block">Deploying to Render, Railway, or Cloud Run:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li>Push your repository to GitHub (<code className="font-mono bg-white px-1">git push -u origin main</code>).</li>
                  <li>In Render or Railway, create a new <strong>Web Service</strong> and select your GitHub repo.</li>
                  <li>Set <strong>Build Command</strong> to: <code className="font-mono bg-white px-1 font-bold">npm run build</code></li>
                  <li>Set <strong>Start Command</strong> to: <code className="font-mono bg-white px-1 font-bold">npm start</code></li>
                  <li>Add your Environment Variables: <code className="font-mono bg-white px-1">MONGODB_URI</code> and <code className="font-mono bg-white px-1">JWT_SECRET</code>.</li>
                  <li>Click <strong>Deploy</strong> — your public live demo link will be ready in ~2 minutes!</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 text-sm">Key REST API Routes</h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-emerald-700">POST</strong> /api/auth/register</span>
                  <span className="text-[11px] text-slate-500 font-sans">Register new guest</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-emerald-700">POST</strong> /api/auth/login</span>
                  <span className="text-[11px] text-slate-500 font-sans">Authenticate & get JWT</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-sky-700">GET</strong> /api/rooms</span>
                  <span className="text-[11px] text-slate-500 font-sans">Search, filter & date check</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-emerald-700">POST</strong> /api/bookings</span>
                  <span className="text-[11px] text-slate-500 font-sans">Create booking (JWT required)</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-sky-700">GET</strong> /api/bookings/my</span>
                  <span className="text-[11px] text-slate-500 font-sans">View user's reservations</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-amber-700">PATCH</strong> /api/bookings/:id/cancel</span>
                  <span className="text-[11px] text-slate-500 font-sans">Cancel reservation</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span><strong className="text-purple-700">GET</strong> /api/admin/stats</span>
                  <span className="text-[11px] text-slate-500 font-sans">Admin KPI revenue & stats</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Got it, return to App
          </button>
        </div>
      </div>
    </div>
  );
};
