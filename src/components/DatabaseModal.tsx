import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Code,
  Sparkles,
} from 'lucide-react';
import { DbStatusInfo } from '../types';
import { api } from '../services/api';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: DbStatusInfo | null;
  onRefresh: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);
  const [reseeding, setReseeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleUri = 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/hotelpro?retryWrites=true&w=majority';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReseed = async () => {
    setReseeding(true);
    setMessage(null);
    try {
      const res = await api.resetDemoData();
      setMessage(res.message);
      onRefresh();
    } catch (err: any) {
      setMessage('Failed to reseed: ' + err.message);
    } finally {
      setReseeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">MongoDB Database Architecture</h3>
              <p className="text-xs text-slate-400">Connection Diagnostics, Schema & Cloud Atlas Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            status?.connected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            {status?.connected ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">
                  {status?.connected
                    ? 'Active Cloud Connection: MongoDB Atlas'
                    : 'Active Resilient Engine: Embedded Local High-Performance Store'}
                </h4>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-current font-bold">
                  {status?.connected ? 'MONGODB ATLAS' : 'EMBEDDED DB'}
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-600">
                {status?.connected
                  ? `Successfully authenticated to MongoDB cluster [${status.host}]. All reads, writes, and bookings are persisted directly into MongoDB collections.`
                  : 'Currently operating in zero-config local storage mode with full persistence. You can connect to MongoDB Atlas at any time by configuring MONGODB_URI in .env.'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Room Documents</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{status?.totalRooms ?? 6}</p>
              <span className="text-[10px] text-emerald-600 font-medium">Collection: rooms</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Active Bookings</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{status?.totalBookings ?? 2}</p>
              <span className="text-[10px] text-amber-600 font-medium">Collection: bookings</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs text-slate-500 font-medium">Registered Users</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{status?.totalUsers ?? 2}</p>
              <span className="text-[10px] text-purple-600 font-medium">Collection: users</span>
            </div>
          </div>

          {/* How to Connect MongoDB Atlas Step-by-Step */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-600" />
                How to Connect to MongoDB Atlas in 3 Steps
              </h4>
              <a
                href="https://www.mongodb.com/atlas/database"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium"
              >
                MongoDB Atlas <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="text-xs text-slate-600 space-y-2.5 list-decimal list-inside">
              <li>
                <strong className="text-slate-800">Create a Free M0 Cluster:</strong> Go to{' '}
                <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">mongodb.com/atlas</span>, create a free database cluster named <span className="font-semibold text-slate-800">hotelpro</span>.
              </li>
              <li>
                <strong className="text-slate-800">Configure Database User & Network Access:</strong> In Security &gt; Database Access, add a user and password. In Network Access, allow access from anywhere (<span className="font-mono bg-slate-100 px-1 py-0.5 rounded">0.0.0.0/0</span>) for cloud deployment.
              </li>
              <li>
                <strong className="text-slate-800">Set Environment Variable:</strong> Add your connection URI to your <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">.env</span> file:
              </li>
            </ol>

            <div className="relative mt-2 p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-xs flex items-center justify-between overflow-x-auto">
              <code className="pr-8 truncate">{sampleUri}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(sampleUri)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded shrink-0 ml-2"
                title="Copy connection string template"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mongoose Schema Info */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <h4 className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-600" />
              Pre-Configured Mongoose Models & Schemas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block">UserSchema</span>
                <span className="text-[11px] text-slate-500">name, email (unique), password (bcrypt), role, phone</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block">RoomSchema</span>
                <span className="text-[11px] text-slate-500">roomNumber, title, type, price, capacity, amenities, images</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800 block">BookingSchema</span>
                <span className="text-[11px] text-slate-500">reference, userId, roomId, dates, nights, priceBreakdown</span>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {message && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReseed}
            disabled={reseeding}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reseeding ? 'animate-spin' : ''}`} />
            <span>Reset Demo Rooms & Bookings</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
