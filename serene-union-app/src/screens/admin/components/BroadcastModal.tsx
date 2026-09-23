import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendBroadcast: (title: string, message: string) => Promise<void>;
  isBroadcasting: boolean;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSendBroadcast,
  isBroadcasting
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    await onSendBroadcast(title.trim(), message.trim());
    setTitle('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Megaphone className="w-5 h-5 text-[#FF2560]" />
            <h3 className="text-base font-bold text-white font-serif">Global Announcement</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          This message will be broadcast directly into the notifications inbox of all registered members.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Announcement Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Jummah Mubarak! New Security Features"
              required
              className="w-full px-3.5 py-2.5 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF2560]/50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Message Content
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your official announcement here..."
              rows={4}
              required
              className="w-full px-3.5 py-2.5 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#FF2560]/50 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBroadcasting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF2560] to-[#D8134B] hover:from-[#FF4D7D] hover:to-[#FF2560] text-white text-xs font-semibold shadow-lg shadow-[#FF2560]/30 cursor-pointer disabled:opacity-50"
            >
              {isBroadcasting ? 'Broadcasting...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
