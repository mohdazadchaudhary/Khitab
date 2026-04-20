import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchExploreUsersApi } from '../services/letterApi';
import { BaseMap } from '../components/BaseMap';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const AVATARS_BG = ['bg-primary/10', 'bg-secondary/10', 'bg-amber-100', 'bg-teal-50', 'bg-rose-50', 'bg-indigo-50'];

export function Explore() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('curated');

  // Fetch users from backend
  const { data: remotePals = [], isLoading } = useQuery({
    queryKey: ['exploreUsers', currentUser?.accessToken],
    queryFn: () => fetchExploreUsersApi(currentUser?.accessToken),
    enabled: !!currentUser,
  });

  // Fallback to static data if backend is empty (for demo)
  const PEN_PALS = remotePals.length > 0 ? remotePals : [
    { uid: 'pp1', penName: 'Julian Thorne', city: 'Edinburgh', country: 'United Kingdom', latitude: 55.9533, longitude: -3.1883, bio: 'Philosopher, occasional hillwalker, and collector of obscure maps.', interests: ['Philosophy', 'Travel'] },
    { uid: 'pp2', penName: 'Elena Rossi', city: 'Florence', country: 'Italy', latitude: 43.7696, longitude: 11.2558, bio: 'Art historian by day, amateur pasta maker by night.', interests: ['Art', 'History'] },
    { uid: 'pp3', penName: 'Marcus Vane', city: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681, bio: 'Quiet observer of seasons and ceremonies.', interests: ['Nature', 'Poetry'] },
  ];

  const filteredPals = PEN_PALS.filter(pal => 
    pal.penName?.toLowerCase().includes(search.toLowerCase()) ||
    pal.interests?.some(i => i.toLowerCase().includes(search.toLowerCase())) ||
    pal.country?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-full">
      
      {/* --- INTERACTIVE EXPLORE MAP --- */}
      <div className="relative h-96 w-full overflow-hidden border-b border-outline-variant/30 flex-shrink-0">
        <BaseMap center={[20, 0]} zoom={2}>
          {filteredPals.map(pal => (
            <Marker key={pal.uid} position={[pal.latitude, pal.longitude]}>
              <Popup>
                <div className="p-2">
                  <p className="font-serif font-bold text-sm mb-1">{pal.penName}</p>
                  <p className="font-sans text-[10px] text-gray-500 uppercase">{pal.city}, {pal.country}</p>
                  <button 
                    onClick={() => navigate('/compose', { state: { recipient: pal } })}
                    className="mt-2 text-[10px] font-bold text-primary uppercase"
                  >
                    Write Letter
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </BaseMap>
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-paper">
           <h2 className="font-serif text-lg font-bold text-on-surface tracking-tight">Kindred Spirits Found Globally</h2>
        </div>
      </div>

      {/* --- CONTROLS & SEARCH --- */}
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/40 p-6 rounded-sm border border-outline-variant/10 shadow-sm">
          <div className="flex-1">
            <p className="font-sans text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Search the Desk</p>
            <div className="relative group max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input 
                type="text"
                placeholder="Find names, interests, or locations..."
                className="w-full bg-transparent border-b border-outline-variant py-2 pl-10 pr-4 text-sm font-sans focus:outline-none focus:border-primary transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isLoading ? (
             <div className="col-span-full py-20 text-center font-serif italic text-on-surface-variant opacity-40">Consulting the archives...</div>
          ) : filteredPals.length > 0 ? (
            filteredPals.map((pal, i) => (
              <div key={pal.uid} className="bg-white shadow-paper rounded-sm p-8 border border-outline-variant/10 hover:-translate-y-1 transition-all group">
                 <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-sm ${AVATARS_BG[i % AVATARS_BG.length]} flex items-center justify-center flex-shrink-0`}>
                      <span className="font-serif text-2xl text-primary font-bold italic">{pal.penName?.[0]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-serif text-xl font-bold text-on-surface leading-snug">{pal.penName}</p>
                      <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-[0.2em] mb-4">{pal.city}, {pal.country}</p>
                      <p className="font-serif text-sm italic mb-6 opacity-70">"{pal.bio || 'Silence is a bridge.'}"</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(pal.interests || []).map(tag => (
                          <span key={tag} className="font-sans text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm bg-[#f5f0e8]">{tag}</span>
                        ))}
                      </div>
                      <button
                         onClick={() => navigate('/compose', { state: { recipient: pal } })}
                         className="font-sans text-[10px] uppercase tracking-[0.3em] font-bold text-primary border-b border-primary/20 pb-1"
                       >
                         Write Correspondence →
                       </button>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="font-serif italic text-3xl text-on-surface-variant/30">No souls found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
