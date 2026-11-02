import React, { useState, useEffect, useCallback } from 'react';
import { 
  BellRing, 
  Send, 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  Smartphone, 
  Eye, 
  MousePointerClick, 
  Clock, 
  Search, 
  Crown,
  Zap,
  Heart,
  UserCheck
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';
import type { 
  NotificationMetricSummary, 
  NotificationClickItem, 
  NotificationCampaignItem 
} from '../types';

interface DailyNotificationsTabProps {
  adminToken: string;
  onShowToast: (msg: string) => void;
}

export const DailyNotificationsTab: React.FC<DailyNotificationsTabProps> = ({
  adminToken,
  onShowToast
}) => {
  // Metrics & Data State
  const [summary, setSummary] = useState<NotificationMetricSummary>({
    totalCampaigns: 0,
    totalSent: 0,
    totalClicks: 0,
    overallCtr: 0,
    totalRegisteredDevices: 0
  });
  const [recentClicks, setRecentClicks] = useState<NotificationClickItem[]>([]);
  const [campaigns, setCampaigns] = useState<NotificationCampaignItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters for Clicks Table
  const [clickSearch, setClickSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [screenFilter, setScreenFilter] = useState<'all' | 'matches' | 'discover' | 'my_profile'>('all');

  // Manual Trigger Modal State
  const [showTriggerModal, setShowTriggerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<'smart_psych' | 'curated' | 'curiosity' | 'incomplete' | 'custom'>('smart_psych');
  const [targetAudience, setTargetAudience] = useState<'all' | 'incomplete'>('all');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  // 1. Fetch Metrics & Real-time Clicks
  const fetchMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/notifications/metrics?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      const data = await res.json();
      if (data.success && data.metrics) {
        setSummary(data.metrics.summary);
        setRecentClicks(data.metrics.recentClicks || []);
        setCampaigns(data.metrics.campaigns || []);
      }
    } catch (err) {
      console.error('[NotificationsTab] Failed to fetch metrics:', err);
      onShowToast('Could not load notification metrics. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, onShowToast]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // 2. Handle Manual Campaign Dispatch
  const handleTriggerCampaign = async () => {
    if (selectedPreset === 'custom') {
      if (!customTitle.trim() || !customMessage.trim()) {
        onShowToast('Please provide both title and message for custom notification.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/notifications/daily/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          category: selectedPreset,
          targetType: targetAudience,
          customTitle: selectedPreset === 'custom' ? customTitle.trim() : undefined,
          customMessage: selectedPreset === 'custom' ? customMessage.trim() : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        onShowToast(`⚡ Dispatched successfully to ${data.sentCount} members (${data.pushDispatched || 0} push devices)!`);
        setShowTriggerModal(false);
        fetchMetrics();
      } else {
        onShowToast(`Failed: ${data.error || 'Server error'}`);
      }
    } catch (err: any) {
      console.error('[TriggerDailyNotification] Error:', err);
      onShowToast(`Error: ${err.message || 'Network failure'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preset preview generation
  const getPresetPreview = () => {
    switch (selectedPreset) {
      case 'smart_psych':
        return {
          title: 'Aaj ka Rishta of the Day ✨ (Dynamic by User)',
          body: 'Active: "Kisi ne aapki profile shortlist ki hai!" · Inactive: "Aapke shahar se naye rishtay aaye hain" · Incomplete: "Aapki profile adhoori hai!"',
          tag: 'Smart Psychological Adaptive'
        };
      case 'curated':
        return {
          title: 'Aaj ka Rishta of the Day ✨',
          body: 'Kisi ne aapki profile shortlist ki hai! Dekhein aaj aapke liye perfect match kon hai.',
          tag: 'Daily Curated Pick'
        };
      case 'curiosity':
        return {
          title: 'Aapki profile view hui hai 👀',
          body: 'Pichle 24 ghanton mein logon ne aapki profile check ki. Dekhein kahan se inquiry aayi hai.',
          tag: 'Curiosity & Validation'
        };
      case 'incomplete':
        return {
          title: 'Aapki profile adhoori hai! 🌟',
          body: 'Sirf 2 zaroori details daal kar 3x zyada rishte dekhein. Log aapka intezar kar rahe hain.',
          tag: 'Onboarding Completion'
        };
      case 'custom':
        return {
          title: customTitle.trim() || 'Custom Title Here...',
          body: customMessage.trim() || 'Custom message copy text will appear here on user phones...',
          tag: 'Custom Campaign'
        };
    }
  };

  const preview = getPresetPreview();

  // Filtered Clicks
  const filteredClicks = recentClicks.filter(c => {
    const matchesSearch = 
      !clickSearch.trim() ||
      c.fullName.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.phone.toLowerCase().includes(clickSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(clickSearch.toLowerCase());

    const matchesGender = genderFilter === 'all' || c.gender.toLowerCase() === genderFilter;
    const matchesScreen = screenFilter === 'all' || c.targetScreen.toLowerCase() === screenFilter;

    return matchesSearch && matchesGender && matchesScreen;
  });

  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111625] p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
            <BellRing className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Daily Notification Engine & Engagement</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Auto Cron: 9:30 PM PKT
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">
              Psychological push triggers, retention campaigns & real-time user click audits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMetrics}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setShowTriggerModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition transform active:scale-95 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Manual Trigger Push</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Campaigns */}
        <div className="bg-[#111625] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaigns Sent</div>
          <div className="mt-2 text-2xl font-black text-white">{summary.totalCampaigns}</div>
          <div className="mt-1 text-[11px] text-purple-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>Auto & Manual</span>
          </div>
        </div>

        {/* Total Push Dispatched */}
        <div className="bg-[#111625] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Dispatched</div>
          <div className="mt-2 text-2xl font-black text-white">{summary.totalSent.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-slate-400">In-App + Android Push</div>
        </div>

        {/* Total Clicks / App Opens */}
        <div className="bg-[#111625] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clicks (App Opens)</div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{summary.totalClicks.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-emerald-500/90 flex items-center space-x-1 font-medium">
            <MousePointerClick className="w-3 h-3" />
            <span>Tracked Opens</span>
          </div>
        </div>

        {/* CTR % */}
        <div className="bg-[#111625] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Click-Through Rate</div>
          <div className="mt-2 text-2xl font-black text-amber-400">{summary.overallCtr}%</div>
          <div className="mt-1 text-[11px] text-amber-400/90 font-medium flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Engagement Rate</span>
          </div>
        </div>

        {/* Registered FCM Devices */}
        <div className="bg-[#111625] p-5 rounded-2xl border border-white/10 relative overflow-hidden col-span-2 md:col-span-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">FCM Mobile Devices</div>
          <div className="mt-2 text-2xl font-black text-sky-400">{summary.totalRegisteredDevices.toLocaleString()}</div>
          <div className="mt-1 text-[11px] text-sky-400/90 flex items-center space-x-1 font-medium">
            <Smartphone className="w-3 h-3" />
            <span>Active Push Tokens</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Who Clicked & When ("Kis ny click kiya aur kab kiya") */}
      <div className="bg-[#111625] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Real-Time Click Audit</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300">
                {filteredClicks.length} Clicks Logged
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct verification of users who received the notification and tapped to open the application.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, city, phone..."
                value={clickSearch}
                onChange={e => setClickSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-52"
              />
            </div>

            <select
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Brothers</option>
              <option value="female">Sisters</option>
            </select>

            <select
              value={screenFilter}
              onChange={e => setScreenFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Screens</option>
              <option value="matches">Matches Screen</option>
              <option value="discover">Discover Feed</option>
              <option value="my_profile">My Profile</option>
            </select>
          </div>
        </div>

        {/* Clicks Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Member (Who Clicked)</th>
                <th className="py-3 px-4">City & Contact</th>
                <th className="py-3 px-4">Notification Clicked</th>
                <th className="py-3 px-4">Target Screen</th>
                <th className="py-3 px-6 text-right">When Clicked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredClicks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <MousePointerClick className="w-8 h-8 text-slate-600" />
                      <p className="text-sm font-medium">No click telemetry recorded yet for this filter</p>
                      <p className="text-xs text-slate-500">
                        Trigger a test notification above or wait for users to open daily notifications.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClicks.map(click => (
                  <tr key={click.clickId} className="hover:bg-white/[0.02] transition">
                    {/* User Info */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                          {click.photoUrl ? (
                            <img src={click.photoUrl} alt={click.fullName} className="w-full h-full object-cover" />
                          ) : (
                            <span>{click.fullName.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-semibold text-white">{click.fullName}</span>
                            {click.isVip && (
                              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                            <span className={click.gender === 'female' ? 'text-pink-400' : 'text-blue-400'}>
                              {click.gender === 'female' ? 'Sister' : 'Brother'}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-500">{click.userId.substring(0, 10)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* City & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-white text-xs font-medium">{click.city || 'Pakistan'}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {click.phone || click.email || '—'}
                      </div>
                    </td>

                    {/* Notification Title & Hook */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-purple-300 flex items-center space-x-1.5">
                        <BellRing className="w-3 h-3 flex-shrink-0" />
                        <span className="line-clamp-1">{click.campaignTitle}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 capitalize">
                        Hook: {click.campaignCategory.replace('_', ' ')}
                      </div>
                    </td>

                    {/* Destination Screen */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        click.targetScreen === 'matches' 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : click.targetScreen === 'discover'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {click.targetScreen === 'matches' ? '💍 Matches Tab' : click.targetScreen === 'discover' ? '🔍 Discover Feed' : '👤 My Profile'}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center justify-end space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(click.clickedAt)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(click.clickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(click.clickedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Dispatch History Table */}
      <div className="bg-[#111625] rounded-3xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Campaign History & Conversions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Historical record of both automated 9:30 PM cron triggers and manual push dispatches.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Date & Trigger</th>
                <th className="py-3 px-4">Campaign Title & Hook</th>
                <th className="py-3 px-4">Audience</th>
                <th className="py-3 px-4">Dispatched</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-6 text-right">Conversion (CTR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No campaign records available yet.
                  </td>
                </tr>
              ) : (
                campaigns.map(camp => (
                  <tr key={camp.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-6">
                      <div className="text-xs font-semibold text-white">
                        {new Date(camp.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                        <span className={`px-1.5 py-0.2 rounded ${camp.triggerType === 'cron' ? 'bg-sky-500/20 text-sky-300' : 'bg-purple-500/20 text-purple-300'}`}>
                          {camp.triggerType === 'cron' ? 'Automated Cron (9:30 PM)' : 'Manual Admin'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-white line-clamp-1">{camp.title}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{camp.message}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs text-slate-300 capitalize">{camp.targetType}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-white">
                      {camp.sentCount}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-400 font-bold">
                      {camp.clickedCount}
                    </td>

                    <td className="py-3.5 px-6 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        camp.ctr >= 20 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : camp.ctr >= 10
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-700 text-slate-300'
                      }`}>
                        {camp.ctr}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Trigger Campaign Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#111625] w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Manual Trigger Push Campaign</h3>
                  <p className="text-xs text-slate-400">Dispatch psychological push notifications to mobile devices</p>
                </div>
              </div>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center text-sm transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Preset Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  1. Select Psychological Hook Strategy
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* Smart Psych */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('smart_psych')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedPreset === 'smart_psych'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Smart Adaptive Mix (Rec)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Adaptive per user: Incomplete, Inactive city matches & Daily Pick.
                    </div>
                  </button>

                  {/* Curated Pick */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('curated')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedPreset === 'curated'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Daily Rishta of the Day</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      "Kisi ne aapki profile shortlist ki hai! Dekhein aaj ka match."
                    </div>
                  </button>

                  {/* Curiosity Gap */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('curiosity')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedPreset === 'curiosity'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Profile Views Curiosity</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      "Aapki profile view hui hai 👀 - Logon ne visit kiya hai."
                    </div>
                  </button>

                  {/* Incomplete Profiles */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('incomplete')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedPreset === 'incomplete'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                      <span>Incomplete Profile Nudge</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      "Sirf 2 details daal kar 3x zyada rishte dekhein."
                    </div>
                  </button>

                  {/* Custom Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedPreset('custom')}
                    className={`p-3 rounded-2xl border text-left transition col-span-1 md:col-span-2 cursor-pointer ${
                      selectedPreset === 'custom'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Custom Psychological Hook</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Compose your own high-conversion title and hook message.
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Input Fields if Selected */}
              {selectedPreset === 'custom' && (
                <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Custom Notification Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Aaj ka special rishta notification ✨"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Custom Message / Hook</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Kisi ne aapko shortlist kiya hai, foran open karein..."
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Target Audience */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  2. Target Audience
                </label>
                <div className="flex space-x-3">
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="targetAudience"
                      checked={targetAudience === 'all'}
                      onChange={() => setTargetAudience('all')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>All Active Members</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="targetAudience"
                      checked={targetAudience === 'incomplete'}
                      onChange={() => setTargetAudience('incomplete')}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span>Incomplete Profiles Only</span>
                  </label>
                </div>
              </div>

              {/* Mobile Phone Notification Banner Preview */}
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  3. Mobile Notification Preview (Android System Tray)
                </label>
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 shadow-inner flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF2560] to-[#D8134B] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md">
                    Q
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">Qurb Matrimony • now</span>
                      <span className="text-[10px] text-purple-400 font-semibold">{preview.tag}</span>
                    </div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">{preview.title}</div>
                    <div className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{preview.body}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
              <button
                type="button"
                onClick={() => setShowTriggerModal(false)}
                className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerCampaign}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-600/30 transition transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Notification Now</span>
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
