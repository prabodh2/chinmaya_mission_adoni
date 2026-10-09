import React from 'react';
import { Users, User, Building2 } from 'lucide-react';

export const RegistrationSummaryCards = ({ summary, loading }) => {
  const total = summary?.totalRegistrations ?? 0;
  const individual = summary?.individualRegistrations ?? 0;
  const schoolCollege = summary?.schoolCollegeRegistrations ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Total Registrations */}
      <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#94A3B8] block">
            TOTAL REGISTRATIONS
          </span>
          <div className="text-3xl font-black font-heading text-white mt-1">
            {loading ? '...' : Number(total).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium mt-0.5 block">
            Across all categories
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FF7B00]/15 text-[#FF7B00] flex items-center justify-center flex-shrink-0">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* Individual Registrations */}
      <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF7B00] block">
            INDIVIDUAL REGISTRATIONS
          </span>
          <div className="text-3xl font-black font-heading text-[#FF7B00] mt-1">
            {loading ? '...' : Number(individual).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium mt-0.5 block">
            ID Format: CMA2026IN...
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FF7B00]/15 text-[#FF7B00] flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6" />
        </div>
      </div>

      {/* School / College Registrations */}
      <div className="p-5 rounded-2xl bg-[#1C2541] border border-white/10 shadow-sm relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00B4D8] block">
            SCHOOL / COLLEGE
          </span>
          <div className="text-3xl font-black font-heading text-[#00B4D8] mt-1">
            {loading ? '...' : Number(schoolCollege).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#64748B] font-medium mt-0.5 block">
            ID Format: CMA2026SC...
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#00B4D8]/15 text-[#00B4D8] flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
