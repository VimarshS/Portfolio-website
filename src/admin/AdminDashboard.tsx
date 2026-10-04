import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Inbox, LogOut, Mail, MailOpen, RefreshCw, Trash2 } from 'lucide-react';
import {
  AdminMessage,
  AdminStats,
  deleteMessage,
  fetchMessages,
  fetchStats,
  isSessionExpired,
  setMessageRead,
} from './adminApi';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Filter = 'all' | 'unread';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

// Opens a Gmail compose window in a new tab (works without a desktop mail app)
const gmailComposeUrl = (email: string, subject: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: ' + subject)}`;

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="rounded-xl border border-neutral-800 bg-[#08080a]/95 p-5 flex items-center justify-between">
    <div>
      <div className="text-xs text-neutral-500 mb-1">{label}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">{icon}</div>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = async (m: AdminMessage) => {
    try {
      await navigator.clipboard.writeText(m.email);
      setCopiedId(m._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError('Could not copy. Select the email text and copy it by hand.');
    }
  };

  // Keep the latest onLogout without re-running effects when it changes
  const logoutRef = useRef(onLogout);
  logoutRef.current = onLogout;

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [s, m] = await Promise.all([fetchStats(), fetchMessages()]);
      setStats(s);
      setMessages(m);
      setError('');
    } catch (err) {
      if (isSessionExpired(err)) {
        logoutRef.current();
        return;
      }
      setError(err instanceof Error ? err.message : 'Could not load data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Runs an action (mark read, delete), then reloads the numbers and the list
  const runAction = async (id: string, action: () => Promise<void>) => {
    setBusyId(id);
    setError('');
    try {
      await action();
      await load(true);
    } catch (err) {
      if (isSessionExpired(err)) {
        logoutRef.current();
        return;
      }
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleOpen = (m: AdminMessage) => {
    const opening = expandedId !== m._id;
    setExpandedId(opening ? m._id : null);
    setConfirmId(null);
    // Opening an unread message marks it as read
    if (opening && !m.isRead) {
      runAction(m._id, () => setMessageRead(m._id, true));
    }
  };

  const handleDelete = (id: string) => {
    setConfirmId(null);
    setExpandedId(null);
    runAction(id, () => deleteMessage(id));
  };

  const visibleMessages = filter === 'unread' ? messages.filter((m) => !m.isRead) : messages;

  return (
    <div className="min-h-screen bg-[#050506] text-neutral-200 tech-grid-pattern px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-indigo-400 mb-1">Private area</div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="/"
              className="px-3 py-2 rounded-lg border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
            >
              Portfolio
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 text-xs text-white hover:bg-neutral-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-xs text-rose-400 border border-rose-500/30 bg-rose-500/5 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total messages" value={stats?.totalMessages ?? '-'} icon={<Inbox className="w-5 h-5" />} />
          <StatCard label="Unread" value={stats?.unreadMessages ?? '-'} icon={<Mail className="w-5 h-5" />} />
          <StatCard label="Resume downloads" value={stats?.resumeDownloads ?? '-'} icon={<Download className="w-5 h-5" />} />
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <div className="flex items-center gap-1 p-1 bg-neutral-900/90 border border-neutral-800 rounded-lg">
              {(['all', 'unread'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                    filter === f ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {loading && messages.length === 0 && (
            <p className="text-sm font-mono text-neutral-500">Loading...</p>
          )}

          {!loading && visibleMessages.length === 0 && (
            <p className="text-sm text-neutral-500 border border-dashed border-neutral-800 rounded-xl px-4 py-8 text-center">
              {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
            </p>
          )}

          <div className="space-y-3">
            {visibleMessages.map((m) => {
              const isOpen = expandedId === m._id;
              const isBusy = busyId === m._id;

              return (
                <div
                  key={m._id}
                  className={`rounded-xl border bg-[#08080a]/95 transition-colors ${
                    isOpen ? 'border-neutral-700' : 'border-neutral-800 hover:border-neutral-700'
                  } ${isBusy ? 'opacity-60' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleOpen(m)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-4 flex items-start gap-3"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                        m.isRead ? 'bg-transparent' : 'bg-indigo-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className={`text-sm ${m.isRead ? 'text-neutral-300' : 'text-white font-semibold'}`}>
                          {m.name}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">{m.category}</span>
                      </div>
                      <div className="text-sm text-neutral-400 truncate">{m.subject}</div>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500 shrink-0">
                      {formatDate(m.createdAt)}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pl-9 space-y-4">
                      <div className="text-xs text-indigo-400 select-text">{m.email}</div>

                      <p className="text-sm text-neutral-300 whitespace-pre-wrap wrap-break-word leading-relaxed">
                        {m.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={gmailComposeUrl(m.email, m.subject)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs text-white hover:bg-indigo-500 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Reply in Gmail
                        </a>

                        <button
                          onClick={() => handleCopyEmail(m)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
                        >
                          {copiedId === m._id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedId === m._id ? 'Copied' : 'Copy email'}
                        </button>

                        <button
                          onClick={() => runAction(m._id, () => setMessageRead(m._id, !m.isRead))}
                          disabled={isBusy}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 disabled:opacity-50 transition-colors"
                        >
                          <MailOpen className="w-3.5 h-3.5" />
                          {m.isRead ? 'Mark as unread' : 'Mark as read'}
                        </button>

                        {confirmId !== m._id && (
                          <button
                            onClick={() => setConfirmId(m._id)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-rose-400 hover:border-rose-500/50 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        )}
                      </div>

                      {confirmId === m._id && (
                        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-3">
                          <p className="text-xs text-rose-200">
                            Delete the message from <b>{m.name}</b> ("{m.subject}")? This cannot be undone.
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(m._id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 text-xs text-white hover:bg-rose-500 transition-colors"
                            >
                              Yes, delete
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-300 hover:border-neutral-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};