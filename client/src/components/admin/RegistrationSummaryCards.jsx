import React from 'react';
import { Users, User, Building2 } from 'lucide-react';

export const RegistrationSummaryCards = ({ summary, loading }) => {
  const total = summary?.totalRegistrations ?? 0;
  const individual = summary?.individualRegistrations ?? 0;
  const schoolCollege = summary?.schoolCollegeRegistrations ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Registrations */}
      <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--text-muted)] block">
            TOTAL REGISTRATIONS
          </span>
          <div className="text-3xl font-black font-heading text-[var(--text-primary)] mt-1">
            {loading ? '...' : Number(total).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            Across all categories
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Individual Registrations */}
      <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--orange)] block">
            INDIVIDUAL REGISTRATIONS
          </span>
          <div className="text-3xl font-black font-heading text-[var(--orange)] mt-1">
            {loading ? '...' : Number(individual).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            ID Format: CMA2026IN...
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
      </div>

      {/* School / College Registrations */}
      <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--cyan)] block">
            SCHOOL / COLLEGE
          </span>
          <div className="text-3xl font-black font-heading text-[var(--cyan)] mt-1">
            {loading ? '...' : Number(schoolCollege).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5 block">
            ID Format: CMA2026SC...
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
