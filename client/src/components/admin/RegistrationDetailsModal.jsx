import React from 'react';
import { X, User, Phone, Building, Calendar, Shirt, Award, Hash, CheckCircle, AlertCircle } from 'lucide-react';

export const RegistrationDetailsModal = ({ registration, onClose, onEdit }) => {
  if (!registration) return null;

  const isIndividual =
    registration.registrationType === 'individual' ||
    registration.registrationType === 'FORM' ||
    (registration.registrationId && registration.registrationId.includes('IN'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[var(--orange)] block">
              REGISTRATION DETAILS
            </span>
            <h3 className="text-xl font-black font-heading text-[var(--text-primary)] font-mono">
              {registration.registrationId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge & Type */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isIndividual
              ? 'bg-[var(--orange)]/15 text-[var(--orange)] border border-[var(--orange)]/30'
              : 'bg-[var(--cyan)]/15 text-[var(--cyan)] border border-[var(--cyan)]/30'
          }`}>
            {isIndividual ? 'INDIVIDUAL (IN)' : 'SCHOOL / COLLEGE (SC)'}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)]">
            Year: {registration.registrationYear || 2026}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            registration.status === 'CONFIRMED'
              ? 'bg-emerald-500/15 text-emerald-500'
              : 'bg-red-500/15 text-red-500'
          }`}>
            {registration.status || 'CONFIRMED'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Student / Participant Name</span>
            <span className="text-sm font-black text-[var(--text-primary)] mt-0.5 block">{registration.fullName}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Parent / Contact Phone</span>
            <span className="text-sm font-black text-[var(--text-primary)] mt-0.5 block font-mono">{registration.contactNumber}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Age</span>
            <span className="text-sm font-black text-[var(--text-primary)] mt-0.5 block">{registration.age ? `${registration.age} years` : 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Standard / Class</span>
            <span className="text-sm font-black text-[var(--text-primary)] mt-0.5 block">{registration.standard || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] sm:col-span-2">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">School / College Name</span>
            <span className="text-sm font-black text-[var(--text-primary)] mt-0.5 block">{registration.institutionName || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">T-Shirt Size</span>
            <span className="text-sm font-black text-[var(--yellow)] mt-0.5 block">{registration.tShirtSize}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Registration Date & Time</span>
            <span className="text-sm font-bold text-[var(--text-primary)] mt-0.5 block">
              {new Date(registration.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>

          {registration.batchId && (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] sm:col-span-2">
              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Bulk Batch Reference</span>
              <span className="text-xs font-mono font-bold text-[var(--cyan)] mt-0.5 block">{registration.batchId}</span>
            </div>
          )}

          {registration.googleSheetsSync && (
            <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] sm:col-span-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Google Sheets Sync</span>
                <span className="text-xs font-semibold text-[var(--text-primary)] capitalize">
                  {registration.googleSheetsSync.status || 'Pending'}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                registration.googleSheetsSync.status === 'success'
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : 'bg-amber-500/15 text-amber-500'
              }`}>
                {registration.googleSheetsSync.status === 'success' ? 'SYNCED' : 'NOT SYNCED'}
              </span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(registration);
            }}
            className="btn-secondary py-2 px-4 text-xs border-[var(--orange)] text-[var(--orange)]"
          >
            EDIT REGISTRATION
          </button>
          <button
            onClick={onClose}
            className="btn-primary py-2 px-5 text-xs"
          >
            CLOSE
          </button>
        </div>

      </div>
    </div>
  );
};
