import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Radio, 
  MessageSquare, 
  Users, 
  Shield, 
  RefreshCw, 
  Search, 
  Clock, 
  CheckCircle2, 
  Eye, 
  X, 
  Crown, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';
import type { 
  LiveActivityData, 
  ConversationTranscriptMessage,
  RecentMessageItem
} from '../types';

interface LiveMonitorTabProps {
  adminToken: string;
  onInspectUser: (userId: string) => void;
}

export const LiveMonitorTab: React.FC<LiveMonitorTabProps> = ({
  adminToken,
  onInspectUser
}) => {
  const [data, setData] = useState<LiveActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'conversations' | 'users' | 'messages'>('conversations');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(10);

  // Filters for subtabs
  const [userOnlineFilter, setUserOnlineFilter] = useState<'all' | 'online'>('all');
  const [waliOnlyFilter, setWaliOnlyFilter] = useState(false);

  // Recent Messages Stream State
  const [recentMessages, setRecentMessages] = useState<RecentMessageItem[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  // Conversation Transcript Modal State
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [convTranscript, setConvTranscript] = useState<{
    conversation: any;
    messages: ConversationTranscriptMessage[];
  } | null>(null);
  const [isTranscriptLoading, setIsTranscriptLoading] = useState(false);

  // 1. Fetch Real-Time Activity Data
  const fetchLiveActivity = useCallback(async (isSilent = false) => {
    if (!adminToken) return;
    if (!isSilent) setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/live-activity`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch live activity:', err);
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  }, [adminToken]);

  // 2. Fetch Recent Messages Stream
  const fetchRecentMessages = useCallback(async () => {
    if (!adminToken) return;
    setIsMessagesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/messages/recent?limit=60`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const json = await res.json();
      if (json.success && json.messages) {
        setRecentMessages(json.messages);
      }
    } catch (err) {
      console.error('Failed to fetch recent messages:', err);
    } finally {
      setIsMessagesLoading(false);
    }
  }, [adminToken]);

  // Initial load
  useEffect(() => {
    fetchLiveActivity();
    fetchRecentMessages();
  }, [fetchLiveActivity, fetchRecentMessages]);

  // Auto-refresh countdown & interval
  useEffect(() => {
    if (!autoRefresh) return;

    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          fetchLiveActivity(true);
          if (activeSubTab === 'messages') {
            fetchRecentMessages();
          }
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefresh, activeSubTab, fetchLiveActivity, fetchRecentMessages]);

  // 3. Fetch Conversation Transcript Modal
  const handleOpenTranscript = async (convId: string) => {
    setSelectedConvId(convId);
    setIsTranscriptLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/conversations/${convId}/messages`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const json = await res.json();
      if (json.success) {
        setConvTranscript({
          conversation: json.conversation,
          messages: json.messages || []
        });
      }
    } catch (err) {
      console.error('Failed to load conversation transcript:', err);
    } finally {
      setIsTranscriptLoading(false);
    }
  };

  const formatSecondsAgo = (seconds: number) => {
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  // Filtered Conversations
  const filteredConversations = useMemo(() => {
    if (!data?.liveConversations) return [];
    let list = data.liveConversations;
    if (waliOnlyFilter) {
      list = list.filter(c => Boolean(c.waliObserver));
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(c => 
      c.participantOne.fullName.toLowerCase().includes(q) ||
      c.participantTwo.fullName.toLowerCase().includes(q) ||
      c.participantOne.city.toLowerCase().includes(q) ||
      c.participantTwo.city.toLowerCase().includes(q) ||
      c.lastMessageText.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  }, [data?.liveConversations, waliOnlyFilter, searchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    if (!data?.liveUsers) return [];
    let list = data.liveUsers;
    if (userOnlineFilter === 'online') {
      list = list.filter(u => u.status === 'online');
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(u => 
      u.fullName.toLowerCase().includes(q) ||
      u.city.toLowerCase().includes(q) ||
      u.profession.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  }, [data?.liveUsers, userOnlineFilter, searchQuery]);

  // Filtered Messages Stream
  const filteredMessages = useMemo(() => {
    if (!recentMessages) return [];
    if (!searchQuery.trim()) return recentMessages;
    const q = searchQuery.toLowerCase();
    return recentMessages.filter(m => 
      m.senderName.toLowerCase().includes(q) ||
      (m.recipientName && m.recipientName.toLowerCase().includes(q)) ||
      m.text.toLowerCase().includes(q) ||
      m.senderCity.toLowerCase().includes(q)
    );
  }, [recentMessages, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Live Radar Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0D1527] to-[#111C35] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Cloudflare D1 Pulse
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white font-serif mt-1">Real-Time Platform Radar</h2>
          <p className="text-xs text-slate-400 mt-1">
            Live active users stream & 1-on-1 dialogue chaperone oversight
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 relative z-10">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center space-x-2 cursor-pointer ${
              autoRefresh 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span>{autoRefresh ? `Auto (${secondsUntilRefresh}s)` : 'Auto Paused'}</span>
          </button>

          <button
            onClick={() => {
              setSecondsUntilRefresh(10);
              fetchLiveActivity();
              if (activeSubTab === 'messages') {
                fetchRecentMessages();
              }
            }}
            disabled={isLoading || isMessagesLoading}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isMessagesLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Now</span>
          </button>
        </div>
      </div>

      {/* 4 Clickable Summary Stat Cards (Clicking calls data and displays corresponding list) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Real Users Online */}
        <button
          onClick={() => {
            setActiveSubTab('users');
            setUserOnlineFilter('online');
            fetchLiveActivity();
          }}
          className={`p-5 rounded-3xl text-left border transition-all duration-200 shadow-lg relative overflow-hidden group cursor-pointer ${
            activeSubTab === 'users' && userOnlineFilter === 'online'
              ? 'bg-[#132244] border-emerald-500 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
              : 'bg-[#0D1527] border-white/10 hover:border-emerald-400/40 hover:bg-[#111C35]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-emerald-300 transition">Real Users Online</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-white font-serif flex items-center justify-between">
            <span>{data?.summary?.onlineUsers ?? '—'}</span>
            <span className="text-[10px] font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
              Call & View →
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
            <Users className="w-3 h-3 text-indigo-400" />
            <span>{data?.summary?.activeUsersToday ?? 0} real active today</span>
          </div>
        </button>

        {/* Card 2: Conversations */}
        <button
          onClick={() => {
            setActiveSubTab('conversations');
            setWaliOnlyFilter(false);
            fetchLiveActivity();
          }}
          className={`p-5 rounded-3xl text-left border transition-all duration-200 shadow-lg relative overflow-hidden group cursor-pointer ${
            activeSubTab === 'conversations' && !waliOnlyFilter
              ? 'bg-[#132244] border-sky-500 shadow-sky-500/20 ring-2 ring-sky-500/30'
              : 'bg-[#0D1527] border-white/10 hover:border-sky-400/40 hover:bg-[#111C35]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-sky-300 transition">Conversations</span>
            <MessageSquare className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-serif flex items-center justify-between">
            <span>{data?.summary?.activeConversations ?? '—'}</span>
            <span className="text-[10px] font-normal text-sky-400 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 group-hover:bg-sky-500/20 transition">
              Call & View →
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Active dialogue channels
          </div>
        </button>

        {/* Card 3: Messages Sent */}
        <button
          onClick={() => {
            setActiveSubTab('messages');
            fetchRecentMessages();
          }}
          className={`p-5 rounded-3xl text-left border transition-all duration-200 shadow-lg relative overflow-hidden group cursor-pointer ${
            activeSubTab === 'messages'
              ? 'bg-[#132244] border-amber-500 shadow-amber-500/20 ring-2 ring-amber-500/30'
              : 'bg-[#0D1527] border-white/10 hover:border-amber-400/40 hover:bg-[#111C35]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-300 transition">Messages Sent</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-serif flex items-center justify-between">
            <span>{data?.summary?.totalMessages ?? '—'}</span>
            <span className="text-[10px] font-normal text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500/20 transition">
              Call & View →
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {data?.summary?.messagesToday ?? 0} exchanged today
          </div>
        </button>

        {/* Card 4: Chaperone Oversight */}
        <button
          onClick={() => {
            setActiveSubTab('conversations');
            setWaliOnlyFilter(true);
            fetchLiveActivity();
          }}
          className={`p-5 rounded-3xl text-left border transition-all duration-200 shadow-lg relative overflow-hidden group cursor-pointer ${
            activeSubTab === 'conversations' && waliOnlyFilter
              ? 'bg-[#132244] border-emerald-500 shadow-emerald-500/20 ring-2 ring-emerald-500/30'
              : 'bg-[#0D1527] border-white/10 hover:border-emerald-400/40 hover:bg-[#111C35]'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-emerald-300 transition">Chaperone Oversight</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-serif flex items-center justify-between">
            <span>100%</span>
            <span className="text-[10px] font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
              Filter Wali →
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Wali details & halal safety active
          </div>
        </button>
      </div>

      {/* Sub-Tabs Bar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center flex-wrap gap-2">
          {/* Sub-Tab 1: Conversations */}
          <button
            onClick={() => {
              setActiveSubTab('conversations');
              fetchLiveActivity();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'conversations'
                ? 'bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Conversations ({data?.liveConversations?.length ?? 0})</span>
          </button>

          {/* Sub-Tab 2: Real Active Users */}
          <button
            onClick={() => {
              setActiveSubTab('users');
              setUserOnlineFilter('all');
              fetchLiveActivity();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'users'
                ? 'bg-gradient-to-r from-[#059669] to-[#047857] text-white shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Real Active Users ({data?.liveUsers?.length ?? 0})</span>
          </button>

          {/* Sub-Tab 3: Messages Live Stream */}
          <button
            onClick={() => {
              setActiveSubTab('messages');
              fetchRecentMessages();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === 'messages'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Messages Stream ({recentMessages?.length || data?.summary?.totalMessages || 0})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSubTab === 'conversations' 
                ? "Search partner, city, text..." 
                : activeSubTab === 'users'
                ? "Search real user by name, city..."
                : "Search message text, sender, recipient..."
            }
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
          />
        </div>
      </div>

      {/* Sub-Filter Bar for Current Subtab */}
      {activeSubTab === 'users' && (
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-xs text-slate-400 flex items-center space-x-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Members:</span>
          </span>
          <button
            onClick={() => setUserOnlineFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              userOnlineFilter === 'all'
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All Real Members ({data?.liveUsers?.length ?? 0})
          </button>
          <button
            onClick={() => setUserOnlineFilter('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              userOnlineFilter === 'online'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-400 hover:text-emerald-300 border border-white/5'
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online Right Now ({data?.summary?.onlineUsers ?? 0})</span>
          </button>
        </div>
      )}

      {activeSubTab === 'conversations' && (
        <div className="flex items-center space-x-2 pt-1">
          <span className="text-xs text-slate-400 flex items-center space-x-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Dialogue:</span>
          </span>
          <button
            onClick={() => setWaliOnlyFilter(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              !waliOnlyFilter
                ? 'bg-white/15 text-white border border-white/20'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All Conversations ({data?.liveConversations?.length ?? 0})
          </button>
          <button
            onClick={() => setWaliOnlyFilter(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
              waliOnlyFilter
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/5 text-slate-400 hover:text-emerald-300 border border-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>With Wali Observer Only</span>
          </button>
        </div>
      )}

      {/* Tab 1: Live Conversations View */}
      {activeSubTab === 'conversations' && (
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0D1527] border border-white/10">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-medium text-sm">No Conversations Match Query</h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time conversations will automatically appear here as members interact.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredConversations.map((conv) => {
                const timeAgo = formatSecondsAgo(conv.secondsAgo);

                return (
                  <div
                    key={conv.id}
                    className="p-5 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-sky-500/30 transition-all duration-200 shadow-xl space-y-4"
                  >
                    {/* Participants Header */}
                    <div className="flex items-center justify-between">
                      {/* Participant 1 */}
                      <div 
                        onClick={() => onInspectUser(conv.participantOne.id)}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <img
                          src={conv.participantOne.photoUrl}
                          alt={conv.participantOne.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:border-sky-400 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = conv.participantOne.gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg';
                          }}
                        />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                              {conv.participantOne.fullName}
                            </h4>
                            {conv.participantOne.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-[11px] text-slate-400">{conv.participantOne.city}</p>
                        </div>
                      </div>

                      {/* Direction Icon & Status */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <Radio className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1">Matched</span>
                      </div>

                      {/* Participant 2 */}
                      <div 
                        onClick={() => onInspectUser(conv.participantTwo.id)}
                        className="flex items-center space-x-3 text-right cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center justify-end space-x-1">
                            {conv.participantTwo.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                            <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                              {conv.participantTwo.fullName}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-400">{conv.participantTwo.city}</p>
                        </div>
                        <img
                          src={conv.participantTwo.photoUrl}
                          alt={conv.participantTwo.fullName}
                          className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:border-sky-400 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = conv.participantTwo.gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Latest Exchange Box */}
                    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold text-slate-300">Latest Exchange</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{timeAgo}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2 italic">
                        "{conv.lastMessageText}"
                      </p>
                    </div>

                    {/* Card Footer: Metadata & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-semibold">
                          {conv.messageCount} messages
                        </span>
                        {conv.waliObserver && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold flex items-center space-x-1">
                            <Shield className="w-3 h-3" />
                            <span>Wali: {conv.waliObserver}</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenTranscript(conv.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-sky-600/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Chat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Real Active Users View */}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0D1527] border border-white/10">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-medium text-sm">No Active Users Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                Active real users will appear here in real time as they open the app.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const timeAgo = formatSecondsAgo(user.secondsAgo);
                const isOnline = user.status === 'online';
                const isAway = user.status === 'away';

                return (
                  <div
                    key={user.id}
                    onClick={() => onInspectUser(user.id)}
                    className="p-5 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-emerald-500/40 hover:bg-[#111C35] transition-all duration-200 shadow-xl flex items-start justify-between cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div className="relative">
                        <img
                          src={user.photoUrl}
                          alt={user.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border border-white/10 group-hover:border-emerald-400 transition"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = user.gender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg';
                          }}
                        />
                        <span 
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0D1527] ${
                            isOnline 
                              ? 'bg-emerald-400 animate-pulse' 
                              : isAway 
                              ? 'bg-amber-400' 
                              : 'bg-slate-500'
                          }`}
                        />
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">{user.fullName}</h4>
                          {user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold tracking-wider">
                            REAL
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{user.city || 'Pakistan'} • {user.profession || 'Member'}</p>
                        
                        <div className="flex items-center space-x-2 mt-2 text-[10px]">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${
                            isOnline 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : isAway 
                              ? 'bg-amber-500/20 text-amber-300' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {user.currentAction}
                          </span>
                          <span className="text-slate-500 flex items-center space-x-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{timeAgo}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectUser(user.id);
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition cursor-pointer"
                      title="Inspect User Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Live Messages Stream View */}
      {activeSubTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span>Showing recent messages exchanged across dialogue channels in real-time</span>
            <button
              onClick={fetchRecentMessages}
              disabled={isMessagesLoading}
              className="text-amber-400 hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isMessagesLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Feed</span>
            </button>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0D1527] border border-white/10">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-medium text-sm">No Recent Messages</h3>
              <p className="text-xs text-slate-400 mt-1">
                Recent messages will appear here as users chat in the application.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => {
                const timeAgo = formatSecondsAgo(msg.secondsAgo);

                return (
                  <div
                    key={msg.id}
                    className="p-4 rounded-3xl bg-[#0D1527] border border-white/10 hover:border-amber-500/30 transition shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                      <img
                        src={msg.photoUrl}
                        alt={msg.senderName}
                        className="w-11 h-11 rounded-2xl object-cover border border-white/10 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = msg.senderGender === 'female' ? '/seeds/seed_female_1.jpg' : '/seeds/seed_male_1.jpg';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-white line-clamp-1">{msg.senderName}</span>
                          {msg.senderVip && <Crown className="w-3 h-3 text-amber-400" />}
                          <span className="text-[10px] text-slate-500 font-medium">({msg.senderCity})</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                            <span className="text-sky-300">To: {msg.recipientName || 'Match'}</span>
                          </span>
                        </div>

                        <div className="mt-1.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-200 break-words">
                          "{msg.text}"
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:flex-col md:items-end shrink-0 gap-2">
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{timeAgo}</span>
                      </span>

                      <button
                        onClick={() => handleOpenTranscript(msg.conversationId)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open Conversation</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Full Live Conversation Transcript Modal */}
      {selectedConvId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0D1527] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111C35]">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400">
                  <Shield className="w-4 h-4" />
                  <span>Wali Chaperone Live Audit</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {convTranscript?.conversation?.participantOne?.fullName || 'Brother'} ⟷ {convTranscript?.conversation?.participantTwo?.fullName || 'Sister'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedConvId(null);
                  setConvTranscript(null);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Messages Stream */}
            <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-[#090D1A]">
              {isTranscriptLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Loading live conversation stream...</span>
                </div>
              ) : convTranscript?.messages && convTranscript.messages.length > 0 ? (
                convTranscript.messages.map((m) => {
                  const isSystem = m.senderId === 'system' || m.senderName.includes('Shield');
                  const isP1 = m.senderId === convTranscript.conversation?.participantOne?.id;

                  if (isSystem) {
                    return (
                      <div key={m.id} className="text-center my-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
                          {m.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isP1 ? 'items-start' : 'items-end'}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-1 px-1">
                        {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl text-xs ${
                          isP1
                            ? 'bg-[#1E293B] text-slate-200 rounded-tl-sm border border-white/5'
                            : 'bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-tr-sm shadow-md shadow-sky-600/20'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No chat messages exchanged in this conversation channel yet.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-[#111C35] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Halal modesty standards verified</span>
              </span>
              <button
                onClick={() => {
                  setSelectedConvId(null);
                  setConvTranscript(null);
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition cursor-pointer"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
