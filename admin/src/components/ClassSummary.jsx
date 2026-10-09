import React from 'react';
import { GraduationCap } from 'lucide-react';

export const ClassSummary = ({ summary, loading }) => {
  const classWise = summary?.classWise || {};
  const entries = Object.entries(classWise);

  return (
    <div className="p-6 rounded-2xl bg-[#1C2541] border border-white/10 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#FF7B00]" />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#FF7B00]">
            CLASS SUMMARY (STUDENT DETAILS)
          </h4>
        </div>
        <span className="text-[10px] text-[#64748B] font-medium">
          Calculated dynamically from database
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-[#64748B] text-center py-4">Loading class counts...</p>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {entries.map(([standardName, count]) => (
            <div
              key={standardName}
              className="p-3.5 rounded-xl bg-[#0B132B] border border-white/10 text-center transition-all hover:border-[#FF7B00]/40"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#FF7B00]/15 text-[#FF7B00] mb-1">
                {standardName}
              </span>
              <div className="text-xl font-black font-heading text-white">
                {Number(count).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block mt-0.5">
                Students
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-[#64748B] font-semibold">
          No class-specific records found yet.
        </div>
      )}
    </div>
  );
};
