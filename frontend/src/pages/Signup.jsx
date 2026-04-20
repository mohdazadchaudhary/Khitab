import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stampName, setStampName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      // Attempt to get geolocation
      let lat = 0, lon = 0;
      try {
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
      } catch (geoErr) {
        console.warn("Geolocation denied or timed out. Using default (London).");
        lat = 51.5074; lon = -0.1278;
      }

      const userCredential = await signup(email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        penName: stampName,
        email,
        latitude: lat,
        longitude: lon,
        country: 'Global', // Placeholder, can be refined with reverse geocoding
        city: 'Digital Realm',
        createdAt: Date.now(),
        interests: []
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Left parchment panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2" style={{ backgroundColor: '#ede8dc' }}>
        <p className="font-serif italic text-primary text-2xl mb-2">Khitab</p>
        <h2 className="font-serif text-4xl font-semibold text-on-surface leading-snug mb-4">
          Begin Your<br />Journey
        </h2>
        <p className="font-sans text-sm text-on-surface-variant max-w-xs leading-relaxed">
          Every great correspondence begins with a single line. The vellum is waiting.
        </p>
        <blockquote className="mt-12 border-l-2 border-primary/30 pl-4">
          <p className="font-serif italic text-on-surface-variant text-sm leading-relaxed">
            "To write is to patiently wait for the soul of another to respond through the distance."
          </p>
          <p className="font-sans text-xs text-on-surface-variant/60 mt-2">— The Khitab Manifesto</p>
        </blockquote>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-16">
        <div className="w-full max-w-sm">
          <p className="font-serif italic text-primary text-xl mb-1 lg:hidden">Khitab</p>
          <h1 className="font-serif text-2xl font-semibold text-on-surface mb-1">Create your account</h1>
          <p className="font-sans text-sm text-on-surface-variant mb-8">Your pen name is how the world will know you.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-5 font-sans">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-sans text-xs font-medium text-on-surface-variant uppercase tracking-wider block mb-1.5">Pen Name</label>
              <input
                type="text" required placeholder="e.g. The Wandering Scribe"
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant text-sm font-sans text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={stampName} onChange={e => setStampName(e.target.value)}
              />
            </div>
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
                type="password" required placeholder="min. 6 characters"
                className="w-full px-4 py-3 rounded-lg bg-surface border border-outline-variant text-sm font-sans text-on-surface focus:outline-none focus:border-primary transition-colors"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full text-center">
              {loading ? 'Sealing your account...' : 'Wax Seal Your Registration'}
            </button>
          </form>

          <p className="font-sans text-sm text-center text-on-surface-variant mt-6">
            Already have letters waiting?{' '}
            <Link to="/login" className="text-primary hover:underline">Unlock them</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
