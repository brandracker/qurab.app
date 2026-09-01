import React, { useState } from 'react';
import { Users, X, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs px-0 sm:px-4 select-none text-on-surface">
      <div className="w-full max-w-[480px] bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-outline animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-outline mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-pastel-rose text-primary border border-pastel-rose-border flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">Add a Guardian / Wali</h2>
              <p className="text-xs text-secondary">Keep family involved in your matrimony journey</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center text-secondary hover:text-on-surface transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
              Wali's Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tariq Al-Mansoor"
              className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
              Relationship
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
            >
              <option value="Father">Father</option>
              <option value="Brother">Brother</option>
              <option value="Uncle">Uncle</option>
              <option value="Guardian">Legal Guardian / Trustee</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1">
              WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +44 7700 900077"
              className="w-full px-3.5 py-2.5 bg-white border border-outline rounded-2xl text-xs focus:outline-none focus:border-primary shadow-subtle"
            />
          </div>

          <div className="bg-pastel-mint border border-pastel-mint-border rounded-2xl p-3 text-xs text-pastel-mint-text flex items-start gap-2 mt-0.5 shadow-subtle">
            <ShieldCheck className="w-4 h-4 text-pastel-mint-text shrink-0 mt-0.5" />
            <span className="text-[11px] leading-tight">Your Wali will receive an SMS/WhatsApp invite link to review matches and observed conversations.</span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-outline text-secondary rounded-full font-bold text-xs hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-primary text-white rounded-full font-bold text-xs shadow-brand hover:bg-primary-dark transition-all"
            >
              Save & Invite Wali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddWaliModal;

