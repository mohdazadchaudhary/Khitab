import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchInTransitApi } from '../services/letterApi';
import { BaseMap } from '../components/BaseMap';
import { Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

// Icons
const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
);

const IconMapPin = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
);

// Custom Letter Icon for Tracking
const letterIcon = L.divIcon({
  className: 'custom-letter-icon',
  html: '<div class="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shadow-paper border-2 border-white animate-bounce"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 2L2 22"/><path d="M2 2l20 20"/></svg></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export function Tracking() {
  const { currentUser } = useAuth();

  const { data: inTransitLetters = [], isLoading } = useQuery({
    queryKey: ['inTransit', currentUser?.accessToken],
    queryFn: () => fetchInTransitApi(currentUser?.accessToken),
    enabled: !!currentUser,
    refetchInterval: 30000, // Refresh every 30s
  });

  const calculateProgress = (sentAt, deliverAt) => {
    const now = Date.now();
    const total = deliverAt - sentAt;
    const elapsed = now - sentAt;
    return Math.min(Math.max(elapsed / total, 0), 1);
  };

  const getInterpolatedPosition = (lat1, lon1, lat2, lon2, progress) => {
    const lat = lat1 + (lat2 - lat1) * progress;
    const lon = lon1 + (lon2 - lon1) * progress;
    return [lat, lon];
  };

  const formatRemainingTime = (deliverAt) => {
    const diff = deliverAt - Date.now();
    if (diff <= 0) return "Arriving now";
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;
  };

  return (
    <div className="flex flex-col h-full bg-[#fdfaf5]">
      {/* --- MAP SECTION (HORIZONTAL TOP) --- */}
      <section className="w-full h-[450px] border-b border-outline-variant/20 relative flex-shrink-0 z-10">
        <BaseMap center={[20, 10]} zoom={2.5}>
          {inTransitLetters.map(letter => {
            const progress = calculateProgress(letter.sentAt, letter.deliverAt);
            const currentPos = getInterpolatedPosition(
                letter.senderLat, letter.senderLon,
                letter.receiverLat, letter.receiverLon,
                progress
            );

            return (
              <React.Fragment key={letter.id}>
                <Polyline 
                  positions={[
                    [letter.senderLat, letter.senderLon],
                    [letter.receiverLat, letter.receiverLon]
                  ]}
                  pathOptions={{ 
                    color: '#8b2b2b', 
                    weight: 1, 
                    dashArray: '5, 10', 
                    opacity: 0.3 
                  }}
                />
                <Marker position={currentPos} icon={letterIcon}>
                  <Popup>
                    <div className="p-3 w-56">
                      <p className="font-serif font-bold text-base mb-1">In Transit</p>
                      <p className="font-sans text-[10px] text-on-surface-variant uppercase mb-4 tracking-wider">To {letter.receiverName}</p>
                      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-2 shadow-inner">
                        <div 
                          className="bg-primary h-full transition-all duration-1000" 
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-sans font-bold uppercase text-on-surface-variant/60">
                        <span>{Math.round(progress * 100)}%</span>
                        <span>{formatRemainingTime(letter.deliverAt)}</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </BaseMap>
        
        {/* Subtle Map Overlay gradient */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.05)]" />
      </section>

      {/* --- HEADER (NOTICE / STATS - NOW BELOW MAP) --- */}
      <header className="p-8 border-b border-outline-variant/10 bg-white/40 backdrop-blur-md z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <p className="font-sans text-[10px] text-primary uppercase tracking-[0.4em] font-bold mb-2">Live Correspondences</p>
                <h1 className="font-serif text-3xl font-bold text-on-surface">The Ink's Journey</h1>
            </div>
            <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-primary">
                    {inTransitLetters.length} Active {inTransitLetters.length === 1 ? 'Letter' : 'Letters'}
                </span>
            </div>
        </div>
      </header>

      {/* --- LIST SECTION (BOTTOM) --- */}
      <section className="flex-1 overflow-y-auto px-8 py-10">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 py-12">
                <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="font-serif italic text-on-surface-variant opacity-60">Consulting the horizons...</p>
            </div>
        ) : inTransitLetters.length > 0 ? (
            <div className="max-w-6xl mx-auto">
                <h2 className="font-serif text-lg font-semibold text-on-surface mb-8 border-l-4 border-primary pl-4">Voyage Manifest</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {inTransitLetters.map(letter => {
                        const progress = calculateProgress(letter.sentAt, letter.deliverAt);
                        return (
                            <div key={letter.id} className="bg-white p-6 rounded-sm shadow-paper border border-outline-variant/10 group hover:-translate-y-1 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="font-sans text-[9px] text-on-surface-variant uppercase tracking-[0.2em] mb-1">Recipient</p>
                                        <p className="font-serif text-xl font-bold text-on-surface">{letter.receiverName}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                                        <IconQuill />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                                        <IconMapPin />
                                        <span className="truncate">From {letter.senderName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-wider">
                                        <IconClock />
                                        <span>{formatRemainingTime(letter.deliverAt)}</span>
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant/40">Progress</span>
                                        <span className="font-sans text-[10px] uppercase font-bold text-primary">{Math.round(progress * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="bg-primary h-full transition-all duration-1000" 
                                            style={{ width: `${progress * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center max-w-sm mx-auto">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <IconClock />
                </div>
                <h3 className="font-serif text-xl font-semibold text-on-surface mb-3">The Winds are Still</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed opacity-70">
                    No letters are currently crossing the digital horizons. Why not release a word into the world?
                </p>
            </div>
        )}
      </section>
    </div>
  );
}

// Mini Quill Icon for cards
const IconQuill = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
        <line x1="17.5" x2="19" y1="15" y2="16.5" />
    </svg>
);
