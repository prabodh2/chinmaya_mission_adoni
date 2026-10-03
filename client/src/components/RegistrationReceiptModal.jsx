import React from 'react';
import { Flame, CheckCircle, Download, Printer, X, MapPin, Calendar, Clock, Award } from 'lucide-react';

export const RegistrationReceiptModal = ({ data, onClose }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-[var(--bg-secondary)] border-2 border-[var(--orange)]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--orange)]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:text-[var(--orange)]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold text-xs tracking-wider uppercase">
            REGISTRATION CONFIRMED
          </span>
          <h3 className="text-2xl font-black font-heading text-[var(--text-primary)]">
            ANTI-DRUG MARATHON 2026
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-semibold">
            Chinmaya Mission Adoni • Chinmaya Yuva Kendra Adoni
          </p>
        </div>

        {/* Official Ticket Card */}
        <div id="printable-ticket" className="gradient-negative p-6 rounded-2xl border border-white/20 text-white space-y-4 shadow-inner relative">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--yellow)]">REGISTRATION ID</p>
              <h4 className="text-xl sm:text-2xl font-black tracking-wider text-white font-mono">
                {data.registrationId}
              </h4>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--orange)] text-white flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">PARTICIPANT NAME</span>
              <span className="font-extrabold text-white text-sm truncate block">{data.fullName}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">T-SHIRT SIZE</span>
              <span className="font-extrabold text-[var(--yellow)] text-sm">{data.tShirtSize}</span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">INSTITUTION / TYPE</span>
              <span className="font-bold text-slate-200 truncate block">
                {data.isStudent ? data.institutionName || 'Student' : 'Individual Participant'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">CONTACT NUMBER</span>
              <span className="font-bold text-slate-200">{data.contactNumber}</span>
            </div>
          </div>

          {/* Event Details Bar */}
          <div className="pt-3 border-t border-white/15 text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[var(--orange)]" />
              <span>Sunday, 6 December 2026 • 6:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[var(--cyan)]" />
              <span>Chinmaya Mission Adoni</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full btn-primary justify-center text-sm py-3"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT / SAVE TICKET</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full btn-secondary justify-center text-sm py-3"
          >
            <span>CLOSE</span>
          </button>
        </div>

      </div>
    </div>
  );
};
