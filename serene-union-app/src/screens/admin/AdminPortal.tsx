import React, { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { API_BASE } from '../../services/dbService';
import { AdminLogin } from './AdminLogin';
import { AdminHeader } from './components/AdminHeader';
import { AdminSidebar } from './components/AdminSidebar';
import { OverviewTab } from './components/OverviewTab';
import { DailyActivityTab } from './components/DailyActivityTab';
import { LiveMonitorTab } from './components/LiveMonitorTab';
import { UserDirectoryTab } from './components/UserDirectoryTab';
import { PhotoModerationTab } from './components/PhotoModerationTab';
import { SeedProfilesTab } from './components/SeedProfilesTab';
import { ReferralsTab } from './components/ReferralsTab';
import { UserInspectModal } from './components/UserInspectModal';
import { BroadcastModal } from './components/BroadcastModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AppVersionModal } from './components/AppVersionModal';
import type { 
  AdminTab, 
  DashboardStats, 
  AdminProfile, 
  CityStat, 
  CandidateUser, 
  CandidatePhoto 
} from './types';

export const AdminPortal: React.FC = () => {
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('qurb_admin_token');
  });
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem('qurb_admin_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [dailyInitialDate, setDailyInitialDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleSelectTabWithDate = (tab: AdminTab, dateStr?: string) => {
    if (dateStr) {
      setDailyInitialDate(dateStr);
    }
    setActiveTab(tab);
  };

  // Dashboard Data
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Users Directory Data & Server-side Pagination
  const [users, setUsers] = useState<CandidateUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filters Bar
  const [userSearch, setUserSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Dynamic Cities from DB
  const [availableCities, setAvailableCities] = useState<CityStat[]>([]);

  // Selected User Inspect & Photo Arrangement Modal
  const [selectedUser, setSelectedUser] = useState<CandidateUser | null>(null);
  const [userPhotos, setUserPhotos] = useState<CandidatePhoto[]>([]);
  const [isInspectingLoading, setIsInspectingLoading] = useState(false);

  // Manual Subscription Modal State
  const [selectedSubscriptionUser, setSelectedSubscriptionUser] = useState<CandidateUser | null>(null);
  const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);

  // Photos Moderation Queue Data
  const [photos, setPhotos] = useState<CandidatePhoto[]>([]);
  const [photoGenderFilter, setPhotoGenderFilter] = useState('');

  // Global Broadcast & Version Policy Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('qurb_admin_token');
    sessionStorage.removeItem('qurb_admin_profile');
    setAdminToken(null);
    setAdminProfile(null);
  };

  // 1. Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard/stats?t=${Date.now()}`, {
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        },
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, [adminToken]);

  // 2. Fetch Available Cities
  const fetchCities = useCallback(async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(`${API_BASE}/admin/cities`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.cities) {
        setAvailableCities(data.cities);
      }
    } catch (err) {
      console.error('Failed to fetch cities:', err);
    }
  }, [adminToken]);

  // 3. Fetch Paginated Users
  const fetchUsers = useCallback(async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(currentPage));
      params.set('limit', String(pageSize));
      if (userSearch.trim()) params.set('search', userSearch.trim());
      if (genderFilter) params.set('gender', genderFilter);
      if (cityFilter) params.set('city', cityFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (membershipFilter) params.set('membership', membershipFilter);
      if (sortOrder) params.set('sort', sortOrder);

      const res = await fetch(`${API_BASE}/admin/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
        setTotalUsersCount(data.total);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, currentPage, pageSize, userSearch, genderFilter, cityFilter, statusFilter, membershipFilter, sortOrder]);

  // 4. Fetch Photos for Moderation
  const fetchPhotos = useCallback(async () => {
    if (!adminToken) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (photoGenderFilter) params.set('gender', photoGenderFilter);

      const res = await fetch(`${API_BASE}/admin/photos/moderation?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.photos) {
        setPhotos(data.photos);
      }
    } catch (err) {
      console.error('Failed to fetch photos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, photoGenderFilter]);

  useEffect(() => {
    if (!adminToken) return;
    fetchCities();
    if (activeTab === 'overview') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'photos') fetchPhotos();
  }, [adminToken, activeTab, fetchStats, fetchCities, fetchUsers, fetchPhotos]);

  // Open Full User Profile & Photos
  const handleInspectUser = async (userId: string) => {
    setIsInspectingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSelectedUser(data.user);
        setUserPhotos(data.user.photos || []);
      }
    } catch {
      showToast('Could not load user profile card.');
    } finally {
      setIsInspectingLoading(false);
    }
  };

  // Toggle Ban
  const handleToggleBan = async (userId: string, currentStatus: string, currentBanned: boolean) => {
    const isBanned = currentStatus === 'banned' || currentBanned;
    const targetStatus = isBanned ? 'active' : 'banned';

    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: targetStatus, isBanned: !isBanned })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, account_status: targetStatus, is_banned: !isBanned ? 1 : 0 } : u));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({ ...prev, account_status: targetStatus, is_banned: !isBanned ? 1 : 0 }));
        }
        showToast(`User successfully marked as ${targetStatus}!`);
      } else {
        showToast(data.error || 'Could not update user status.');
      }
    } catch {
      showToast('Action failed. Please retry.');
    }
  };

  // Switch User Gender
  const handleChangeGender = async (userId: string, targetGender: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/gender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ gender: targetGender })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, gender: targetGender } : u));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({ ...prev, gender: targetGender }));
        }
        fetchStats();
        showToast(`Gender updated to ${targetGender} & interactions reset!`);
      } else {
        showToast(data.error || 'Failed to update gender.');
      }
    } catch {
      showToast('Network error while updating gender.');
    }
  };

  // Remove User (Soft Deactivate or Permanent Purge)
  const handleRemoveUser = async (userId: string, permanent: boolean = false) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}${permanent ? '?permanent=true' : ''}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ permanent })
      });
      const data = await res.json();
      if (data.success) {
        if (permanent) {
          setUsers(prev => prev.filter(u => u.id !== userId));
          setTotalUsersCount(prev => Math.max(0, prev - 1));
        } else {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, account_status: 'deleted', is_banned: 1 } : u));
        }
        setSelectedUser(null);
        fetchStats();
        showToast(data.message || (permanent ? 'User permanently removed!' : 'User deactivated!'));
      } else {
        showToast(data.error || 'Failed to remove user.');
      }
    } catch {
      showToast('Network error while removing user.');
    }
  };

  // Comprehensive Manual Subscription & Quotas Update
  const handleUpdateSubscription = async (
    userId: string,
    tier: string,
    directSalams: number,
    isVip: boolean,
    resetQuotas: boolean,
    durationDays?: number | 'lifetime'
  ) => {
    setIsSubmittingSubscription(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ tier, directSalams, isVip, resetQuotas, durationDays })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? {
          ...u,
          is_vip: isVip ? 1 : 0,
          wallet: data.wallet || {
            ...(u.wallet || {}),
            subscription_tier: tier,
            subscription_expiry: data.subscriptionExpiry,
            daysRemaining: data.daysRemaining,
            direct_salams_balance: (u.wallet?.direct_salams_balance ?? (isVip ? 20 : 2)) + directSalams
          }
        } : u));

        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({
            ...prev,
            is_vip: isVip ? 1 : 0,
            wallet: data.wallet || {
              ...(prev?.wallet || {}),
              subscription_tier: tier,
              subscription_expiry: data.subscriptionExpiry,
              daysRemaining: data.daysRemaining,
              direct_salams_balance: (prev?.wallet?.direct_salams_balance ?? (isVip ? 20 : 2)) + directSalams
            }
          }));
        }

        showToast(`Subscription updated to ${tier === 'barakah_vip' ? 'Barakah VIP' : 'Standard'} successfully!`);
      } else {
        showToast(data.error || 'Failed to update subscription.');
      }
    } catch {
      showToast('Subscription update failed. Please check connection.');
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  // Toggle VIP
  const handleToggleVip = async (userId: string, currentVip: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/vip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ isVip: !currentVip })
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_vip: !currentVip ? 1 : 0 } : u));
        if (selectedUser?.id === userId) {
          setSelectedUser((prev: any) => ({ ...prev, is_vip: !currentVip ? 1 : 0 }));
        }
        showToast(`User VIP status updated!`);
      }
    } catch {
      showToast('Failed to update VIP status.');
    }
  };

  // Picture Arrangement: Set as Primary Photo
  const handleSetPrimaryPhoto = async (photoId: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/photos/${photoId}/primary`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setUserPhotos(prev => prev.map(p => ({
          ...p,
          is_primary: p.id === photoId ? 1 : 0
        })));
        fetchUsers();
        showToast('Primary cover photo updated successfully!');
      }
    } catch {
      showToast('Failed to update primary photo.');
    }
  };

  // Delete Individual Photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this photo?')) return;

    try {
      const res = await fetch(`${API_BASE}/admin/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
        setUserPhotos(prev => prev.filter(p => p.id !== photoId));
        fetchUsers();
        showToast('Photo removed successfully!');
      }
    } catch {
      showToast('Failed to remove photo.');
    }
  };

  // 1-Click Export to CSV
  const handleExportCSV = () => {
    if (users.length === 0) {
      showToast('No users to export.');
      return;
    }

    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Gender', 'City', 'Profession', 'Education', 'VIP', 'Status', 'Created At'];
    const rows = users.map(u => [
      u.id,
      `"${u.full_name || ''}"`,
      `"${u.email || ''}"`,
      `"${u.phone || ''}"`,
      u.gender,
      `"${u.city || ''}"`,
      `"${u.profession || ''}"`,
      `"${u.education || ''}"`,
      u.is_vip ? 'VIP' : 'Standard',
      u.account_status || 'active',
      u.created_at || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qurb_members_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported users to CSV file!');
  };

  // Global Broadcast
  const handleSendBroadcast = async (title: string, message: string) => {
    setIsBroadcasting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ title, message })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Broadcast delivered to ${data.deliveredCount} members!`);
        setShowBroadcastModal(false);
      } else {
        showToast(data.error || 'Failed to send announcement.');
      }
    } catch {
      showToast('Broadcast transmission error.');
    } finally {
      setIsBroadcasting(false);
    }
  };

  if (!adminToken) {
    return (
      <AdminLogin
        onLoginSuccess={(tok, prof) => {
          setAdminToken(tok);
          setAdminProfile(prof);
        }}
      />
    );
  }



  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-[#FF2560]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#FF2560] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-semibold animate-bounce">
          {toastMsg}
        </div>
      )}

      {/* Modular Header */}
      <AdminHeader
        adminProfile={adminProfile}
        onOpenBroadcast={() => setShowBroadcastModal(true)}
        onOpenVersionPolicy={() => setShowVersionModal(true)}
        onLogout={handleLogout}
      />

      {/* Main App Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Modular Sidebar Nav (Without Wali) */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Content View */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              onRefresh={fetchStats}
              onSelectTab={handleSelectTabWithDate}
            />
          )}

          {activeTab === 'daily' && adminToken && (
            <DailyActivityTab
              adminToken={adminToken}
              onInspectUser={handleInspectUser}
              initialDate={dailyInitialDate}
            />
          )}

          {activeTab === 'live' && adminToken && (
            <LiveMonitorTab
              adminToken={adminToken}
              onInspectUser={handleInspectUser}
            />
          )}

          {activeTab === 'users' && (
            <UserDirectoryTab
              users={users}
              totalUsersCount={totalUsersCount}
              totalPages={totalPages}
              currentPage={currentPage}
              pageSize={pageSize}
              isLoading={isLoading}
              userSearch={userSearch}
              genderFilter={genderFilter}
              cityFilter={cityFilter}
              statusFilter={statusFilter}
              membershipFilter={membershipFilter}
              sortOrder={sortOrder}
              availableCities={availableCities}
              onSearchChange={(val) => {
                setUserSearch(val);
                setCurrentPage(1);
              }}
              onCityChange={(val) => {
                setCityFilter(val);
                setCurrentPage(1);
              }}
              onGenderChange={(val) => {
                setGenderFilter(val);
                setCurrentPage(1);
              }}
              onStatusChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              onMembershipChange={(val) => {
                setMembershipFilter(val);
                setCurrentPage(1);
              }}
              onSortChange={(val) => {
                setSortOrder(val);
                setCurrentPage(1);
              }}
              onPageSizeChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}
              onPageChange={setCurrentPage}
              onExportCSV={handleExportCSV}
              onRefresh={fetchUsers}
              onInspectUser={handleInspectUser}
              onToggleBan={handleToggleBan}
              onToggleVip={handleToggleVip}
              onManageSubscription={setSelectedSubscriptionUser}
              isInspectingLoading={isInspectingLoading}
            />
          )}

          {activeTab === 'photos' && (
            <PhotoModerationTab
              photos={photos}
              photoGenderFilter={photoGenderFilter}
              isLoading={isLoading}
              onGenderFilterChange={setPhotoGenderFilter}
              onRefresh={fetchPhotos}
              onInspectUser={handleInspectUser}
              onDeletePhoto={handleDeletePhoto}
            />
          )}

          {activeTab === 'seeds' && adminToken && (
            <SeedProfilesTab adminToken={adminToken} />
          )}

          {activeTab === 'referrals' && adminToken && (
            <ReferralsTab adminToken={adminToken} onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* Modular Picture Arrangement & Profile Inspection Modal */}
      {selectedUser && (
        <UserInspectModal
          user={selectedUser}
          userPhotos={userPhotos}
          onClose={() => setSelectedUser(null)}
          onSetPrimaryPhoto={handleSetPrimaryPhoto}
          onDeletePhoto={handleDeletePhoto}
          onToggleVip={handleToggleVip}
          onToggleBan={handleToggleBan}
          onChangeGender={handleChangeGender}
          onRemoveUser={handleRemoveUser}
          onOpenSubscription={() => setSelectedSubscriptionUser(selectedUser)}
        />
      )}

      {/* Modular Manual Subscription & Quotas Manager */}
      {selectedSubscriptionUser && (
        <SubscriptionModal
          user={selectedSubscriptionUser}
          onClose={() => setSelectedSubscriptionUser(null)}
          onUpdateSubscription={handleUpdateSubscription}
          isSubmitting={isSubmittingSubscription}
        />
      )}

      {/* Modular Global System Broadcast Modal */}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSendBroadcast={handleSendBroadcast}
        isBroadcasting={isBroadcasting}
      />

      {/* App Version & Force Update Policy Modal */}
      {showVersionModal && adminToken && (
        <AppVersionModal
          isOpen={showVersionModal}
          onClose={() => setShowVersionModal(false)}
          adminToken={adminToken}
          onSuccessToast={showToast}
        />
      )}
    </div>
  );
};
