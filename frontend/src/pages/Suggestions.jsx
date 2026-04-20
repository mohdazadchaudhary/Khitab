import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchSuggestionsApi } from '../services/letterApi';
import { useNavigate } from 'react-router-dom';

const AVATARS_BG = ['bg-amber-100', 'bg-teal-50', 'bg-rose-50', 'bg-indigo-50'];

export function Suggestions() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['suggestions', currentUser?.accessToken],
    queryFn: () => fetchSuggestionsApi(currentUser?.accessToken),
    enabled: !!currentUser,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto py-16">
      <header className="text-center mb-16">
        <p className="font-sans text-[10px] text-primary uppercase tracking-[0.4em] font-bold mb-3">AI Discovery</p>
        <h1 className="font-serif text-4xl font-bold text-on-surface mb-4">Distant Souls with Shared Echoes</h1>
        <p className="font-serif italic text-on-surface-variant/70 text-lg">"Our algorithms found those who speak the same silent language as you."</p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
           <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
           <p className="font-serif italic">Sifting through the global archives...</p>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-8">
          {suggestions.map((pal, i) => (
            <div key={pal.uid} className="bg-white p-10 rounded-sm shadow-paper border border-outline-variant/10 flex flex-col md:flex-row gap-8 items-start hover:-translate-y-1 transition-all">
              <div className={`w-24 h-24 rounded-sm ${AVATARS_BG[i % AVATARS_BG.length]} flex items-center justify-center flex-shrink-0 animate-fadeIn`}>
                 <span className="font-serif text-4xl text-primary font-bold italic">{pal.penName?.[0]}</span>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-on-surface">{pal.penName}</h2>
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest">{pal.city}, {pal.country}</p>
                  </div>
                  <div className="bg-primary/5 px-4 py-1 rounded-full border border-primary/10">
                    <span className="font-sans text-[10px] font-bold text-primary italic uppercase">Match Found</span>
                  </div>
                </div>

                <p className="font-serif text-base text-on-surface/80 leading-relaxed mb-6 italic">
                  "{pal.bio || "A mystery waiting to be unraveled through the slow dance of ink."}"
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                   {(pal.interests || []).map(tag => (
                     <span key={tag} className="font-sans text-[9px] uppercase tracking-widest px-3 py-1 rounded-sm bg-[#f5f0e8]">{tag}</span>
                   ))}
                </div>

                <button 
                  onClick={() => navigate('/compose', { state: { recipient: pal } })}
                  className="btn-primary w-full md:w-auto"
                >
                  Send a First Impression
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white/30 rounded-lg border-2 border-dashed border-outline-variant/20">
          <p className="font-serif italic text-2xl text-on-surface-variant/40 mb-2">The desk is quiet today.</p>
          <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">Check back tomorrow for fresh souls.</p>
        </div>
      )}
    </div>
  );
}
