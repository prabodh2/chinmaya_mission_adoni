import React, { useState, useRef } from 'react';
import { CheckCircle, Download, Printer, X } from 'lucide-react';
import { EntryPass } from './EntryPass';
import { downloadEntryPassAsImage, printEntryPass } from '../utils/entryPassGenerator';

/**
 * Registration Success & Entry Pass Modal
 * Replaces the old ticket modal completely with the official Entry Pass.
 */
export const EntryPassModal = ({ data, eventConfig, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const isSavingRef = useRef(false);

  if (!data) return null;

  const handleSaveEntryPass = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isSavingRef.current || downloading) return;

    isSavingRef.current = true;
    setDownloading(true);

    try {
      const success = await downloadEntryPassAsImage('official-entry-pass', data.registrationId);
      if (success) {
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to download entry pass:', err);
      // Fallback to print dialog if canvas fails
      printEntryPass();
    } finally {
      setDownloading(false);
      isSavingRef.current = false;
    }
  };

  const handlePrint = () => {
    printEntryPass();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      
      {/* Print-specific style to isolate ONLY the Entry Pass on a single clean page */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-entry-pass, #official-entry-pass * {
            visibility: visible !important;
          }
          #official-entry-pass {
            position: absolute !important;
            left: 50% !important;
            top: 20px !important;
            transform: translateX(-50%) !important;
            width: 480px !important;
            margin: 0 auto !important;
            border: 2px solid #fca590 !important;
            box-shadow: none !important;
            background-color: #ffffff !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: portrait;
            margin: 1cm;
          }
        }
      `}</style>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] max-w-xl w-full p-6 sm:p-8 relative shadow-2xl space-y-6 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. REGISTRATION SUCCESS CONFIRMATION HEADER */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold text-[11px] tracking-widest uppercase">
            REGISTRATION SUCCESSFUL!
          </span>

          <h2 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
            Registration Confirmed
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Registration ID:
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-[var(--orange)] bg-[var(--orange)]/10 px-3 py-0.5 rounded-lg border border-[var(--orange)]/30">
              {data.registrationId}
            </span>
          </div>

          <p className="text-xs text-[var(--text-muted)] font-medium max-w-sm mx-auto">
            Your registration is confirmed. Please save or download your official Entry Pass below.
          </p>
        </div>

        {/* 2. PROMINENT SAVE ENTRY PASS BUTTON */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleSaveEntryPass}
            disabled={downloading}
            className={`w-full btn-primary justify-center py-4 text-base font-extrabold shadow-xl transition-all flex items-center gap-2.5 bg-gradient-to-r from-[var(--orange)] to-amber-600 text-white ${
              downloading ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'hover:scale-[1.01]'
            }`}
          >
            <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
            <span>{downloading ? 'GENERATING ENTRY PASS...' : 'Save Entry Pass'}</span>
          </button>

          <div className="flex items-center justify-between text-xs px-1">
            <button
              onClick={handlePrint}
              type="button"
              className="text-[var(--text-muted)] hover:text-[var(--cyan)] font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            {downloadSuccess && (
              <span className="text-emerald-500 font-extrabold text-[11px] flex items-center gap-1 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" /> Saved to Downloads!
              </span>
            )}
          </div>
        </div>

        {/* 3. ENTRY PASS VISUAL PREVIEW */}
        <div className="pt-2 border-t border-[var(--border-color)]">
          <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] text-center mb-3">
            OFFICIAL ENTRY PASS PREVIEW
          </p>

          <div className="overflow-x-auto py-1">
            <EntryPass
              id="official-entry-pass"
              registration={data}
              eventConfig={eventConfig}
            />
          </div>
        </div>

        {/* 4. MODAL FOOTER */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors py-1"
          >
            Done & Close Window
          </button>
        </div>

      </div>
    </div>
  );
};

export default EntryPassModal;
