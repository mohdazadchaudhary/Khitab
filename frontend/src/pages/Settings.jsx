import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const { profileData, saveProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  
  // Local form state
  const [formData, setFormData] = useState({
    penName: '',
    bio: '',
    avatarUrl: '',
    city: '',
    country: '',
    fascinationsText: '',
    stationeryEmail: '',
    preferences: {
      slowDelivery: true,
      inkTexture: false
    }
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        penName: profileData.penName || '',
        bio: profileData.bio || '',
        avatarUrl: profileData.avatarUrl || '',
        city: profileData.city || 'Digital Realm',
        country: profileData.country || 'Global',
        fascinationsText: (profileData.interests || profileData.fascinations || []).join(', '),
        stationeryEmail: profileData.stationeryEmail || profileData.email || '',
        preferences: profileData.preferences || { slowDelivery: true, inkTexture: false }
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        ...formData,
        interests: formData.fascinationsText.split(',').map(s => s.trim()).filter(s => s),
      };
      delete updatedData.fascinationsText; // remove UI-only state
      await saveProfile(updatedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e8] selection:bg-primary/20 p-8 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="font-serif text-[3.5rem] font-bold text-on-surface tracking-tighter mb-2">Settings</h1>
        <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed opacity-70">
          Curate your digital sanctuary and refine the pace of your correspondence.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Sidebar Nav */}
        <div className="md:col-span-3 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm font-sans text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-[#ede8dc] text-on-surface font-bold border-l-4 border-primary shadow-sm' 
                : 'text-on-surface-variant hover:bg-[#ede8dc]/50'
              }`}
            >
              <span className="opacity-50">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          
          {/* Decorative Stamp Seal */}
          <div className="mt-12 opacity-20 transform -rotate-12 select-none grayscale">
            <div className="w-20 h-20 border-2 border-primary rounded-lg flex items-center justify-center border-dashed">
               <span className="font-serif text-[10px] text-center font-bold">KHITAB<br/>ARCHIVE<br/>SEAL</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 space-y-12">
          {activeTab === 'account' && (
            <div className="animate-fadeIn">
              {/* Profile Information */}
              <section className="mb-12">
                <h2 className="font-serif text-xl font-bold text-on-surface mb-8 tracking-tight">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="w-20 h-20 rounded-full border-2 border-primary/20 bg-surface flex items-center justify-center overflow-hidden shadow-inner group relative">
                        {formData.avatarUrl ? (
                          <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-serif text-2xl text-primary/30 italic">K</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                           <span className="text-[10px] text-white font-bold tracking-tighter">WAX SEAL</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Avatar / Wax Seal URL</label>
                        <input 
                          type="text" 
                          value={formData.avatarUrl}
                          onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                          className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-2 font-sans text-xs focus:outline-none focus:border-primary transition-all rounded-sm"
                          placeholder="Link to your digital wax seal"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Pen Name</label>
                      <input 
                        type="text" 
                        value={formData.penName}
                        onChange={e => setFormData({...formData, penName: e.target.value})}
                        className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                        placeholder="e.g. Elias Thorne"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Stationery Email</label>
                    <input 
                      type="email" 
                      value={formData.stationeryEmail}
                      onChange={e => setFormData({...formData, stationeryEmail: e.target.value})}
                      className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm opacity-60"
                      placeholder="scribe@khitab.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">City</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                      placeholder="e.g. Edinburgh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Country</label>
                    <input 
                      type="text" 
                      value={formData.country}
                      onChange={e => setFormData({...formData, country: e.target.value})}
                      className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                      placeholder="e.g. Scotland"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Short Biography</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={e => setFormData({...formData, bio: e.target.value})}
                    className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm resize-none"
                    placeholder="Observer of small details. Collector of fountain pens and quiet mornings..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">Fascinations (Comma separated)</label>
                  <input 
                    type="text" 
                    value={formData.fascinationsText}
                    onChange={e => setFormData({...formData, fascinationsText: e.target.value})}
                    className="w-full bg-white border border-outline-variant/10 shadow-sm px-4 py-3 font-sans text-sm focus:outline-none focus:border-primary transition-all rounded-sm"
                    placeholder="e.g. Dark Academia, Early Cartography, Philosophy"
                  />
                </div>
              </section>

              {/* Membership Level (Mockup) */}
              <section className="mb-12">
                <h2 className="font-serif text-xl font-bold text-on-surface mb-8 tracking-tight">Membership Level</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free Desk */}
                  <div className="bg-[#ede8dc]/50 border border-outline-variant/20 p-8 rounded-sm relative">
                    <p className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant mb-4">Active Plan</p>
                    <h3 className="font-serif text-2xl font-bold text-on-surface mb-2">The Free Desk</h3>
                    <p className="font-sans text-xs text-on-surface-variant mb-6 pb-6 border-b border-outline-variant/10">Essential correspondence tools for the casual observer.</p>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-center gap-2 text-[10px] font-sans text-on-surface-variant"><span className="text-primary">✓</span> 3 LETTERS PER MONTH</li>
                       <li className="flex items-center gap-2 text-[10px] font-sans text-on-surface-variant"><span className="text-primary">✓</span> STANDARD VELLUM</li>
                       <li className="flex items-center gap-2 text-on-surface-variant/30 text-[10px] font-sans"><span className="opacity-40">✕</span> CUSTOM WAX SEALS</li>
                    </ul>
                    <button disabled className="w-full py-3 bg-white/40 border border-outline-variant/20 rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest cursor-default text-on-surface-variant">Current Plan</button>
                  </div>

                  {/* Premium Study */}
                  <div className="bg-[#324e58] text-on-primary p-8 rounded-sm shadow-xl relative overflow-hidden group">
                    <div className="absolute top-4 right-4 bg-amber-800 text-[8px] font-bold px-2 py-0.5 rounded-full tracking-widest">HEIRLOOM QUALITY</div>
                    <p className="font-sans text-[9px] uppercase tracking-widest opacity-60 mb-4">Recommended</p>
                    <h3 className="font-serif text-2xl font-bold mb-2 italic">The Premium Study</h3>
                    <p className="font-sans text-xs opacity-70 mb-6 pb-6 border-b border-white/10">Unlimited depth, custom craftsmanship, and archival priority.</p>
                    <ul className="space-y-3 mb-8">
                       <li className="flex items-center gap-2 text-[10px] font-sans"><span className="text-secondary-container">✒</span> UNLIMITED CORRESPONDENCE</li>
                       <li className="flex items-center gap-2 text-[10px] font-sans"><span className="text-secondary-container">🌍</span> CUSTOM DIGITAL STATIONERY</li>
                       <li className="flex items-center gap-2 text-[10px] font-sans"><span className="text-secondary-container">🛡</span> CUSTOM WAX SEAL DESIGNS</li>
                    </ul>
                    <button className="w-full py-3 bg-[#75584d] hover:bg-[#85685d] transition-colors rounded-sm font-sans text-[10px] font-bold uppercase tracking-widest shadow-inner">Upgrade for $12/mo</button>
                  </div>
                </div>
              </section>

              {/* Reading Preferences */}
              <section className="mb-12">
                <h2 className="font-serif text-xl font-bold text-on-surface mb-8 tracking-tight">Reading Preferences</h2>
                <div className="space-y-8">
                  <div className="flex items-center justify-between group">
                    <div>
                      <h4 className="font-serif text-md font-bold text-on-surface mb-1 scale-100 group-hover:scale-[1.01] origin-left transition-transform">Slow Delivery Mode</h4>
                      <p className="font-sans text-xs text-on-surface-variant opacity-70">Hold letters for 24 hours to simulate postal delivery times.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, preferences: {...formData.preferences, slowDelivery: !formData.preferences.slowDelivery}})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.preferences.slowDelivery ? 'bg-[#324e58]' : 'bg-outline-variant/20'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.preferences.slowDelivery ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between group">
                    <div>
                      <h4 className="font-serif text-md font-bold text-on-surface mb-1 scale-100 group-hover:scale-[1.01] origin-left transition-transform">Ink Texture Simulation</h4>
                      <p className="font-sans text-xs text-on-surface-variant opacity-70">Render text with slight irregularities of hand-pressed ink.</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, preferences: {...formData.preferences, inkTexture: !formData.preferences.inkTexture}})}
                      className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.preferences.inkTexture ? 'bg-[#324e58]' : 'bg-outline-variant/20'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.preferences.inkTexture ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex items-center gap-6 pt-12 border-t border-outline-variant/10">
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-on-primary px-10 py-4 rounded-sm font-sans text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Discard Draft
                </button>
                {showSuccess && (
                  <span className="font-sans text-xs font-bold text-primary italic animate-fadeIn">Changes archived successfully.</span>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'account' && (
            <div className="py-20 text-center border border-dashed border-outline-variant/20 rounded-sm">
               <p className="font-serif italic text-on-surface-variant opacity-40">Section "{activeTab}" is coming in a future manuscript.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
