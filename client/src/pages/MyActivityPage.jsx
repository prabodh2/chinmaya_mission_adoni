import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, eventService } from '../services/api';
import { EntryPassModal } from '../components/EntryPassModal';
import {
  Activity,
  Award,
  Calendar,
  Ticket,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  Shirt,
  User,
  MapPin,
  Eye,
} from 'lucide-react';

export const MyActivityPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'REGISTRATIONS' | 'INQUIRIES'
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState({
    summary: {
      totalRegistrations: 0,
      confirmedPasses: 0,
      connectionInquiries: 0,
    },
    activities: [],
    registrations: [],
    contactMessages: [],
    eventConfig: null,
  });

  const [selectedRegistrationForPass, setSelectedRegistrationForPass] = useState(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await userService.getActivities();
      if (res.data?.success) {
        setActivityData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const { summary, activities, registrations, contactMessages, eventConfig } = activityData;

  // Filter activities to exclude community services for now
  const displayActivities = (activities || []).filter(
    (item) => item.activityType !== 'COMMUNITY_SERVICE'
  );

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--orange)]">
              MY ACCOUNT HUB
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--orange)]" />
            <span className="text-xs font-bold text-[var(--text-muted)]">
              {user?.fullName || 'User'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[var(--text-primary)]">
            My Activity & Passes
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchActivities}
            className="p-2.5 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--orange)] transition-all"
            title="Refresh Activities"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/register"
            className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wide text-decoration-none shadow-md shadow-[var(--orange)]/20"
          >
            <Award className="w-4 h-4" />
            <span>Register For Marathon</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Registrations Card */}
        <div
          onClick={() => setActiveTab('REGISTRATIONS')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'REGISTRATIONS'
              ? 'bg-[var(--orange)]/10 border-[var(--orange)] shadow-lg'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-[var(--orange)]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Registrations
            </span>
            <div className="w-8 h-8 rounded-xl bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-2">
            {summary?.totalRegistrations || registrations?.length || 0}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
            {summary?.confirmedPasses || 0} Confirmed Pass{(summary?.confirmedPasses || 0) !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Confirmed Passes */}
        <div
          onClick={() => setActiveTab('REGISTRATIONS')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'REGISTRATIONS'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-lg'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Active Passes
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-2">
            {summary?.confirmedPasses || 0}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Ready for event check-in</p>
        </div>

        {/* Inquiries */}
        <div
          onClick={() => setActiveTab('INQUIRIES')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'INQUIRIES'
              ? 'bg-purple-500/10 border-purple-500 shadow-lg'
              : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:border-purple-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Inquiries
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-2">
            {summary?.connectionInquiries || contactMessages?.length || 0}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Connection requests</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[var(--border-color)]">
        {[
          { key: 'ALL', label: 'All Activities', count: displayActivities.length },
          { key: 'REGISTRATIONS', label: 'Event Passes & Registrations', count: (registrations || []).length },
          { key: 'INQUIRIES', label: 'Connection Inquiries', count: (contactMessages || []).length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === t.key
                ? 'bg-[var(--orange)] text-white shadow-md shadow-[var(--orange)]/30'
                : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
            }`}
          >
            <span>{t.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === t.key ? 'bg-white/20 text-white' : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Section based on Tab */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--text-muted)] font-semibold">Loading your activities and passes...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* TAB 1: ALL ACTIVITIES CHRONOLOGICAL TIMELINE */}
          {activeTab === 'ALL' && (
            <div className="space-y-4">
              {displayActivities.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] flex items-center justify-center mx-auto">
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">No activities recorded yet</h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Your event registrations, official entry passes, and connection inquiries will appear here automatically.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Link to="/register" className="btn-primary py-2.5 px-5 rounded-2xl text-xs font-bold text-decoration-none">
                      Register For Marathon
                    </Link>
                    <Link to="/lets-connect" className="px-5 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] text-decoration-none">
                      Connect With Us
                    </Link>
                  </div>
                </div>
              ) : (
                displayActivities.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--orange)]/40 rounded-3xl p-5 sm:p-6 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          item.activityType === 'EVENT_REGISTRATION'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-purple-500/15 text-purple-500'
                        }`}
                      >
                        {item.activityType === 'EVENT_REGISTRATION' ? (
                          <Award className="w-6 h-6" />
                        ) : (
                          <MessageSquare className="w-6 h-6" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-[var(--text-primary)]">{item.title}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              item.status === 'CONFIRMED'
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                : item.status === 'NEW'
                                ? 'bg-blue-500/15 text-blue-500'
                                : 'bg-slate-500/15 text-slate-400'
                            }`}
                          >
                            {item.badgeText}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[var(--text-primary)]">Ref: {item.referenceNumber}</span>
                          <span>•</span>
                          <span>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          {item.details?.category && (
                            <>
                              <span>•</span>
                              <span>{item.details.category}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {item.activityType === 'EVENT_REGISTRATION' && (
                        <button
                          onClick={() => setSelectedRegistrationForPass(item.registrationRecord)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>View Entry Pass</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MARATHON REGISTRATIONS & ENTRY PASSES */}
          {activeTab === 'REGISTRATIONS' && (
            <div className="space-y-6">
              {(registrations || []).length === 0 ? (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                    <Ticket className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">No registrations found</h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      You have not registered for any events yet. Join the upcoming Anti-Drug Movement Marathon Run 2026!
                    </p>
                  </div>
                  <Link to="/register" className="inline-flex btn-primary py-3 px-6 rounded-2xl text-xs font-bold text-decoration-none">
                    Register Now & Get Entry Pass
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 shadow-md hover:shadow-xl transition-all space-y-5 relative overflow-hidden"
                    >
                      {/* Top Ribbon */}
                      <div className="flex items-start justify-between gap-2 border-b border-[var(--border-color)] pb-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--orange)]">
                            MARATHON 2026 PASS
                          </span>
                          <h3 className="text-lg font-black text-[var(--text-primary)]">{reg.fullName}</h3>
                          <p className="text-xs font-bold text-emerald-500 font-mono mt-0.5">ID: {reg.registrationId}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            reg.status === 'CONFIRMED'
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-500'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>

                      {/* Participant Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">T-Shirt Size</span>
                          <span className="font-black text-[var(--text-primary)] flex items-center gap-1.5 mt-0.5">
                            <Shirt className="w-3.5 h-3.5 text-[var(--orange)]" />
                            {reg.tShirtSize || 'M'}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Category</span>
                          <span className="font-bold text-[var(--text-primary)] uppercase mt-0.5 block truncate">
                            {reg.registrationType === 'school_college' ? 'Student Drive' : 'Individual Run'}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] col-span-2">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">Institution</span>
                          <span className="font-bold text-[var(--text-primary)] mt-0.5 block truncate">
                            {reg.institutionName || 'Individual Runner'}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => setSelectedRegistrationForPass(reg)}
                          className="flex-1 btn-primary py-2.5 rounded-xl justify-center font-bold text-xs uppercase tracking-wider shadow-md shadow-[var(--orange)]/20"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>View Official Pass</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONNECTION REQUESTS & INQUIRIES */}
          {activeTab === 'INQUIRIES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">Your Messages & Connection Requests</h2>
                  <p className="text-xs text-[var(--text-muted)]">Track responses to your inquiries sent to Chinmaya Mission Adoni</p>
                </div>

                <Link
                  to="/lets-connect"
                  className="btn-primary py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-decoration-none flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Message</span>
                </Link>
              </div>

              {(contactMessages || []).length === 0 ? (
                <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-500/15 text-purple-500 flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">No messages submitted yet</h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      Want to connect regarding volunteering, spiritual discourses, youth camps, or donation inquiries? Reach out anytime!
                    </p>
                  </div>
                  <Link to="/lets-connect" className="inline-flex btn-primary py-3 px-6 rounded-2xl text-xs font-bold text-decoration-none">
                    Send a Message
                  </Link>
                </div>
              ) : (
                contactMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-3xl p-5 sm:p-6 transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-500 text-[10px] font-black uppercase tracking-wider">
                          {msg.category || 'General Message'}
                        </span>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          Submitted on {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          msg.status === 'RESPONDED'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : msg.status === 'READ'
                            ? 'bg-blue-500/15 text-blue-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {msg.status === 'NEW' ? 'Submitted' : msg.status === 'READ' ? 'Under Review' : 'Responded'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                      "{msg.message}"
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Entry Pass Modal for direct viewing and downloading from My Activity */}
      {selectedRegistrationForPass && (
        <EntryPassModal
          data={selectedRegistrationForPass}
          eventConfig={eventConfig}
          onClose={() => setSelectedRegistrationForPass(null)}
        />
      )}
    </div>
  );
};

export default MyActivityPage;
