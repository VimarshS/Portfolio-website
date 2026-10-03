import React, { useEffect, useState } from 'react';
import { adminLogin, clearToken, verifyToken } from './adminApi';
import { AdminDashboard } from './AdminDashboard';

type Status = 'checking' | 'loggedOut' | 'loggedIn';

export const AdminPage: React.FC = () => {
  const [status, setStatus] = useState<Status>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Keep this page out of search engines
  useEffect(() => {
    document.title = 'Admin | Portfolio';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // When the page opens, check if a saved token is still valid
  useEffect(() => {
    verifyToken().then((ok) => {
      if (!ok) clearToken();
      setStatus(ok ? 'loggedIn' : 'loggedOut');
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await adminLogin(email.trim(), password);

    setSubmitting(false);
    if (result.ok) {
      setPassword('');
      setStatus('loggedIn');
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleLogout = () => {
    clearToken();
    setStatus('loggedOut');
  };

  // Logged in: show the dashboard on its own full page
  if (status === 'loggedIn') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#050506] text-neutral-200 tech-grid-pattern flex items-center justify-center px-4">
      {status === 'checking' && (
        <p className="text-sm font-mono text-neutral-500">Checking session...</p>
      )}

      {status === 'loggedOut' && (
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#08080a]/95 p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          <div>
            <div className="text-xs font-mono text-indigo-400 mb-2">Private area</div>
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="text-xs text-neutral-400">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-xs text-neutral-400">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-rose-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>

          <a
            href="/"
            className="block text-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Back to portfolio
          </a>
        </form>
      )}
    </div>
  );
};