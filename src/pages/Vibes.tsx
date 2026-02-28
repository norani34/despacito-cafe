import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Music, Plus, Send, Play, Pause, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';

// Doodle Components
const Squiggle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 20" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M2 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 98 10" />
  </svg>
);

interface Memory {
  id: number;
  user: string;
  text_ar: string;
  text_en: string;
  image?: string;
  color: string;
  rotate: string;
  client_id?: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  added_by?: string;
  client_id?: string;
}

export default function Vibes() {
  const { t, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string>('');

  // Form States
  const [newMemory, setNewMemory] = useState({ user: '', text: '', image: '' });
  const [newSong, setNewSong] = useState({ title: '', artist: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Generate or retrieve Client ID
    let storedClientId = localStorage.getItem('vibes_client_id');
    if (!storedClientId) {
      storedClientId = 'client_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('vibes_client_id', storedClientId);
    }
    setClientId(storedClientId);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [memoriesRes, songsRes] = await Promise.all([
        fetch('/api/memories'),
        fetch('/api/songs')
      ]);
      if (memoriesRes.ok && songsRes.ok) {
        const memoriesData = await memoriesRes.json();
        const songsData = await songsRes.json();
        setMemories(memoriesData);
        setPlaylist(songsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMemory(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitMemory = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const colors = ['bg-yellow-100', 'bg-rose-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];
      const rotates = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-3', '-rotate-3'];
      
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomRotate = rotates[Math.floor(Math.random() * rotates.length)];

      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Client-ID': clientId
        },
        body: JSON.stringify({
          ...newMemory,
          color: randomColor,
          rotate: randomRotate
        })
      });

      if (response.ok) {
        await fetchData();
        setIsMemoryModalOpen(false);
        setNewMemory({ user: '', text: '', image: '' });
      }
    } catch (error) {
      console.error('Error adding memory:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMemory = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذه الذكرى؟' : 'Are you sure you want to delete this memory?')) return;
    
    try {
      const response = await fetch(`/api/memories/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Client-ID': clientId
        }
      });

      if (response.ok) {
        setMemories(prev => prev.filter(m => m.id !== id));
      } else {
        alert('Failed to delete memory');
      }
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  const submitSong = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Client-ID': clientId
        },
        body: JSON.stringify({
          ...newSong,
          added_by: 'Guest'
        })
      });

      if (response.ok) {
        await fetchData();
        setIsSongModalOpen(false);
        setNewSong({ title: '', artist: '' });
      }
    } catch (error) {
      console.error('Error adding song:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSong = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد أنك تريد حذف هذه الأغنية؟' : 'Are you sure you want to delete this song?')) return;

    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Client-ID': clientId
        }
      });

      if (response.ok) {
        setPlaylist(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to delete song');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
    }
  };

  const shareWithFallback = async (title: string, text: string, url: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return true;
      }
    } catch (err) {
      console.warn('Web Share failed:', err);
    }

    // Fallback: copy text + url to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert(language === 'ar' ? 'تم نسخ الرابط إلى الحافظة' : 'Link copied to clipboard');
      return true;
    } catch (err) {
      // Fallback to mailto if clipboard unavailable
      const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n' + url)}`;
      window.location.href = mailto;
      return false;
    }
  };

  const shareMemory = async (m: Memory) => {
    const title = language === 'ar' ? 'ذكرى' : 'Memory';
    const text = language === 'ar' ? `${m.user}: ${m.text_ar}` : `${m.user}: ${m.text_en}`;
    const url = `${window.location.origin}${window.location.pathname}#memory-${m.id}`;
    await shareWithFallback(title, text, url);
  };

  const shareSong = async (s: Song) => {
    const title = language === 'ar' ? 'أغنية' : 'Song';
    const text = `${s.title} — ${s.artist}`;
    const url = `${window.location.origin}${window.location.pathname}#song-${s.id}`;
    await shareWithFallback(title, text, url);
  };

  return (
    <div className="min-h-screen bg-rose-surface pt-48 pb-20 overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20 relative px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative inline-block"
          >
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-8 md:-left-16 text-rose-dark/20"
            >
              <Heart size={48} fill="currentColor" />
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-2 -right-8 md:-right-16 text-rose-dark/20"
            >
              <Music size={56} />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-espresso mb-6 relative z-10 tracking-tighter leading-tight">
              {t('vibes.title')}
            </h1>
            
            <div className="flex justify-center">
              <Squiggle className="w-32 md:w-48 h-6 text-rose-dark/40" />
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl text-espresso/60 mt-8 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {t('vibes.subtitle')}
          </motion.p>
        </div>

        {/* Moments Wall (Glass Cards) */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif text-espresso flex items-center gap-4">
              <Heart className="text-rose-dark fill-rose-dark/20" size={32} />
              {t('vibes.moments')}
            </h2>
            <button 
              onClick={() => setIsMemoryModalOpen(true)}
              className="bg-espresso text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-rose-dark transition-colors shadow-lg text-sm tracking-widest uppercase"
            >
              <Plus size={16} /> {t('vibes.addMoment')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {memories.map((moment, idx) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`glass-card p-6 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group ${moment.rotate} hover:rotate-0 transition-transform duration-300 shadow-md hover:shadow-xl`}
                style={{ minHeight: moment.image ? '24rem' : '20rem' }}
              >
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
                  moment.color === 'bg-yellow-100' ? 'from-yellow-400 to-orange-500' : 
                  moment.color === 'bg-rose-100' ? 'from-rose-400 to-pink-500' : 
                  moment.color === 'bg-blue-100' ? 'from-blue-400 to-cyan-500' : 
                  moment.color === 'bg-purple-100' ? 'from-purple-400 to-indigo-500' :
                  'from-green-400 to-emerald-500'
                }`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <Heart size={20} className="text-rose-dark/40" />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-espresso/40">Memory</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); shareMemory(moment); }}
                          className="text-espresso/60 hover:text-espresso transition-colors p-1"
                          title={language === 'ar' ? 'مشاركة الذكرى' : 'Share Memory'}
                        >
                          <Send size={14} />
                        </button>
                        {moment.client_id === clientId && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteMemory(moment.id); }}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Memory"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                    </div>
                  </div>

                  {moment.image && (
                    <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-white/50 aspect-video">
                      <img src={moment.image} alt="Memory" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <p className="text-lg font-medium text-espresso leading-relaxed font-serif italic flex-grow">
                    "{language === 'ar' ? moment.text_ar : moment.text_en}"
                  </p>
                  
                  <div className="mt-4 border-t border-espresso/5 pt-4">
                    <span className="font-bold text-espresso/60 text-xs uppercase tracking-widest block">
                      - {moment.user}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Placeholder */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsMemoryModalOpen(true)}
              className="border-2 border-dashed border-espresso/20 rounded-[2rem] flex flex-col items-center justify-center p-8 text-espresso/40 hover:text-espresso/60 hover:border-espresso/40 transition-colors h-80"
            >
              <Plus size={48} className="mb-4" />
              <span className="font-medium uppercase tracking-widest text-sm">{t('vibes.addMoment')}</span>
            </motion.button>
          </div>
        </section>

        {/* Community Playlist */}
        <section className="relative">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
            <Music size={200} className="text-rose-dark/5 rotate-12" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative z-10">
            <div>
              <h2 className="text-4xl font-serif text-espresso flex items-center gap-4 mb-2">
                <Music className="text-rose-dark fill-rose-dark/20" size={32} />
                {t('vibes.songs') || 'Community Playlist'}
              </h2>
              <p className="text-espresso/60">{t('vibes.playlistSubtitle') || 'Tunes that match our vibe'}</p>
            </div>
            <button 
              onClick={() => setIsSongModalOpen(true)}
              className="bg-white text-espresso border border-espresso/10 px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-espresso hover:text-white transition-colors shadow-lg text-sm tracking-widest uppercase mt-6 md:mt-0"
            >
              <Plus size={16} /> {t('vibes.suggestSong') || 'Add Song'}
            </button>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-[3rem] p-8 shadow-xl border border-white/50 relative z-10">
            <div className="space-y-2">
              {playlist.map((song, idx) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                    isPlaying === song.id ? 'bg-rose-blush text-white shadow-lg scale-[1.02]' : 'hover:bg-white/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <button
                      onClick={() => setIsPlaying(isPlaying === song.id ? null : song.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isPlaying === song.id ? 'bg-white text-rose-blush' : 'bg-rose-100 text-rose-dark group-hover:bg-rose-dark group-hover:text-white'
                      }`}
                    >
                      {isPlaying === song.id ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <div>
                      <h4 className={`font-bold text-lg ${isPlaying === song.id ? 'text-white' : 'text-espresso'}`}>
                        {song.title}
                      </h4>
                      <p className={`text-sm ${isPlaying === song.id ? 'text-white/80' : 'text-espresso/50'}`}>
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="hidden md:block">
                      <Squiggle className={`w-24 ${isPlaying === song.id ? 'text-white/50' : 'text-rose-dark/20'}`} />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-mono text-sm ${isPlaying === song.id ? 'text-white/80' : 'text-espresso/40'}`}>
                        {song.duration}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); shareSong(song); }}
                        className={`p-2 rounded-full transition-colors ${isPlaying === song.id ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-espresso/60 hover:text-espresso hover:bg-rose-50'}`}
                        title={language === 'ar' ? 'مشاركة الأغنية' : 'Share Song'}
                      >
                        <Send size={16} />
                      </button>
                      {song.client_id === clientId && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteSong(song.id); }}
                          className={`p-2 rounded-full transition-colors ${isPlaying === song.id ? 'text-white/80 hover:text-white hover:bg-white/20' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`}
                          title="Delete Song"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Add Memory Modal */}
      <AnimatePresence>
        {isMemoryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setIsMemoryModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-serif text-espresso mb-6">{language === 'ar' ? 'شارك ذكرياتك' : 'Share a Memory'}</h3>
              
              <form onSubmit={submitMemory} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-espresso/60 mb-2">{language === 'ar' ? 'اسمك' : 'Your Name'}</label>
                  <input 
                    type="text" 
                    required
                    value={newMemory.user}
                    onChange={(e) => setNewMemory({...newMemory, user: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-blush/50"
                    placeholder={language === 'ar' ? 'مثال: أحمد' : 'e.g. Ahmed'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-espresso/60 mb-2">{language === 'ar' ? 'ذكرياتك' : 'Your Memory'}</label>
                  <textarea 
                    required
                    value={newMemory.text}
                    onChange={(e) => setNewMemory({...newMemory, text: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-blush/50 h-32 resize-none"
                    placeholder={language === 'ar' ? 'احكيلنا عن أحلى لحظة ليك هنا...' : 'Tell us about your favorite moment...'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-espresso/60 mb-2">{language === 'ar' ? 'صورة (اختياري)' : 'Add a Photo (Optional)'}</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="memory-image"
                    />
                    <label 
                      htmlFor="memory-image"
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-rose-blush/50 hover:bg-rose-50 transition-colors"
                    >
                      {newMemory.image ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
                          <img src={newMemory.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-bold">Change Image</div>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="text-gray-400 mb-2" size={32} />
                          <span className="text-sm text-gray-500">{language === 'ar' ? 'اضغط لرفع صورة' : 'Click to upload image'}</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-espresso text-white font-bold py-4 rounded-xl hover:bg-rose-dark transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  {language === 'ar' ? 'نشر الذكرى' : 'Share Memory'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Song Modal */}
      <AnimatePresence>
        {isSongModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setIsSongModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-serif text-espresso mb-6">{language === 'ar' ? 'اقترح أغنية' : 'Suggest a Song'}</h3>
              
              <form onSubmit={submitSong} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-espresso/60 mb-2">{language === 'ar' ? 'اسم الأغنية' : 'Song Title'}</label>
                  <input 
                    type="text" 
                    required
                    value={newSong.title}
                    onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-blush/50"
                    placeholder="e.g. Tamally Maak"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-espresso/60 mb-2">{language === 'ar' ? 'اسم الفنان' : 'Artist'}</label>
                  <input 
                    type="text" 
                    required
                    value={newSong.artist}
                    onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-blush/50"
                    placeholder="e.g. Amr Diab"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-espresso text-white font-bold py-4 rounded-xl hover:bg-rose-dark transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Music size={18} />}
                  {language === 'ar' ? 'إضافة للقائمة' : 'Add to Playlist'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
