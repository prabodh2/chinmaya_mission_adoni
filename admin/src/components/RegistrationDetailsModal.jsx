import React from 'react';
import { X, User, Phone, Building, Calendar, Shirt, Award, Hash, CheckCircle, Pencil } from 'lucide-react';

export const RegistrationDetailsModal = ({ registration, onClose, onEdit }) => {
  if (!registration) return null;

  const isIndividual =
    registration.registrationType === 'individual' ||
    registration.registrationType === 'FORM' ||
    (registration.registrationId && registration.registrationId.includes('IN'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1C2541] border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-[#FF7B00] block">
              REGISTRATION RECORD
            </span>
            <h3 className="text-xl font-black font-heading text-white font-mono">
              {registration.registrationId}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#243054] text-[#94A3B8] hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge & Type */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isIndividual
              ? 'bg-[#FF7B00]/15 text-[#FF7B00] border border-[#FF7B00]/30'
              : 'bg-[#00B4D8]/15 text-[#00B4D8] border border-[#00B4D8]/30'
          }`}>
            {isIndividual ? 'INDIVIDUAL FORM' : 'SCHOOL / COLLEGE BATCH'}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#243054] text-white border border-white/10">
            Year: {registration.registrationYear || 2026}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            registration.status === 'CONFIRMED'
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-red-500/15 text-red-400'
          }`}>
            {registration.status || 'CONFIRMED'}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Student / Participant Name</span>
            <span className="text-sm font-black text-white mt-0.5 block">{registration.fullName}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Contact Phone</span>
            <span className="text-sm font-black text-white mt-0.5 block font-mono">{registration.contactNumber}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Age</span>
            <span className="text-sm font-black text-white mt-0.5 block">{registration.age ? `${registration.age} years` : 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Standard / Class</span>
            <span className="text-sm font-black text-white mt-0.5 block">{registration.standard || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Profession / Occupation</span>
            <span className="text-sm font-black text-[#00B4D8] mt-0.5 block">{registration.profession || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">T-Shirt Size</span>
            <span className="text-sm font-black text-[#F59E0B] mt-0.5 block">{registration.tShirtSize}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10 sm:col-span-2">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">School / College Name</span>
            <span className="text-sm font-black text-white mt-0.5 block">{registration.institutionName || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-white/10 sm:col-span-2">
            <span className="text-[10px] font-bold text-[#64748B] uppercase block">Registered On</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {new Date(registration.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(registration);
              }}
              className="btn-secondary text-xs py-2 px-4 flex items-center gap-2"
            >
              <Pencil className="w-3.5 h-3.5 text-[#00B4D8]" />
              <span>Edit Details</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="btn-primary text-xs py-2 px-5"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
