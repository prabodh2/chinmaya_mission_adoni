import React from 'react';
import { Shirt } from 'lucide-react';

export const TshirtSummary = ({ summary, loading }) => {
  const sizes = summary?.tshirtSizes || summary?.sizes || {};
  const totalTshirts =
    summary?.totalTshirts ??
    ((sizes.S || 0) + (sizes.M || 0) + (sizes.L || 0) + (sizes.XL || 0) + (sizes.XXL || 0) + (sizes.XXXL || 0));

  const displaySizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

  return (
    <div className="p-6 rounded-2xl bg-[#1C2541] border border-white/10 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Shirt className="w-5 h-5 text-[#00B4D8]" />
          <h4 className="text-xs font-black uppercase tracking-widest text-[#00B4D8]">
            T-SHIRT REQUIREMENTS SUMMARY
          </h4>
        </div>
        <div className="text-xs font-bold text-[#94A3B8]">
          Total Required:{' '}
          <span className="text-[#00B4D8] font-black text-sm">
            {loading ? '...' : Number(totalTshirts).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {displaySizes.map((size) => {
          const count = sizes[size] ?? 0;
          return (
            <div
              key={size}
              className="p-4 rounded-xl bg-[#0B132B] border border-white/10 text-center transition-all hover:border-[#00B4D8]/50"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#00B4D8]/15 text-[#00B4D8] mb-1">
                Size {size}
              </span>
              <div className="text-2xl font-black font-heading text-white">
                {loading ? '...' : Number(count).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block mt-0.5">
                T-Shirts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
