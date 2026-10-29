import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Crown, 
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  Copy,
  ExternalLink,
  PlayCircle,
  Ban
} from 'lucide-react';
import { API_BASE } from '../../../services/dbService';

interface Props {
  adminToken: string;
  onShowToast: (msg: string) => void;
}

export const ReferralsTab: React.FC<Props> = ({ adminToken, onShowToast }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [targetSetting, setTargetSetting] = useState<number>(30);
  const [isUpdatingTarget, setIsUpdatingTarget] = useState<boolean>(false);

  // Quick Simulation & Tool State
  const [simReferrerId, setSimReferrerId] = useState<string>('usr_1787950224578');
  const [simFriendName, setSimFriendName] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fetchOverview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/referrals/admin/overview`, {
        headers: { 'x-admin-token': adminToken }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.targetInvites) {
          setTargetSetting(Number(json.targetInvites));
        }
      } else {
        onShowToast(json.error || 'Failed to fetch referral overview');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error loading referral data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [adminToken]);

  const handleUpdateTarget = async () => {
    if (!targetSetting || targetSetting < 1) {
      onShowToast('Please provide a valid target number (e.g. 30, 20, 15)');
      return;
    }
    setIsUpdatingTarget(true);
    try {
      const res = await fetch(`${API_BASE}/referrals/admin/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ targetInvites: targetSetting })
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(`✓ Target updated to ${targetSetting} invites successfully!`);
        fetchOverview();
      } else {
        onShowToast(json.error || 'Failed to update target');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error updating target');
    } finally {
      setIsUpdatingTarget(false);
    }
  };

  const handleSimulateInvite = async (isCompleted: boolean) => {
    if (!simReferrerId.trim()) {
      onShowToast('Please provide a Referrer User ID');
      return;
    }
    setIsSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/referrals/admin/simulate-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          referrerId: simReferrerId.trim(),
          refereeName: simFriendName.trim() || undefined,
          isCompleted
        })
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(`✓ ${json.message}`);
        fetchOverview();
      } else {
        onShowToast(json.error || 'Failed to simulate referral');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error simulating referral');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDisqualify = async (referralId: string) => {
    if (!confirm('Are you sure you want to disqualify this referral?')) return;
    try {
      const res = await fetch(`${API_BASE}/referrals/admin/disqualify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({ referralId, reason: 'Manually disqualified by Admin' })
      });
      const json = await res.json();
      if (json.success) {
        onShowToast('✓ Referral marked as disqualified');
        fetchOverview();
      } else {
        onShowToast(json.error || 'Failed to disqualify referral');
      }
    } catch (err: any) {
      onShowToast(err.message || 'Error disqualifying referral');
    }
  };

  const handleCopyLink = () => {
    const link = `https://qurb.app/join?ref=${encodeURIComponent(simReferrerId.trim())}`;
    navigator.clipboard?.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    onShowToast('✓ Invite link copied to clipboard!');
  };

  const metrics = data?.metrics || {
    totalInvites: 0,
    completedSignups: 0,
    pendingSignups: 0,
    disqualified: 0,
    freeVipRewardsGiven: 0
  };

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-[#0E1528] text-slate-100 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2.5 text-white">
            <Gift className="w-6 h-6 text-emerald-400" />
            <span>Referrals & Viral Invites Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track viral growth, anti-fraud device checks, individual invitations, and automatic VIP rewards.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* METRICS TILES */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Invites</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.totalInvites}</div>
          <span className="text-[10px] text-slate-500">All referral links generated</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>Verified Signups</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{metrics.completedSignups}</div>
          <span className="text-[10px] text-emerald-400/70">Profile & photo completed</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>Pending Signups</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{metrics.pendingSignups}</div>
          <span className="text-[10px] text-amber-400/70">Awaiting photo / details</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-rose-300 text-xs">
            <span>Disqualified / Bots</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{metrics.disqualified}</div>
          <span className="text-[10px] text-rose-400/70">Multi-device / temp-email block</span>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 space-y-1.5 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>VIPs Awarded</span>
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{metrics.freeVipRewardsGiven}</div>
          <span className="text-[10px] text-amber-400/80">1-Month memberships granted</span>
        </div>
      </div>

      {/* DYNAMIC SETTING: Change Target Count */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Campaign Target Requirement</span>
          </h4>
          <p className="text-xs text-slate-300">
            Number of verified friend signups required to automatically unlock 1 Month Barakah VIP free.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <input
              type="number"
              min="1"
              max="100"
              value={targetSetting}
              onChange={(e) => setTargetSetting(parseInt(e.target.value) || 0)}
              className="w-24 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-center font-bold text-sm focus:outline-none focus:border-emerald-400"
            />
            <span className="text-[10px] text-slate-400 block text-center mt-0.5">Invites</span>
          </div>

          <button
            onClick={handleUpdateTarget}
            disabled={isUpdatingTarget}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
          >
            {isUpdatingTarget ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            <span>Update Target</span>
          </button>
        </div>
      </div>

      {/* ADMIN TESTING & SIMULATION TOOL */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-emerald-400" />
              <span>Invite Link Generator & Simulation Sandbox</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate invite links for testing, or simulate incoming friend signups to verify the VIP unlock milestone in real time.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
            Admin Test Tool
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Referrer User ID</label>
            <input
              type="text"
              value={simReferrerId}
              onChange={(e) => setSimReferrerId(e.target.value)}
              placeholder="usr_1787950224578"
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Invited Friend Name (Optional)</label>
            <input
              type="text"
              value={simFriendName}
              onChange={(e) => setSimFriendName(e.target.value)}
              placeholder="e.g. Ayesha Khan"
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleCopyLink}
              type="button"
              className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-slate-200 border border-white/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={() => handleSimulateInvite(true)}
              disabled={isSimulating}
              type="button"
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Simulate Verified</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1 font-mono">
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Active Share URL: https://qurb.app/join?ref={encodeURIComponent(simReferrerId.trim())}</span>
        </div>
      </div>

      {/* RECENT INDIVIDUAL INVITATIONS LOG */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Recent Invitations Log</span>
          </h3>
          <span className="text-xs text-slate-400">
            {data?.recentInvites?.length || 0} recent invitations recorded
          </span>
        </div>

        {(!data?.recentInvites || data.recentInvites.length === 0) ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No referral activity recorded in database yet. Use the "Simulate Verified" button above to test with an account!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Referrer</th>
                  <th className="py-2.5 px-3">Invited Friend</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Device / Anti-Fraud</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentInvites.map((inv: any) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-[11px] text-slate-400 font-mono whitespace-nowrap">
                      {new Date(inv.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{inv.referrer_name || inv.referrer_id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.referrer_email || inv.referrer_id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{inv.referee_name || inv.referee_id}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{inv.referee_email || '—'}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {inv.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          ✓ Verified
                        </span>
                      ) : inv.status === 'disqualified' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Disqualified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                        {inv.device_id || 'Browser'}
                      </div>
                      {inv.disqualified_reason && (
                        <div className="text-[10px] text-rose-400 font-medium">
                          {inv.disqualified_reason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {inv.status !== 'disqualified' && (
                        <button
                          onClick={() => handleDisqualify(inv.id)}
                          title="Disqualify suspicious invite"
                          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Disqualify</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP REFERRERS LEADERBOARD */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Top Brand Ambassadors & Referrers</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">Ranked by verified friends</span>
          </h3>

          {(!data?.topReferrers || data.topReferrers.length === 0) ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No top referrers recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Verified</th>
                    <th className="py-2.5 px-3 text-center">Total</th>
                    <th className="py-2.5 px-3 text-right">VIP Gift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.topReferrers.map((ref: any, idx: number) => (
                    <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{ref.full_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{ref.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        {ref.is_vip ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            VIP
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-400">
                        {ref.completed_count}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-300">
                        {ref.total_invites}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {ref.rewards_won > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                            <Crown className="w-3 h-3 fill-amber-400" />
                            <span>Awarded</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">In Progress</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SUSPICIOUS DEVICE ALERTS */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2 text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Multi-Device Alerts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">&gt;1 Accounts / Device</span>
          </h3>

          {(!data?.suspiciousDevices || data.suspiciousDevices.length === 0) ? (
            <div className="py-8 text-center text-xs text-slate-400">
              ✓ Clean record! No multi-device bot abuse detected.
            </div>
          ) : (
            <div className="space-y-2.5">
              {data.suspiciousDevices.map((dev: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-rose-200 block truncate max-w-[140px]">
                      {dev.device_id}
                    </span>
                    <span className="text-[10px] text-rose-400 font-medium">
                      {dev.signup_count} accounts on same device
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                    Flagged 🚩
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
