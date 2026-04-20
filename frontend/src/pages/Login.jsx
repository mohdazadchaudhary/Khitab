import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2" style={{ backgroundColor: '#ede8dc' }}>
        <p className="font-serif italic text-primary text-2xl mb-2">Khitab</p>
        <h2 className="font-serif text-4xl font-semibold text-on-surface leading-snug mb-4">
          Your letters<br />are waiting.
        </h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-xs leading-relaxed">
          Someone, somewhere, has penned words just for you. Return to your desk.
        </p>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-16">
        <div className="w-full max-w-sm">
          <p className="font-serif italic text-primary text-xl mb-1 lg:hidden">Khitab</p>
          <h1 className="font-serif text-2xl font-semibold text-on-surface mb-1">Welcome back</h1>
          <p className="font-sans text-sm text-on-surface-variant mb-8">Unlock your correspondence.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-sans text-xs font-medium text-on-surface-variant uppercase tracking-wider block mb-1.5">Email Address</label>
              <input
                type="email" required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant text-sm font-sans text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="font-sans text-xs font-medium text-on-surface-variant uppercase tracking-wider block mb-1.5">Secret Key</label>
              <input
                type="password" required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant text-sm font-sans text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full text-center">
              {loading ? 'Unlocking...' : 'Break the Seal'}
            </button>
          </form>

          <p className="font-sans text-sm text-center text-on-surface-variant mt-6">
            No envelope yet?{' '}
            <Link to="/signup" className="text-primary hover:underline">Draft one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
