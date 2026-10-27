import React, { useState, useEffect } from 'react';
import { ShieldAlert, X, Save, AlertTriangle, RefreshCw } from 'lucide-react';
import { API_BASE } from '../../../services/dbService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  onSuccessToast: (msg: string) => void;
}

export const AppVersionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  adminToken,
  onSuccessToast
}) => {
  const [minSupportedVersionCode, setMinSupportedVersionCode] = useState<number>(37);
  const [latestVersionCode, setLatestVersionCode] = useState<number>(38);
  const [latestVersionName, setLatestVersionName] = useState<string>('1.0.37');
  const [forceUpdateEnabled, setForceUpdateEnabled] = useState<boolean>(false);
  const [updateTitle, setUpdateTitle] = useState<string>('Critical Update Required');
  const [updateMessage, setUpdateMessage] = useState<string>(
    'A new version of Qurb is required to continue. Please update now from the Google Play Store for critical features and fixes.'
  );
  const [playStoreUrl, setPlayStoreUrl] = useState<string>(
    'https://play.google.com/store/apps/details?id=app.qurb.serene&pcampaignid=web_share'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchPolicy = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/admin/app-version`, {
          headers: {
            'x-admin-token': adminToken
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setMinSupportedVersionCode(data.minSupportedVersionCode || 37);
            setLatestVersionCode(data.latestVersionCode || 38);
            setLatestVersionName(data.latestVersionName || '1.0.37');
            setForceUpdateEnabled(Boolean(data.forceUpdateEnabled));
            if (data.updateTitle) setUpdateTitle(data.updateTitle);
            if (data.updateMessage) setUpdateMessage(data.updateMessage);
            if (data.playStoreUrl) setPlayStoreUrl(data.playStoreUrl);
          }
        }
      } catch (err) {
        console.warn('Failed to load version policy:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicy();
  }, [isOpen, adminToken]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/admin/app-version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken
        },
        body: JSON.stringify({
          minSupportedVersionCode: Number(minSupportedVersionCode),
          latestVersionCode: Number(latestVersionCode),
          latestVersionName: latestVersionName.trim(),
          forceUpdateEnabled,
          updateTitle: updateTitle.trim(),
          updateMessage: updateMessage.trim(),
          playStoreUrl: playStoreUrl.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        onSuccessToast(data.message || 'App Version policy saved successfully!');
        onClose();
      } else {
        alert(data.error || 'Failed to save policy');
      }
    } catch (err: any) {
      alert('Error updating version policy: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-xl bg-[#0F172A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#131D33]">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              forceUpdateEnabled ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>App Version & Hard Update Policy</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  forceUpdateEnabled ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {forceUpdateEnabled ? 'Hard Lock Active' : 'Normal'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Manage client minimum version and trigger remote force-update</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#FF2560] animate-spin" />
            <p className="text-xs text-slate-400">Loading version policy...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Force Update Master Toggle */}
            <div className={`p-4 rounded-2xl border transition-all ${
              forceUpdateEnabled 
                ? 'bg-rose-950/30 border-rose-500/40' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Force Update Lock (Hard Update)</span>
                    {forceUpdateEnabled && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    When active, users running older builds are completely blocked until updated.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forceUpdateEnabled}
                    onChange={(e) => setForceUpdateEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                </label>
              </div>

              {forceUpdateEnabled && (
                <div className="mt-3 pt-3 border-t border-rose-500/20 flex items-start gap-2 text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Warning:</strong> Any user whose mobile app build is below <strong>Build #{minSupportedVersionCode}</strong> will receive an unclosable lock screen directing them to the Play Store.
                  </span>
                </div>
              )}
            </div>

            {/* Version Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Minimum Supported Build (Version Code)
                </label>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={minSupportedVersionCode}
                  onChange={(e) => setMinSupportedVersionCode(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2560]"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Apps below this code are hard locked</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Latest Version Name
                </label>
                <input
                  type="text"
                  value={latestVersionName}
                  onChange={(e) => setLatestVersionName(e.target.value)}
                  placeholder="e.g. 1.0.37"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2560]"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Displayed on the update modal</span>
              </div>
            </div>

            {/* Update Title & Message */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Modal Title
                </label>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF2560]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Modal Message for Users
                </label>
                <textarea
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs leading-relaxed focus:outline-none focus:border-[#FF2560]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Google Play Store URL
                </label>
                <input
                  type="text"
                  value={playStoreUrl}
                  onChange={(e) => setPlayStoreUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#FF2560]"
                  required
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2560] to-[#FF4D7D] hover:from-[#E01B50] hover:to-[#FF3D70] text-white text-xs font-bold shadow-lg shadow-[#FF2560]/20 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Policy...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Version Policy</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
