import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import mapBg from '../assets/map_bg.png';

// Icons
const IconEnvelope = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconPenTool = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
  </svg>
);

const IconWorld = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen selection:bg-primary/20" style={{ backgroundColor: '#f5f0e8' }}>
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="flex items-center justify-between px-10 py-6 sticky top-0 bg-[#f5f0e8]/80 backdrop-blur-md z-50 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="font-serif italic text-2xl text-primary font-bold tracking-tight">Khitab</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors border-b border-primary/40 pb-0.5">The Desk</a>
          <a href="#" className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Explore</a>
          <a href="#" className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">The Manifesto</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="bg-transparent text-primary p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
          <button onClick={() => navigate('/login')} className="bg-transparent text-primary p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </button>
          <button onClick={() => navigate('/login')} className="bg-transparent text-primary p-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION (Mockup Match) --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-20 pb-40 px-6 overflow-hidden">
        {/* World Map Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 pointer-events-none mix-blend-multiply"
        >
          <img 
            src={mapBg} 
            alt="World MapBackground" 
            className="w-full h-full object-cover grayscale opacity-40"
          />
        </motion.div>

        {/* Floating Letters Decorative */}
        <motion.div 
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 0.4, x: 0, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 -translate-x-full animate-float hidden lg:block"
        >
           <div className="bg-white/80 p-4 shadow-xl rotate-[-12deg] rounded-sm transform scale-75 border border-outline-variant/30">
              <div className="w-12 h-1 pb-1 bg-surface-container mb-2" />
              <div className="w-20 h-1 bg-surface-container" />
           </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif text-[5rem] md:text-[8rem] font-bold text-primary leading-[0.9] tracking-tight mb-8"
          >
            Write. Wait.<br />
            <span className="italic font-normal serif-alt">Wonder.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="font-sans text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed mb-12"
          >
            Rediscover the art of slow correspondence. A sanctuary for thoughts that travel across oceans and time. Experience the anticipation of a return letter crafted just for you.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-primary text-on-primary px-10 py-4 rounded-sm font-sans text-sm font-semibold uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-lg hover:-translate-y-0.5"
            >
              Start Writing
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="px-10 py-4 rounded-sm font-sans text-sm font-semibold uppercase tracking-[0.2em] border border-outline-variant hover:bg-surface-container transition-all"
            >
              Login
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-20"
          >
             <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-[0.5em] animate-pulse">Scroll to unfold</p>
             <div className="w-px h-16 bg-gradient-to-b from-primary/50 to-transparent mx-auto mt-4" />
          </motion.div>
        </div>
      </section>


      {/* --- EDITORIAL GALLERY --- */}
      <section className="max-w-7xl mx-auto px-10 py-32 border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="font-serif text-[3.5rem] font-bold text-on-surface leading-tight mb-4 tracking-tighter">Letters from around the world</h2>
            <p className="font-sans text-sm text-on-surface-variant uppercase tracking-widest opacity-60">Glimpses into distant lives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Card 1 Large */}
          <div className="md:col-span-7 bg-white/50 backdrop-blur-sm p-12 shadow-paper rounded-sm transform hover:-rotate-1 transition-transform group border border-outline-variant/10">
            <div className="flex justify-between items-start mb-8 opacity-40">
              <IconEnvelope />
              <div className="w-10 h-10 rounded-full border border-dashed border-primary flex items-center justify-center text-[10px] font-sans text-primary">STAMP</div>
            </div>
            <p className="font-serif italic text-2xl md:text-3xl text-on-surface leading-relaxed mb-10">
              "The rainfall in Kyoto today smells of old stone and cedar. I thought of you when the first drop hit the temple pond..."
            </p>
            <div className="flex justify-between items-end">
               <div>
                  <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Postmarked</p>
                  <p className="font-serif text-sm font-medium text-on-surface">Kyoto, October 14th</p>
               </div>
               <div className="wax-seal opacity-80 scale-75 transform origin-right">
                  <span className="font-serif text-white text-xs font-bold italic">K</span>
               </div>
            </div>
          </div>

          {/* Card 2 Medium */}
          <div className="md:col-span-5 bg-white/80 p-8 shadow-paper rounded-sm transform hover:rotate-2 transition-transform border border-outline-variant/10">
            <div className="aspect-square bg-[#ede8dc] mb-6 overflow-hidden relative group">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors z-10" />
               <img src="/images/vintage_desert_letter.png" alt="A handwritten letter in the desert" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <p className="font-serif text-lg text-on-surface leading-relaxed mb-8 italic">
              "The high desert air is different here. It demands silence. I am finally learning to listen."
            </p>
            <div className="flex flex-col gap-1">
               <p className="font-serif text-xs text-on-surface">SANTE FE · ARRIVED 2 DAYS AGO</p>
            </div>
          </div>

          {/* Card 3 Small/Wide */}
          <div className="md:col-span-4 bg-[#ede8dc] p-8 shadow-paper rounded-sm transform hover:-rotate-2 transition-transform flex flex-col justify-between border border-outline-variant/10">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-primary/20" />
                  <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-widest">Marseille, France</p>
               </div>
               <div className="bg-white/40 h-24 mb-6 border border-primary/10 flex items-center justify-center italic text-on-surface/30 serif text-xs">
                  A fragment of a sketch
               </div>
            </div>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
              The mist carries the salt today. It reminded me of our last walk by the jetty...
            </p>
          </div>

          {/* Card 4 Medium/Vertical */}
          <div className="md:col-span-8 bg-white/40 p-12 border border-outline-variant/20 flex flex-col md:flex-row gap-12 items-center">
             <div className="w-full md:w-1/2 aspect-[3/4] bg-black/5 overflow-hidden filter opacity-90 group relative">
                <img src="/images/vintage_typewriter.png" alt="A moody photo of a vintage typewriter" className="w-full h-full object-cover transition-transform duration-1000 origin-center scale-100 group-hover:scale-110" />
             </div>
             <div className="w-full md:w-1/2">
                <div className="flex items-center gap-2 mb-4 opacity-50">
                    <IconPenTool />
                    <span className="font-sans text-[10px] uppercase tracking-widest">Drafted on Paper</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-on-surface mb-6">"Time moves differently when you're waiting for a reply."</h3>
                <p className="font-sans text-sm text-on-surface-variant mb-8 leading-loose">
                  A curated collection of letters that traveled across borders to find their way home.
                </p>
                <button className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-primary border-b border-primary/40 pb-1 hover:border-primary transition-all">Read the Thread →</button>
             </div>
          </div>
        </div>
      </section>

      {/* --- READY TO CLEAR DESK --- */}
      <section className="px-10 py-32 text-center bg-[#ede8dc]/50">
         <div className="max-w-2xl mx-auto border border-outline-variant/30 px-10 py-16 bg-white/30 rounded-sm">
            <div className="flex justify-center mb-6">
               <IconPenTool />
            </div>
            <h2 className="font-serif text-4xl font-bold text-on-surface mb-4 tracking-tight">Ready to clear your desk?</h2>
            <p className="font-sans text-on-surface-variant max-w-sm mx-auto mb-10 leading-relaxed">The vellum is waiting. No distractions, just your thoughts.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                  onClick={() => navigate('/signup')} 
                  className="bg-primary text-on-primary px-8 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-[0.2em] shadow-lg"
               >
                  Write a Letter
               </button>
               <button 
                  onClick={() => navigate('/signup')} 
                  className="px-8 py-3 rounded-sm font-sans text-xs font-semibold uppercase tracking-[0.2em] border border-outline-variant hover:bg-white/50"
               >
                  Explore The Desk
               </button>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-10 py-20 bg-[#f5f0e8] border-t border-outline-variant/30 flex flex-col items-center">
         <p className="font-serif italic text-3xl text-primary font-bold mb-4">Khitab</p>
         <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50 mb-12">Crafted for slow thoughts</p>
         
         <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16 text-center">
            {['THE MANIFESTO', 'PRIVACY', 'TERMS', 'OUR STORY'].map(l => (
              <a key={l} className="font-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">{l}</a>
            ))}
         </div>

         <div className="flex items-center gap-8 mb-10 text-on-surface-variant/40">
            <IconWorld />
            <IconEnvelope />
            <IconWorld />
         </div>

         <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/30">© 2024 KHITAB. CRAFTED FOR SLOW THOUGHTS.</p>
      </footer>
    </div>
  );
}
