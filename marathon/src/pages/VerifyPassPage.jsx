import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { registrationService } from '../services/api';
import {
  ShieldCheck,
  AlertCircle,
  Award,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Shirt,
  User,
  GraduationCap,
  ArrowLeft,
  Flame,
} from 'lucide-react';

export const VerifyPassPage = () => {
  const { passId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!passId) {
      setError('No pass identifier provided.');
      setLoading(false);
      return;
    }

    registrationService
      .verifyPass(passId)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          setVerificationData(res.data.data);
        } else {
          setError(res.data?.message || 'Pass verification failed');
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Invalid or unconfirmed entry pass');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [passId]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
        
        {/* Glow Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] hover:text-[var(--orange)] transition-colors text-decoration-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marathon Home</span>
        </Link>

        {loading ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Verifying Official Entry Pass...
            </p>
          </div>
        ) : error || !verificationData?.isValid ? (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
              <XCircle className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-red-500/15 text-red-500 font-extrabold text-[11px] tracking-widest uppercase">
              VERIFICATION FAILED
            </span>

            <h1 className="text-2xl font-black font-heading text-[var(--text-primary)]">
              Entry Pass Not Verified
            </h1>

            <p className="text-sm text-[var(--text-muted)] font-medium max-w-sm mx-auto">
              {error || 'This pass identifier does not correspond to an active or confirmed registration record.'}
            </p>

            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl font-mono text-xs text-[var(--text-muted)]">
              Queried ID: {passId}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Success Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold text-[11px] tracking-widest uppercase border border-emerald-500/30">
                OFFICIAL ENTRY PASS VERIFIED
              </span>

              <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
                {verificationData.fullName}
              </h1>

              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase">Pass ID:</span>
                <span className="text-sm font-black font-mono text-[var(--orange)] bg-[var(--orange)]/10 px-2.5 py-0.5 rounded-lg border border-[var(--orange)]/30">
                  {verificationData.entryPassId || verificationData.registrationId}
                </span>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-[var(--bg-primary)] p-5 rounded-2xl border border-[var(--border-color)] space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] font-bold">Registration ID:</span>
                <span className="font-mono font-black text-[var(--text-primary)]">
                  {verificationData.registrationId}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] font-bold">Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-extrabold uppercase text-[10px]">
                  {verificationData.status}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] font-bold">T-Shirt Size:</span>
                <span className="font-black text-[var(--text-primary)]">
                  {verificationData.tShirtSize}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] font-bold">Participant Type:</span>
                <span className="font-extrabold text-[var(--text-primary)] uppercase">
                  {verificationData.isStudent ? 'Student' : 'Individual'}
                  {verificationData.groupRole ? ` • ${verificationData.groupRole}` : ''}
                </span>
              </div>

              {verificationData.institutionName && verificationData.institutionName !== 'N/A' && (
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-muted)] font-bold">School / College:</span>
                  <span className="font-bold text-[var(--text-primary)] text-right truncate max-w-[200px]">
                    {verificationData.institutionName}
                  </span>
                </div>
              )}

              {/* Event Info */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-bold text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--orange)]" />
                  <span>20 Dec 2026, 6:00 AM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--cyan)]" />
                  <span>Adoni, AP</span>
                </div>
              </div>
            </div>

            {/* Organizers Branding */}
            <p className="text-[10px] text-center font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Chinmaya Mission Adoni • Chinmaya Yuva Kendra Adoni
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyPassPage;
