import React from 'react';
import { Shirt } from 'lucide-react';

export const TshirtSummary = ({ summary, loading }) => {
  const sizes = summary?.tshirtSizes || summary?.sizes || {};
  const totalTshirts = summary?.totalTshirts ?? (
    (sizes.S || 0) + (sizes.M || 0) + (sizes.L || 0) + (sizes.XL || 0)
  );

  const displaySizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Shirt className="w-5 h-5 text-[var(--cyan)]" />
          <h4 className="text-xs font-black uppercase tracking-widest text-[var(--cyan)]">
            T-SHIRT SUMMARY
          </h4>
        </div>
        <div className="text-xs font-bold text-[var(--text-muted)]">
          Total Required:{' '}
          <span className="text-[var(--cyan)] font-black text-sm">
            {loading ? '...' : Number(totalTshirts).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displaySizes.map((size) => {
          const count = sizes[size] ?? 0;
          return (
            <div
              key={size}
              className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center transition-all hover:border-[var(--cyan)]/50"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[var(--cyan)]/15 text-[var(--cyan)] mb-1">
                Size {size}
              </span>
              <div className="text-2xl font-black font-heading text-[var(--text-primary)]">
                {loading ? '...' : Number(count).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider block mt-0.5">
                T-Shirts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
