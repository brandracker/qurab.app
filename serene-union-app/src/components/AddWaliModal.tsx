import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (wali: { name: string; phone: string; relationship: string }) => void;
}

export const AddWaliModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Father');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    onSave({ name, phone, relationship });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4">
      <div className="w-full max-w-[480px] bg-surface rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-surface-variant animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-variant mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">supervisor_account</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-on-surface">Add a Guardian / Wali</h2>
              <p className="text-xs text-secondary">Keep family involved in your matrimony journey</p>
            </div>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-on-surface p-1.5 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Wali's Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq Al-Mansoor"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="Father">Father</option>
              <option value="Brother">Brother</option>
              <option value="Uncle">Uncle</option>
              <option value="Guardian">Legal Guardian / Trustee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +44 7700 900077"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/40 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-xs text-primary flex items-start gap-2 mt-1">
            <span className="material-symbols-outlined text-sm mt-0.5">verified_user</span>
            <span>Your Wali will receive an SMS/WhatsApp invite link to review matches and observed conversations.</span>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-outline-variant text-secondary rounded-full font-medium text-sm hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-primary text-on-primary rounded-full font-medium text-sm hover:brightness-105 transition-all shadow-md"
            >
              Save & Invite Wali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
