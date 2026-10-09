import React, { useEffect, useState } from 'react';
import { adminContactService } from '../services/adminApi';
import {
  MessageSquare,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  User,
  Check,
} from 'lucide-react';

export const LetsConnectPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: null, message: '' });

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await adminContactService.getMessagesAdmin();
      if (res.data?.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'RESOLVED' ? 'PENDING' : 'RESOLVED';
    try {
      const res = await adminContactService.updateStatus(id, nextStatus);
      if (res.data?.success) {
        fetchMessages();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete inquiry from "${name || id}"?`)) return;

    try {
      const res = await adminContactService.deleteMessage(id);
      if (res.data?.success) {
        setFeedback({
          type: 'success',
          message: 'Contact inquiry deleted from database.',
        });
        fetchMessages();
      }
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black tracking-widest text-[#00B4D8] uppercase">
            PUBLIC INQUIRIES & MESSAGES
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
            LET'S CONNECT INBOX
          </h2>
          <p className="text-xs text-[#94A3B8] font-medium">
            Review inquiries, sponsorship proposals, volunteer applications, and messages
          </p>
        </div>

        <button
          onClick={fetchMessages}
          disabled={loading}
          className="btn-secondary text-xs py-2 px-3.5 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Reload</span>
        </button>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-xs text-[#94A3B8] text-center py-8">Loading inbox messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="p-5 sm:p-6 rounded-3xl bg-[#1C2541] border border-white/10 shadow-lg space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00B4D8]/15 text-[#00B4D8] flex items-center justify-center font-black">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black font-heading text-white">
                      {msg.name || 'Anonymous Inquiry'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#94A3B8]">
                      {msg.phone && <span className="font-mono">+91 {msg.phone}</span>}
                      {msg.email && <span>{msg.email}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusToggle(msg._id, msg.status)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      msg.status === 'RESOLVED'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {msg.status === 'RESOLVED' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolved</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(msg._id, msg.name)}
                    className="p-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#F8FAFC] leading-relaxed bg-[#0B132B] p-4 rounded-2xl border border-white/5">
                <p className="font-bold text-[#00B4D8] mb-1">Subject: {msg.subject || 'General Inquiry'}</p>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
                <span>
                  Received on{' '}
                  {new Date(msg.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                <span className="font-mono">ID: {msg._id}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-[#64748B] text-center py-12">No inquiries received yet.</p>
        )}
      </div>
    </div>
  );
};

export default LetsConnectPage;
