import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { profileData, currentUser } = useAuth();
  const navigate = useNavigate();

  // Fallback data for the Elias Thorne aesthetic until user fills their own
  const data = profileData || {
    penName: 'Elias Thorne',
    bio: 'I find that thoughts clarify only when the nib meets the paper. There is a specific kind of silence in a handwritten letter that no digital message can ever replicate.',
    location: 'Edinburgh, Scotland',
    fascinations: ['Dark Academia', 'Early Cartography', 'Botanical Illustration', 'Philosophy of Time', 'Lost Cities'],
    dialects: [
      { language: 'English', proficiency: 'Native Speaker' },
      { language: 'French', proficiency: 'Fluent' },
      { language: 'Latin', proficiency: 'Reading Proficiency' },
    ],
    stats: {
      received: 128,
      sent: 42,
      inTransit: 14
    }
  };

  const initial = (data.penName || 'E')[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-8 md:p-16 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        
        {/* Top Header / Profile Intro */}
        <section className="flex flex-col md:flex-row gap-12 items-start mb-20 animate-fadeIn">
          {/* Portrait with Badge */}
          <div className="relative flex-shrink-0">
             <div className="w-64 h-80 bg-surface-container-high rounded-sm shadow-xl overflow-hidden border-4 border-white transform -rotate-1 group hover:rotate-0 transition-transform">
                {/* Visual placeholder for user photo */}
                <div className="w-full h-full bg-[#ede8dc] flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                   <span className="font-serif text-8xl text-primary/10 select-none">{initial}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
             </div>
             {/* Fountain Pen Badge */}
             <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#75584d] rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white transform rotate-12">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
                </svg>
             </div>
          </div>

          <div className="flex-1 min-w-0 pt-4">
             <h1 className="font-serif text-[4.5rem] md:text-[5.5rem] font-bold text-primary leading-none tracking-tighter mb-4">{data.penName}</h1>
             <div className="flex items-center gap-2 text-on-surface-variant font-sans text-xs uppercase tracking-widest mb-10 opacity-60">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {data.location || 'Kindred Spirit'}
             </div>

             <blockquote className="relative p-8 bg-white/40 border border-outline-variant/10 rounded-sm italic shadow-sm group">
                <span className="absolute -top-4 left-4 font-serif text-6xl text-primary/10 group-hover:text-primary/20 transition-colors">“</span>
                <p className="font-serif text-xl md:text-2xl text-on-surface leading-normal relative z-10">
                   {data.bio || 'Silence is the companion of wisdom.'}
                </p>
                <p className="text-right font-sans text-[10px] uppercase tracking-widest mt-6 opacity-30">— {data.penName?.split(' ').map(n=>n[0]).join('.') || 'K.S.'}</p>
             </blockquote>

             <div className="flex items-center gap-12 mt-12 pl-2">
                <div>
                   <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Joined</p>
                   <p className="font-serif text-sm font-bold text-on-surface">{data.joinedAt ? new Date(data.joinedAt).toLocaleDateString([], { month: 'long', year: 'numeric' }) : 'Autumn 2022'}</p>
                </div>
                <div>
                   <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant opacity-40 mb-1">Last Seen</p>
                   <p className="font-serif text-sm font-bold text-on-surface">London, UK</p>
                </div>
             </div>
          </div>
        </section>

        {/* Lower Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           
           {/* Left: Fascinations & Dialects */}
           <div className="lg:col-span-7 space-y-12">
              <section className="bg-white/40 p-10 border border-outline-variant/10 rounded-sm">
                 <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 mb-8 pb-2 border-b border-primary/10">Fascinations</h3>
                 <div className="flex flex-wrap gap-3">
                    {(data.fascinations || []).map(tag => (
                       <span key={tag} className="px-4 py-2 bg-[#ede8dc] text-on-surface text-xs font-serif rounded-sm border border-outline-variant/10 hover:shadow-sm hover:translate-y-[-1px] transition-all cursor-default">
                          {tag}
                       </span>
                    ))}
                 </div>
              </section>

              <section className="bg-white/40 p-10 border border-outline-variant/10 rounded-sm">
                 <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 mb-8 pb-2 border-b border-primary/10">Dialects</h3>
                 <div className="space-y-6">
                    {(data.dialects || []).map(d => (
                       <div key={d.language} className="flex justify-between items-end border-b border-outline-variant/5 pb-2">
                          <p className="font-serif text-lg italic text-on-surface">{d.language}</p>
                          <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">{d.proficiency}</p>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Right: Philately Collection (Stats) */}
           <div className="lg:col-span-5">
              <div className="bg-[#ede8dc]/80 p-10 border border-outline-variant/20 rounded-sm h-full flex flex-col items-center">
                 <h3 className="font-sans text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 mb-12 self-start">The Philately Collection</h3>
                 
                 {/* Visual Cards Overlap */}
                 <div className="relative w-full h-48 mb-16 select-none">
                    <div className="absolute top-0 left-1/2 -translate-x-[40%] w-32 h-40 bg-rose-50 shadow-md transform -rotate-12 border border-outline-variant/10 flex items-center justify-center">
                       <div className="text-primary/20 scale-150 rotate-12">🌍</div>
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-[60%] w-32 h-40 bg-white shadow-lg border border-outline-variant/10 flex flex-col items-center justify-center p-4">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-primary mb-2 opacity-60">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                       </svg>
                       <p className="font-serif text-lg font-bold text-primary">{data.stats?.sent || 0}</p>
                       <p className="font-sans text-[8px] uppercase tracking-[0.2em] opacity-40">Sent</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/80 p-6 text-center border border-outline-variant/10 shadow-sm rounded-sm">
                       <p className="font-serif text-3xl font-bold text-on-surface tracking-tighter">{data.stats?.received || 0}</p>
                       <p className="font-sans text-[9px] uppercase tracking-widest opacity-40 mt-1">Received</p>
                    </div>
                    <div className="bg-white/80 p-6 text-center border border-outline-variant/10 shadow-sm rounded-sm">
                       <p className="font-serif text-3xl font-bold text-on-surface tracking-tighter">{data.stats?.inTransit || 0}</p>
                       <p className="font-sans text-[9px] uppercase tracking-widest opacity-40 mt-1">In Transit</p>
                    </div>
                 </div>

                 <div className="mt-12 w-full">
                    <button 
                      onClick={() => navigate('/compose', { state: { recipient: data } })}
                      className="w-full bg-[#324e58] text-white py-5 rounded-sm font-sans text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary transition-colors shadow-paper"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                      Write a Letter to {data.penName?.split(' ')[0]}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-20 border-t border-outline-variant/20 text-center pb-12">
           <p className="font-serif italic text-primary text-xl font-bold mb-3 tracking-tighter">Khitab</p>
           <div className="flex justify-center gap-8 mb-8 text-on-surface-variant opacity-40 font-sans text-[9px] uppercase tracking-[0.2em]">
              <a href="#">The Manifesto</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Our Story</a>
           </div>
           <p className="font-sans text-[8px] uppercase tracking-widest text-on-surface-variant/30">© 2024 KHITAB. CRAFTED FOR SLOW THOUGHTS.</p>
        </footer>
      </div>
    </div>
  );
}
