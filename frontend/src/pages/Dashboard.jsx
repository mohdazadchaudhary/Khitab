import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel';
import { Explore } from './Explore';
import { Profile } from './Profile';
import { Settings } from './Settings';
import { Tracking } from './Tracking';
import { Suggestions } from './Suggestions';

// ... (icons)

// ─── Icons ───────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IconInbox    = () => <Icon d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>;
const IconSent     = () => <Icon d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>;
const IconTransit  = () => <Icon d="M5 12h14M12 5l7 7-7 7"/>;
const IconExplore  = () => <Icon d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0v20M2 12h20"/>;
const IconProfile  = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>;
const IconPen      = () => <Icon d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>;
const IconSettings = () => <Icon d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>;
const IconLogout   = () => <Icon d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>;

// ─── Demo letters so the inbox isn't empty ───────────────────────────
const DEMO_LETTERS = [
  {
    id: 'demo1',
    status: 'DELIVERED',
    senderPenName: 'Julian Thorne',
    senderLocation: 'Edinburgh, Scotland',
    deliverAt: Date.now() - 3 * 3600000,
    content: 'The rain here has a particular grammar — it starts as a whisper on the old cobblestones outside my window, then grows into something full and declarative.\n\nI have been thinking about what it means to write to a stranger. There is a peculiar courage required — you send yourself across an ocean of silence and wait.\n\nI hope this letter finds you well.',
  },
  {
    id: 'demo2',
    status: 'IN_TRANSIT',
    senderPenName: 'Elena Rossi',
    senderLocation: 'Florence, Italy',
    deliverAt: Date.now() + 8 * 3600000,
    content: '',
  },
  {
    id: 'demo3',
    status: 'DELIVERED',
    senderPenName: 'Marcus Vane',
    senderLocation: 'Kyoto, Japan',
    deliverAt: Date.now() - 26 * 3600000,
    content: 'I sat in the temple garden for three hours today and did not think about anything useful. The moss was very green. I thought you might appreciate knowing that somewhere in the world, someone was simply sitting.\n\nThe autumn maples are beginning to turn. By the time this reaches you, they may be fully red.',
  },
];

// ─── Time helper ─────────────────────────────────────────────────────
function formatDelivery(deliverAt, status) {
  const now = Date.now();
  const date = new Date(deliverAt);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString([], { day: 'numeric', month: 'short' });

  if (status === 'DELIVERED') {
    const h = Math.floor((now - deliverAt) / 3600000);
    return h > 0 ? `Arrived ${h}h ago · ${timeStr}` : `Just arrived · ${timeStr}`;
  }
  
  const diff = deliverAt - now;
  if (diff <= 0) return 'Arriving soon';
  
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const countdown = h > 0 ? `${h}h ${m}m` : `${m}m`;
  
  return `ETA: ${countdown} · Arrives ${dateStr}, ${timeStr}`;
}

// ─── Sidebar ─────────────────────────────────────────────────────────
function Sidebar({ active, onNavigate, onLogout, onCompose }) {
  const items = [
    { key: 'inbox',       label: 'Inbox',      Icon: IconInbox   },
    { key: 'sent',        label: 'Sent',        Icon: IconSent    },
    { key: 'transit',     label: 'In Transit',  Icon: IconTransit },
    { key: 'explore',     label: 'Explore',     Icon: IconExplore },
    { key: 'suggestions', label: 'AI Matches',  Icon: IconPen     },
    { key: 'profile',     label: 'Profile',     Icon: IconProfile },
    { key: 'settings',    label: 'Settings',    Icon: IconSettings },
  ];
  return (
    <aside className="flex flex-col w-56 min-h-screen border-r border-outline-variant/40 px-3 py-6 flex-shrink-0" style={{ backgroundColor: '#f0ebe0' }}>
      <div className="px-3 mb-8 flex justify-between items-center">
        <div>
          <p className="font-serif italic text-primary text-xl font-bold">Khitab</p>
          <p className="font-sans text-[9px] text-on-surface-variant uppercase tracking-widest mt-0.5 opacity-60">The Desk</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1 flex-1">
        {items.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => onNavigate(key)} className={`nav-link ${active === key ? 'active' : ''}`}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-8 px-1 flex flex-col gap-2">
        <button onClick={onCompose} className="btn-primary w-full flex items-center gap-2 justify-center text-sm">
          <IconPen />Write a Letter
        </button>
        <button onClick={onLogout} className="nav-link w-full justify-center gap-2 text-xs mt-1 text-on-surface-variant">
          <IconLogout />Sign Out
        </button>
      </div>
    </aside>
  );
}

// ─── Envelope card ────────────────────────────────────────────────────
function EnvelopeCard({ letter, onClick }) {
  const isDelivered = letter.status === 'DELIVERED';
  const initial = (letter.senderPenName || 'A')[0].toUpperCase();
  return (
    <button
      onClick={() => isDelivered && onClick(letter)}
      className={`envelope-card text-left w-full ${!isDelivered ? 'opacity-60 cursor-default' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="font-serif text-primary font-semibold">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <p className="font-serif text-sm font-semibold text-on-surface truncate">{letter.senderPenName}</p>
            <span className={isDelivered ? 'pill-delivered' : 'pill-transit'}>
              {isDelivered ? 'Delivered' : 'In Transit'}
            </span>
          </div>
          {letter.senderLocation && (
            <p className="font-sans text-xs text-on-surface-variant/60 mb-0.5">{letter.senderLocation}</p>
          )}
          <p className="font-sans text-xs text-on-surface-variant truncate">
            {isDelivered ? (letter.content?.slice(0, 70) + '…') : 'Your letter is traveling across the network…'}
          </p>
          <p className="font-sans text-xs text-on-surface-variant/50 mt-1">{formatDelivery(letter.deliverAt, letter.status)}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Reading Modal ────────────────────────────────────────────────────
function LetterModal({ letter, onClose }) {
  if (!letter) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn" onClick={onClose}>
      <div className="max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()} style={{ backgroundColor: '#faf6ee' }}>
        <div className="px-8 pt-8 pb-4 border-b border-outline-variant/30">
          <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest mb-1">From</p>
          <p className="font-serif text-lg font-semibold text-on-surface">{letter.senderPenName}</p>
          {letter.senderLocation && <p className="font-sans text-xs text-on-surface-variant">{letter.senderLocation}</p>}
        </div>
        <div className="paper-texture px-8 py-6">
          <p className="font-serif text-sm leading-loose text-on-surface whitespace-pre-wrap">{letter.content}</p>
        </div>
        <div className="border-t border-outline-variant/30 px-8 py-4 flex justify-between items-center" style={{ backgroundColor: '#f5f0e8' }}>
          <p className="font-sans text-xs text-on-surface-variant">{formatDelivery(letter.deliverAt, letter.status)}</p>
          <button onClick={onClose} className="btn-ghost text-sm">Close Letter</button>
        </div>
      </div>
    </div>
  );
}

// ─── World Map Widget ─────────────────────────────────────────────────
function MapWidget({ inTransitCount }) {
  return (
    <div className="rounded-xl overflow-hidden border border-outline-variant/40" style={{ backgroundColor: '#e8e3d8' }}>
      <div className="px-4 py-3 border-b border-outline-variant/30">
        <p className="font-serif text-sm font-semibold text-on-surface">The Global Desk</p>
        <p className="font-sans text-xs text-on-surface-variant">Correspondence Pathways</p>
      </div>
      <div className="p-3">
        <svg viewBox="0 0 400 220" className="w-full rounded-lg" style={{ backgroundColor: '#d6d0c4' }}>
          <ellipse cx="80" cy="100" rx="55" ry="70" fill="#b8b2a4" opacity="0.7"/>
          <ellipse cx="180" cy="80" rx="70" ry="55" fill="#b8b2a4" opacity="0.7"/>
          <ellipse cx="260" cy="95" rx="40" ry="50" fill="#b8b2a4" opacity="0.7"/>
          <ellipse cx="330" cy="110" rx="50" ry="40" fill="#b8b2a4" opacity="0.7"/>
          <ellipse cx="365" cy="140" rx="25" ry="35" fill="#b8b2a4" opacity="0.7"/>
          <circle cx="85" cy="85" r="4" fill="#324e58"/>
          <circle cx="265" cy="90" r="4" fill="#324e58"/>
          <circle cx="185" cy="75" r="3" fill="#75584d"/>
          <circle cx="335" cy="105" r="3" fill="#75584d"/>
          <line x1="85" y1="85" x2="265" y2="90" stroke="#324e58" strokeWidth="1" strokeDasharray="4,3" opacity="0.5"/>
          <line x1="185" y1="75" x2="335" y2="105" stroke="#75584d" strokeWidth="1" strokeDasharray="4,3" opacity="0.4"/>
        </svg>
      </div>
      <div className="px-4 py-3 flex justify-between text-xs font-sans border-t border-outline-variant/30">
        <div>
          <p className="text-on-surface-variant uppercase tracking-wide mb-0.5">Avg Delivery</p>
          <p className="font-medium text-on-surface">4–23 hrs</p>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant uppercase tracking-wide mb-0.5">Active Routes</p>
          <p className="font-medium text-on-surface">{inTransitCount} paths</p>
        </div>
      </div>
    </div>
  );
}

// ─── New Users Widget ───────────────────────────────────────────────
function NewUsersWidget({ users, onWrite }) {
  const displayUsers = users?.slice(0, 3) || [];

  return (
    <div className="mt-4 rounded-xl overflow-hidden border border-outline-variant/40" style={{ backgroundColor: '#ede8dc' }}>
      <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface-container-low/30">
        <p className="font-serif text-sm font-semibold text-on-surface">New Pen Pals</p>
        <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest">Recently Joined</p>
      </div>
      <div className="p-3 space-y-3">
        {displayUsers.length > 0 ? displayUsers.map((user, i) => (
          <div key={user.uid || i} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-serif text-primary">
              {user.penName?.[0] || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-serif text-xs font-medium text-on-surface truncate">{user.penName}</p>
              <p className="font-sans text-[10px] text-on-surface-variant truncate">{user.city}, {user.country}</p>
            </div>
            <button 
              onClick={() => onWrite(user)}
              className="text-primary hover:text-primary-dark transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        )) : (
          <p className="text-[10px] font-serif italic text-on-surface-variant opacity-50 px-2 py-1">Searching for new souls...</p>
        )}
      </div>
    </div>
  );
}

// ─── Section titles ───────────────────────────────────────────────────
const SECTION_TITLES = {
  inbox:       { title: 'Unopened Letters',  sub: 'Patience is the companion of wisdom' },
  sent:        { title: 'Sent Letters',      sub: 'Words you have released into the world' },
  transit:     { title: 'In Transit',        sub: 'Live animated journey of your active letters' },
  explore:     { title: 'Explore Pen Pals',  sub: 'Curated matches based on shared interests' },
  suggestions: { title: 'Distant Souls',     sub: 'Filtered matches based on spiritual frequency' },
  profile:     { title: 'Your Profile',      sub: 'Your correspondence identity' },
  settings:    { title: 'Settings',          sub: 'Refine your Correspondence experience' },
};

import { useQuery } from '@tanstack/react-query';
import { fetchExploreUsersApi } from '../services/letterApi';

// ─── Main Dashboard ───────────────────────────────────────────────────
export function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { inTransit: realTransit, delivered: realDelivered, sentItems: realSent, loading, backendAvailable, refresh } = useDashboardViewModel();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedLetter, setSelectedLetter] = useState(null);

  const { data: exploreUsers = [] } = useQuery({
    queryKey: ['exploreUsers', currentUser?.accessToken],
    queryFn: () => fetchExploreUsersApi(currentUser?.accessToken),
    enabled: !!currentUser,
  });

  async function handleLogout() {
    try { await logout(); navigate('/'); } catch {}
  }

  // Merge real letters with demo letters (demo only shown if no real letters)
  const mergedDelivered = realDelivered.length > 0
    ? realDelivered
    : DEMO_LETTERS.filter(l => l.status === 'DELIVERED');
  const mergedTransit = realTransit.length > 0
    ? realTransit
    : DEMO_LETTERS.filter(l => l.status === 'IN_TRANSIT');
  const mergedSent = realSent;

  const displayLetters = activeTab === 'inbox' ? mergedDelivered
    : activeTab === 'transit' ? mergedTransit
    : activeTab === 'sent' ? mergedSent
    : [];

  const section = SECTION_TITLES[activeTab] || SECTION_TITLES.inbox;

  const showLetterList = ['inbox', 'transit', 'sent'].includes(activeTab);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Sidebar */}
      <Sidebar active={activeTab} onNavigate={setActiveTab} onLogout={handleLogout} onCompose={() => navigate('/compose')} />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-outline-variant/40 flex-shrink-0">
          <div>
            <h1 className="font-serif text-xl font-semibold text-on-surface">{section.title}</h1>
            <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest mt-0.5">{section.sub}</p>
          </div>
          <span className="font-sans text-xs text-on-surface-variant hidden md:block">{currentUser?.email}</span>
        </header>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">

          {/* Explore / Profile — full panel */}
          {activeTab === 'explore' && (
            <div className="flex-1 overflow-y-auto">
              <Explore />
            </div>
          )}
          {activeTab === 'suggestions' && (
            <div className="flex-1 overflow-y-auto">
              <Suggestions />
            </div>
          )}
          {activeTab === 'transit' && (
            <div className="flex-1 overflow-y-auto">
              <Tracking />
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="flex-1 overflow-y-auto">
              <Profile />
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto">
              <Settings />
            </div>
          )}

          {/* Letter list panels */}
          {showLetterList && (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                {/* Demo badge — shown when backend isn't connected yet */}
                {!backendAvailable && !loading && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-amber-600 text-xs font-sans">✦ Demo letters shown — sign up and write to real correspondents to populate your inbox.</span>
                  </div>
                )}

                {loading ? (
                  <div className="space-y-3">
                    {[0,1,2].map(i => <div key={i} className="h-20 rounded-xl skeleton"/>)}
                  </div>
                ) : displayLetters.length === 0 && activeTab === 'sent' ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="font-serif italic text-xl text-on-surface-variant mb-2">No letters sent yet.</p>
                    <p className="font-sans text-sm text-on-surface-variant max-w-xs">Click "Write a Letter" to compose your first.</p>
                    <button onClick={() => navigate('/compose')} className="btn-primary mt-4">Write a Letter</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {displayLetters.map(letter => (
                      <EnvelopeCard key={letter.id} letter={letter} onClick={setSelectedLetter} />
                    ))}
                  </div>
                )}
              </div>

              {/* Right widgets */}
              <aside className="w-72 border-l border-outline-variant/40 p-5 overflow-y-auto hidden xl:block flex-shrink-0">
                <MapWidget inTransitCount={mergedTransit.length} />
                
                <NewUsersWidget 
                   users={exploreUsers} 
                   onWrite={(pal) => navigate('/compose', { state: { recipient: pal } })} 
                />

                <div className="mt-4 rounded-xl p-5" style={{ backgroundColor: '#ede8dc' }}>
                  <p className="font-sans text-xs text-on-surface-variant mb-2">✦</p>
                  <p className="font-serif italic text-sm text-on-surface leading-relaxed">
                    "To write is to patiently wait for the soul of another to respond through the distance."
                  </p>
                  <p className="font-sans text-xs text-on-surface-variant mt-2">— The Khitab Manifesto</p>
                </div>
              </aside>
            </>
          )}
        </div>
      </main>

      <LetterModal letter={selectedLetter} onClose={() => setSelectedLetter(null)} />
    </div>
  );
}
