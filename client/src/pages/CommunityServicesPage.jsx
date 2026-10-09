import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { communityService } from '../services/api';
import {
  HeartHandshake,
  Search,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  Camera,
  Code,
  Briefcase,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  X,
  UserCheck,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Services', icon: Sparkles },
  { id: 'Teaching & Education', label: 'Teaching & Education', icon: BookOpen },
  { id: 'Volunteering & Event Support', label: 'Volunteering & Events', icon: Users },
  { id: 'Fitness & Yoga', label: 'Fitness & Yoga', icon: Calendar },
  { id: 'Photography & Media', label: 'Photography & Media', icon: Camera },
  { id: 'Technical & IT Support', label: 'Technical & IT', icon: Code },
  { id: 'Professional & Career Guidance', label: 'Career Guidance', icon: Briefcase },
  { id: 'Community & Elder Care', label: 'Community Care', icon: HeartHandshake },
];

export const CommunityServicesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Offer Service Modal State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: '',
    category: 'Teaching & Education',
    description: '',
    skills: '',
    availability: 'Flexible / Weekends',
    location: 'Adoni, Andhra Pradesh',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
  });
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [modalError, setModalError] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Handle ?offer=true query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('offer') === 'true') {
      if (isAuthenticated) {
        setShowOfferModal(true);
      } else {
        navigate(`/login?redirect=${encodeURIComponent('/services?offer=true')}`);
      }
    }
  }, [location.search, isAuthenticated, navigate]);

  // Load Services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await communityService.getServices({
        category: selectedCategory,
        search: searchQuery,
      });
      if (res.data?.success) {
        setServices(res.data.data.services || []);
      }
    } catch (err) {
      console.error('Failed to load community services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchQuery]);

  const handleOfferClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/services?offer=true')}`);
    } else {
      setOfferForm((prev) => ({
        ...prev,
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
      }));
      setShowOfferModal(true);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!offerForm.title.trim() || !offerForm.description.trim()) {
      setModalError('Title and description are required.');
      return;
    }

    setSubmittingOffer(true);
    try {
      const res = await communityService.createService(offerForm);
      if (res.data?.success) {
        setShowOfferModal(false);
        setSuccessBanner('Your service offering has been published to the community directory!');
        setOfferForm({
          title: '',
          category: 'Teaching & Education',
          description: '',
          skills: '',
          availability: 'Flexible / Weekends',
          location: 'Adoni, Andhra Pradesh',
          contactPhone: user?.phone || '',
          contactEmail: user?.email || '',
        });
        fetchServices();
        setTimeout(() => setSuccessBanner(''), 5000);
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to submit service. Please try again.');
    } finally {
      setSubmittingOffer(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border-color)] p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--cyan)]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--orange)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--cyan)]/15 border border-[var(--cyan)]/30 text-[var(--cyan)] text-xs font-black uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Community Service Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-[var(--text-primary)] leading-tight tracking-tight">
            Serve & Elevate the Community Together
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-muted)] font-medium leading-relaxed">
            Discover meaningful services offered by registered Chinmaya Mission Adoni members, or contribute your skills in teaching, volunteering, technical support, yoga, media, and community outreach.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={handleOfferClick}
              className="btn-primary py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[var(--orange)]/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Offer A Service</span>
            </button>

            {isAuthenticated && (
              <button
                onClick={() => navigate('/my-activity')}
                className="px-5 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-primary)] hover:border-[var(--orange)] transition-all flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-[var(--orange)]" />
                <span>My Submitted Services</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Banner Alert */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-500 font-semibold text-sm animate-in fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services by keyword, skills, or location..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--orange)] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-[var(--text-muted)] font-semibold flex items-center gap-1.5 self-end md:self-center">
            <Sparkles className="w-3.5 h-3.5 text-[var(--orange)]" />
            <span>Showing {services.length} published service{services.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[var(--orange)] text-white shadow-md shadow-[var(--orange)]/25'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[var(--orange)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[var(--text-muted)] font-semibold">Loading published services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] flex items-center justify-center mx-auto">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No services found</h3>
            <p className="text-xs text-[var(--text-muted)]">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Try adjusting your search query or category filters.'
                : 'Be the first registered member to offer a service to our community!'}
            </p>
          </div>
          <button onClick={handleOfferClick} className="btn-primary py-3 px-6 rounded-2xl text-xs font-bold">
            Offer A Service Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => {
            const isMyService = user && srv.userId && (srv.userId._id === user._id || srv.userId === user._id);
            return (
              <div
                key={srv._id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--orange)]/40 rounded-[28px] p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-3">
                  {/* Category & Owner Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[var(--cyan)]/15 text-[var(--cyan)] text-[10px] font-black uppercase tracking-wider">
                      {srv.category}
                    </span>
                    {isMyService && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[var(--orange)]/15 text-[var(--orange)] text-[10px] font-black uppercase tracking-wider">
                        Your Offering
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-[var(--text-primary)] leading-snug group-hover:text-[var(--orange)] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                {/* Metadata & Submitter Info */}
                <div className="space-y-3 pt-3 border-t border-[var(--border-color)]">
                  <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                    {srv.skills && (
                      <div className="flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--orange)] shrink-0 mt-0.5" />
                        <span className="line-clamp-1"><strong>Skills:</strong> {srv.skills}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[var(--cyan)] shrink-0" />
                      <span>{srv.availability}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{srv.location}</span>
                    </div>
                  </div>

                  {/* Submitter & Direct Contact */}
                  <div className="p-3 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex items-center justify-between gap-2">
                    <div className="truncate">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{srv.fullName}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">Registered Provider</p>
                    </div>

                    <a
                      href={`tel:${srv.contactPhone}`}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--orange)]/15 border border-[var(--orange)]/30 text-[var(--orange)] text-xs font-bold hover:bg-[var(--orange)] hover:text-white transition-all text-decoration-none"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Offer Service Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 my-8">
            <button
              onClick={() => setShowOfferModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--orange)]/15 text-[var(--orange)] mb-2">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-[var(--text-primary)]">
                Offer a Community Service
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Submitted services are published instantly in the community directory.
              </p>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              {/* Service Title */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                  placeholder="e.g. Free High School Math & Science Coaching"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={offerForm.category}
                  onChange={(e) => setOfferForm({ ...offerForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none"
                >
                  <option value="Teaching & Education">Teaching & Education</option>
                  <option value="Volunteering & Event Support">Volunteering & Event Support</option>
                  <option value="Fitness & Yoga">Fitness & Yoga</option>
                  <option value="Photography & Media">Photography & Media</option>
                  <option value="Technical & IT Support">Technical & IT Support</option>
                  <option value="Professional & Career Guidance">Professional & Career Guidance</option>
                  <option value="Community & Elder Care">Community & Elder Care</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                  placeholder="Describe the service, how you can help, and any relevant experience..."
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none focus:border-[var(--orange)]"
                />
              </div>

              {/* Skills & Experience */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Key Skills / Qualifications
                </label>
                <input
                  type="text"
                  value={offerForm.skills}
                  onChange={(e) => setOfferForm({ ...offerForm, skills: e.target.value })}
                  placeholder="e.g. B.Sc. Mathematics, 5 years tutoring experience"
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none"
                />
              </div>

              {/* Availability & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Availability
                  </label>
                  <input
                    type="text"
                    value={offerForm.availability}
                    onChange={(e) => setOfferForm({ ...offerForm, availability: e.target.value })}
                    placeholder="e.g. Weekends (4-6 PM)"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Location / Area
                  </label>
                  <input
                    type="text"
                    value={offerForm.location}
                    onChange={(e) => setOfferForm({ ...offerForm, location: e.target.value })}
                    placeholder="e.g. Adoni Town / Online"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={offerForm.contactPhone}
                  onChange={(e) => setOfferForm({ ...offerForm, contactPhone: e.target.value })}
                  placeholder="Contact mobile number"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-xs sm:text-sm text-[var(--text-primary)] font-semibold focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--bg-tertiary)] text-xs font-bold text-[var(--text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="btn-primary py-2.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider"
                >
                  {submittingOffer ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityServicesPage;
