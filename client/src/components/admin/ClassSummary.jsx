import React from 'react';
import { GraduationCap } from 'lucide-react';

export const ClassSummary = ({ summary, loading }) => {
  const classWise = summary?.classWise || {};
  const entries = Object.entries(classWise);

  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[var(--orange)]" />
          <h4 className="text-xs font-black uppercase tracking-widest text-[var(--orange)]">
            CLASS SUMMARY (STUDENT DETAILS)
          </h4>
        </div>
        <span className="text-[10px] text-[var(--text-muted)] font-medium">
          Calculated dynamically from registrations
        </span>
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-muted)] text-center py-4">Loading class counts...</p>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {entries.map(([standardName, count]) => (
            <div
              key={standardName}
              className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center transition-all hover:border-[var(--orange)]/40"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[var(--orange)]/15 text-[var(--orange)] mb-1">
                {standardName}
              </span>
              <div className="text-xl font-black font-heading text-[var(--text-primary)]">
                {Number(count).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider block mt-0.5">
                Students
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-[var(--text-muted)] font-semibold">
          No class-specific records found yet.
        </div>
      )}
    </div>
  );
};
