import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useComposeViewModel } from '../viewmodels/useComposeViewModel';

// Icons
const IconBack = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const IconQuill = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
    <line x1="16" y1="8" x2="2" y2="22" />
    <line x1="17.5" x2="19" y1="15" y2="16.5" />
  </svg>
);

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export function Compose() {
  const navigate = useNavigate();
  const { 
    content, setContent, 
    loading, success, error, 
    submit,
    selectedRecipient, setSelectedRecipient,
    searchQuery, setSearchQuery,
    searchResults, recentPals,
    isSearching
  } = useComposeViewModel();

  const [showSeal, setShowSeal] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSeal(true);
      const timer = setTimeout(() => navigate('/dashboard'), 4000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (success && showSeal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 animate-fadeIn" style={{ backgroundColor: '#f5f0e8' }}>
        <div className="wax-seal animate-seal mb-10">
          <span className="font-serif text-white text-xl font-bold italic">K</span>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-on-surface mb-4">Sealed & Sent</h1>
        <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed mb-6">
          Your letter has entered the delivery engine. It is traveling across the digital distance to its destination.
        </p>
        <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest animate-pulse">Returning to Desk...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f0e8' }}>
      {/* Top Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-outline-variant/30 sticky top-0 bg-[#f5f0e8]/80 backdrop-blur-md z-10">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 font-sans text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <IconBack /> Drop Pen
        </button>
        <div className="flex flex-col items-center">
          <p className="font-serif italic text-primary text-lg font-semibold">Khitab</p>
          <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-[0.2em] -mt-1">The Scriptorium</p>
        </div>
        <button
          onClick={submit}
          disabled={loading || !content.trim() || !selectedRecipient}
          className="btn-primary flex items-center gap-2 text-sm px-6"
        >
          {loading ? 'Sealing...' : 'Seal Envelope'}
        </button>
      </header>

      {/* Main Drafting Area */}
      <main className="flex-1 flex justify-center py-12 px-6 overflow-y-auto">
        <div className="max-w-3xl w-full flex flex-col">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-sans flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => window.location.reload()} className="underline">Retry</button>
            </div>
          )}

          {/* Letter Sheet */}
          <div className="paper-texture shadow-paper rounded-sm min-h-[70vh] flex flex-col relative">
            {/* Stationery Lines */}
            <div className="absolute inset-0 stationery-lines opacity-40 pointer-events-none" />
            
            {/* Letterhead */}
            <div className="px-12 pt-12 pb-6 flex justify-between items-start z-[5]">
              <div className="flex-1">
                <IconQuill />
                
                <div className="mt-8 relative max-w-md">
                  <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">To</p>
                  
                  {selectedRecipient ? (
                    <div className="flex items-center gap-3 animate-fadeIn">
                       <p className="font-serif italic text-2xl text-on-surface">To: {selectedRecipient.penName}</p>
                       <button 
                         onClick={() => setSelectedRecipient(null)}
                         className="p-1 rounded-full hover:bg-on-surface/5 text-on-surface-variant"
                         title="Change recipient"
                       >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                       </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center border-b border-on-surface/20 pb-1 group focus-within:border-primary transition-colors">
                        <span className="font-serif italic text-2xl text-on-surface/30 pr-2">To:</span>
                        <input 
                          type="text"
                          autoFocus
                          placeholder="Search pen pals..."
                          className="flex-1 bg-transparent border-none outline-none font-serif italic text-2xl text-on-surface placeholder:text-on-surface-variant/20"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {isSearching && (
                           <div className="animate-spin text-primary opacity-50">
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
                           </div>
                        )}
                      </div>

                      {/* Dropdown Results */}
                      {(searchQuery || recentPals.length > 0) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-paper border border-outline-variant/20 rounded-md overflow-hidden z-20 animate-slideDown">
                          {searchQuery && searchResults.length > 0 && (
                            <div className="p-2">
                               <p className="px-3 py-1 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/50">Search Results</p>
                               {searchResults.map(pal => (
                                 <button
                                   key={pal.uid}
                                   onClick={() => { setSelectedRecipient(pal); setSearchQuery(''); }}
                                   className="w-full text-left px-3 py-2 hover:bg-primary/5 rounded flex items-center gap-3 transition-colors"
                                 >
                                   <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-serif font-bold text-primary">{pal.penName?.[0]}</div>
                                   <div>
                                     <p className="font-serif text-sm text-on-surface font-medium">{pal.penName}</p>
                                     <p className="font-sans text-[10px] text-on-surface-variant">{pal.city}, {pal.country}</p>
                                   </div>
                                 </button>
                               ))}
                            </div>
                          )}

                          {!searchQuery && recentPals.length > 0 && (
                             <div className="p-2 border-t border-outline-variant/10">
                               <p className="px-3 py-1 font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/50">Recent Pen Pals</p>
                               {recentPals.map(pal => (
                                 <button
                                   key={pal.uid}
                                   onClick={() => { setSelectedRecipient(pal); setSearchQuery(''); }}
                                   className="w-full text-left px-3 py-2 hover:bg-primary/5 rounded flex items-center gap-3 transition-colors"
                                 >
                                   <div className="w-6 h-6 rounded bg-secondary/10 flex items-center justify-center text-[10px] font-serif font-bold text-secondary">{pal.penName?.[0]}</div>
                                   <div>
                                     <p className="font-serif text-sm text-on-surface font-medium">{pal.penName}</p>
                                     <p className="font-sans text-[10px] text-on-surface-variant">{pal.city}, {pal.country}</p>
                                   </div>
                                 </button>
                               ))}
                             </div>
                          )}

                          {searchQuery && searchResults.length === 0 && !isSearching && (
                            <div className="p-8 text-center">
                              <p className="font-serif italic text-sm text-on-surface-variant">No pen pals found by that name.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedRecipient && (
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider mt-1 animate-fadeIn">
                       {selectedRecipient.city}, {selectedRecipient.country}
                    </p>
                  )}
                </div>
              </div>
              <div className="text-right opacity-60">
                <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Date</p>
                <p className="font-serif italic text-xs text-on-surface border-b border-on-surface/20 pb-1 w-32">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Input Area */}
            <textarea
              className="flex-1 w-full bg-transparent border-none outline-none resize-none px-12 pb-12 font-serif text-lg leading-[2.5rem] text-on-surface placeholder:text-on-surface-variant/30 transition-all z-[1]"
              placeholder="Start your correspondence here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              autoFocus={!!selectedRecipient}
            />

            {/* Bottom Signature Decor */}
            <div className="px-12 pb-8 flex justify-end z-[1] opacity-40 pointer-events-none">
              <div className="w-24 h-px bg-on-surface-variant mb-4" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-sans text-xs text-on-surface-variant italic">
              "Words traveling across time require a certain amount of space to breathe."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
