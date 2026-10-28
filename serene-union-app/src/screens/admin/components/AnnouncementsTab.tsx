import React, { useState, useEffect, useCallback } from 'react';
import { 
  Megaphone, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  ExternalLink, 
  RefreshCw, 
  Trash2, 
  Copy, 
  CheckCircle2, 
  Play, 
  Smartphone,
  ShieldCheck,
  X
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';
import { VerifiedBlueTick } from '../../../components/VerifiedBlueTick';
import type { OfficialAnnouncement } from '../types';

interface AnnouncementsTabProps {
  adminToken: string;
  onShowToast: (msg: string) => void;
}

export const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  adminToken,
  onShowToast
}) => {
  // Form State
  const [title, setTitle] = useState('🚀 Qurb v1.0.37 - Crystal-Clear Voice & Video Calling');
  const [message, setMessage] = useState(
    '🚀 Update Alert: Qurb v1.0.37 is now available on Google Play Store!\n\n✨ New in this version:\n• Crystal-clear HD Voice & Video Calling\n• Zero connection drops with auto-reconnect\n• Enhanced profile security & instant push notifications\n• Smooth chat and media sharing\n\nUpdate now on Google Play Store for the best halal matchmaking experience!'
  );
  const [imageUrl, setImageUrl] = useState('https://qurb.app/announcement_v1037_banner.jpg');
  const [actionUrl, setActionUrl] = useState('https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share');
  const [actionLabel, setActionLabel] = useState('⚡ Update on Google Play Store ↗');

  // History & API State
  const [announcements, setAnnouncements] = useState<OfficialAnnouncement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Approval Modal
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // 1. Fetch Existing Announcements
  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/announcements?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.announcements)) {
        setAnnouncements(data.announcements);
      }
    } catch (err) {
      console.error('[AnnouncementsTab] Fetch error:', err);
      onShowToast('Failed to load past announcements');
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, onShowToast]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // Presets Helper
  const applyCallingBannerPreset = () => {
    setTitle('🚀 Qurb v1.0.37 - Crystal-Clear Voice & Video Calling');
    setImageUrl('https://qurb.app/announcement_v1037_banner.jpg');
    setActionUrl('https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share');
    setActionLabel('⚡ Update on Google Play Store ↗');
    setMessage(
      '🚀 Update Alert: Qurb v1.0.37 is now available on Google Play Store!\n\n✨ New in this version:\n• Crystal-clear HD Voice & Video Calling\n• Zero connection drops with auto-reconnect\n• Enhanced profile security & instant push notifications\n• Smooth chat and media sharing\n\nUpdate now on Google Play Store for the best halal matchmaking experience!'
    );
    onShowToast('Applied v1.0.37 HD Calling banner preset');
  };

  const applySecurityPreset = () => {
    setTitle('🛡️ Modesty & Privacy Guidelines');
    setImageUrl('https://qurb.app/trial_promo_banner.jpg');
    setActionUrl('https://qurb.app/privacy-policy');
    setActionLabel('Read Privacy Guidelines ↗');
    setMessage(
      'Assalamu Alaikum! Your safety, privacy, and modesty are our core values.\n\n• Keep your photos blurred until mutual compatibility is established\n• Involve your Wali early for Barakah and blessed guidance\n• Never share financial details with anyone\n\nMay Allah bless your search with tranquility and goodness.'
    );
    onShowToast('Applied Modesty & Privacy preset');
  };

  // Submit / Broadcast
  const handleConfirmBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      onShowToast('Title and message are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          imageUrl: imageUrl.trim() || null,
          actionUrl: actionUrl.trim() || null,
          actionLabel: actionLabel.trim() || null
        })
      });

      const data = await res.json();
      if (data.success) {
        onShowToast(`🎉 Broadcast delivered to ${data.deliveredCount ?? 'all'} members!`);
        setShowApprovalModal(false);
        fetchAnnouncements();
      } else {
        onShowToast(`Failed: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      onShowToast(`Broadcast error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement from the official channel?')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('Announcement removed');
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      } else {
        onShowToast(`Delete failed: ${data.error || 'Error'}`);
      }
    } catch (err: any) {
      onShowToast(`Delete error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // Populate from history
  const handleCopyToComposer = (ann: OfficialAnnouncement) => {
    setTitle(ann.title || '');
    setMessage(ann.message || '');
    setImageUrl(ann.imageUrl || '');
    setActionUrl(ann.actionUrl || '');
    setActionLabel(ann.actionLabel || 'Open Link ↗');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onShowToast('Copied announcement into composer');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131D33] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white font-serif flex items-center gap-2">
                <span>Official Channel & Broadcast Designer</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Live Sync
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Create rich announcement banners, test mobile rendering live, and broadcast directly to all members' official chat.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAnnouncements}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Designer (Left) & Mobile Phone Mockup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Announcement Designer Form */}
        <div className="lg:col-span-7 bg-[#131D33] border border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Announcement Composer</h2>
            </div>
            {/* Quick Presets */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={applyCallingBannerPreset}
                className="text-[11px] px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-semibold transition-all cursor-pointer"
                title="Fill with v1.0.37 calling update banner"
              >
                ✨ v1.0.37 HD Calling Banner
              </button>
              <button
                type="button"
                onClick={applySecurityPreset}
                className="text-[11px] px-3 py-1 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 font-semibold transition-all cursor-pointer"
              >
                🛡️ Privacy Guide
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Announcement Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🚀 Qurb v1.0.37 - Crystal-Clear Voice & Video Calling"
                className="w-full px-4 py-2.5 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Banner Image URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Promotional Banner Image URL
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-[10px] text-slate-400 hover:text-rose-400 cursor-pointer"
                  >
                    Clear Image
                  </button>
                )}
              </div>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://qurb.app/announcement_v1037_banner.jpg"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Aspect ratio 16:9 recommended. Supports CDN, public assets, or cloud image URLs.
              </p>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Message Body (Release Notes / Announcement Copy)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Type your official update notes, safety guidelines, or greeting..."
                className="w-full px-4 py-3 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed resize-none"
              />
            </div>

            {/* Destination CTA Button Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Call to Action (Action URL)
                </label>
                <div className="relative">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full pl-8 pr-3 py-2 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="⚡ Update on Google Play Store ↗"
                  className="w-full px-3 py-2 bg-[#162038] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Delivery Highlights */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold">Zero-Build Delivery:</span> This announcement will appear instantly at the very top of the chat inbox on both legacy app builds (v1.0.32–v1.0.36) and new versions without requiring an update first.
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setMessage('');
                  setImageUrl('');
                  setActionUrl('');
                  setActionLabel('');
                }}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer transition-all"
              >
                Clear Form
              </button>

              <button
                type="button"
                onClick={() => setShowApprovalModal(true)}
                disabled={!title.trim() || !message.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-600 hover:via-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-lg shadow-rose-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Review & Broadcast Announcement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Smartphone UI Preview */}
        <div className="lg:col-span-5 bg-[#131D33] border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Mobile UI Preview</h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
              App View
            </span>
          </div>

          {/* Smartphone Frame */}
          <div className="flex-1 flex items-center justify-center py-2">
            <div className="w-[320px] bg-slate-950 rounded-[40px] border-[5px] border-slate-700/80 shadow-2xl overflow-hidden flex flex-col text-slate-900 relative">
              {/* Dynamic Island / Notch */}
              <div className="bg-slate-950 pt-2 pb-1 flex justify-center">
                <div className="w-24 h-4 bg-slate-800 rounded-full" />
              </div>

              {/* Chat Screen Top Bar */}
              <div className="bg-white px-3 py-2.5 border-b border-slate-200 flex items-center gap-2 shadow-xs">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    Q
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 truncate">
                    <span>Qurb Team</span>
                    <VerifiedBlueTick size={14} />
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Official Broadcast</span>
                  </div>
                </div>
                <div className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-full text-[9px] font-bold">
                  Verified
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="bg-[#F8FAFC] flex-1 p-3 overflow-y-auto space-y-3 min-h-[360px] max-h-[440px]">
                {/* Official Message Bubble Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-left">
                  {/* Banner Image Preview */}
                  {imageUrl ? (
                    <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Announcement Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-1 border border-white/20">
                        <Megaphone className="w-2.5 h-2.5 text-amber-400" />
                        <span>Official Alert</span>
                      </div>
                    </div>
                  ) : null}

                  {/* Body Content */}
                  <div className="p-3 space-y-2">
                    {title && (
                      <h3 className="font-serif font-bold text-xs text-slate-900 leading-snug">
                        {title}
                      </h3>
                    )}

                    <p className="text-[11px] text-slate-700 leading-relaxed whitespace-pre-line">
                      {message || 'Type message to preview...'}
                    </p>

                    {/* Action CTA Button */}
                    {actionUrl && (
                      <div className="pt-2">
                        <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1.5 text-center">
                          <Play className="w-3 h-3 fill-current" />
                          <span>{actionLabel || 'Update on Google Play Store ↗'}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Just now</span>
                      <CheckCircle2 className="w-3 h-3 text-sky-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Footer Banner */}
              <div className="bg-slate-100 border-t border-slate-200 p-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <Megaphone className="w-3 h-3 text-sky-600 shrink-0" />
                <span>This is an official announcement channel.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast History & Manage Existing Announcements */}
      <div className="bg-[#131D33] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Official Announcements ({announcements.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Visible in all active chat inboxes
          </span>
        </div>

        {announcements.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No official announcements published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-[#0B101E] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all shadow-md group"
              >
                <div>
                  {ann.imageUrl ? (
                    <div className="w-full aspect-video bg-slate-900 overflow-hidden relative">
                      <img
                        src={ann.imageUrl}
                        alt={ann.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-16 bg-gradient-to-r from-slate-900 to-[#162038] flex items-center justify-center text-slate-600">
                      <Megaphone className="w-6 h-6 opacity-40" />
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-xs text-white truncate font-serif">
                        {ann.title}
                      </h3>
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                      {ann.message}
                    </p>

                    {ann.actionUrl && (
                      <div className="text-[10px] text-emerald-400 truncate flex items-center gap-1 font-mono">
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{ann.actionLabel || ann.actionUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyToComposer(ann)}
                    className="flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy to Composer</span>
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === ann.id}
                    onClick={() => handleDeleteAnnouncement(ann.id)}
                    className="flex items-center gap-1.5 text-[11px] text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mandatory Broadcast Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0F172A] border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif">Broadcast Approval Confirmation</h3>
                  <p className="text-[11px] text-slate-400">Review announcement before sending to all members</p>
                </div>
              </div>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Announcement Summary Card */}
            <div className="p-4 rounded-2xl bg-[#162038] border border-white/10 space-y-3">
              {imageUrl && (
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="font-bold text-xs text-white font-serif">{title}</div>
              <div className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">{message}</div>
              {actionUrl && (
                <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span>Action Button:</span>
                  <span className="underline">{actionLabel || actionUrl}</span>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="space-y-2 text-xs text-slate-300 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sender Verified: Qurb Team ✓ (Official System Account)</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pinned Channel: Injected automatically into all user chat lists</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Compatible with legacy builds (v1.0.32–v1.0.36) zero-build</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmBroadcast}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/30 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Broadcast to All Users</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
