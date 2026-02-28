import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Star, ChefHat, Coffee, ArrowDown, Sparkles, Music, Zap, Cloud, Sun, Moon, BookOpen, Flame, CloudRain, X } from 'lucide-react';

const moodOptions = [
  { 
    id: 'energetic', 
    icon: <Zap size={24} />, 
    label: { ar: 'نشيط', en: 'Energetic' }, 
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-orange-500/40',
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=2670&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'دبل إسبريسو', en: 'Double Espresso' },
      desc: { ar: 'طاقة مركزة عشان تكمل يومك.', en: 'Pure focused energy to crush your goals.' },
      song: 'Eye of the Tiger'
    }
  },
  { 
    id: 'chill', 
    icon: <Cloud size={24} />, 
    label: { ar: 'رايق', en: 'Chill' }, 
    gradient: 'from-sky-400 to-indigo-500',
    shadow: 'shadow-indigo-500/40',
    img: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7fa69?q=80&w=2670&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'لاتيه بارد', en: 'Iced Latte' },
      desc: { ar: 'هدوء وانتعاش في كل رشفة.', en: 'Smooth, cool, and perfectly balanced.' },
      song: 'Lo-Fi Beats'
    }
  },
  { 
    id: 'happy', 
    icon: <Sun size={24} />, 
    label: { ar: 'مبسوط', en: 'Happy' }, 
    gradient: 'from-yellow-300 to-amber-500',
    shadow: 'shadow-amber-500/40',
    img: 'https://images.unsplash.com/photo-1626803775151-61d756612f97?q=80&w=2670&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'سموذي فراولة', en: 'Strawberry Smoothie' },
      desc: { ar: 'طعم الفرحة في كوباية.', en: 'Sweet, vibrant, and full of life.' },
      song: 'Happy - Pharrell'
    }
  },
  { 
    id: 'romantic', 
    icon: <Heart size={24} />, 
    label: { ar: 'رومانسي', en: 'Romantic' }, 
    gradient: 'from-rose-400 to-pink-600',
    shadow: 'shadow-pink-500/40',
    img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2670&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'مولتن كيك', en: 'Molten Cake' },
      desc: { ar: 'دفا وحب في كل قطمة.', en: 'Warm, gooey chocolate love.' },
      song: 'Perfect - Ed Sheeran'
    }
  },
  { 
    id: 'focused', 
    icon: <BookOpen size={24} />, 
    label: { ar: 'مركز', en: 'Focused' }, 
    gradient: 'from-emerald-400 to-teal-600',
    shadow: 'shadow-teal-500/40',
    img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'V60', en: 'V60 Pour Over' },
      desc: { ar: 'صفاء ذهني وتركيز عالي.', en: 'Clarity and precision in a cup.' },
      song: 'Classical Focus'
    }
  },
  { 
    id: 'angry', 
    icon: <Flame size={24} />, 
    label: { ar: 'متعصب', en: 'Angry' }, 
    gradient: 'from-red-500 to-rose-600',
    shadow: 'shadow-red-500/40',
    img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=2537&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'ليمون بالنعناع', en: 'Lemon Mint' },
      desc: { ar: 'انتعاش يهدى أعصابك.', en: 'Cool, refreshing, and calming.' },
      song: 'Don\'t Worry Be Happy'
    }
  },
  { 
    id: 'sad', 
    icon: <CloudRain size={24} />, 
    label: { ar: 'زعلان', en: 'Sad' }, 
    gradient: 'from-slate-400 to-gray-600',
    shadow: 'shadow-gray-500/40',
    img: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2521&auto=format&fit=crop',
    recommendation: {
      drink: { ar: 'هوت شوكليت', en: 'Hot Chocolate' },
      desc: { ar: 'حضن دافي في كوباية.', en: 'A warm hug in a cup.' },
      song: 'Fix You - Coldplay'
    }
  },
];

const VibeSelector = ({ language, t }: { language: string, t: any }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>('chill');

  const currentMood = moodOptions.find(m => m.id === selectedMood);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Mood Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {moodOptions.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-full transition-all duration-300 border ${
              selectedMood === mood.id 
                ? `bg-gradient-to-r ${mood.gradient} text-white shadow-lg ${mood.shadow} border-transparent` 
                : 'bg-white text-espresso/60 border-espresso/5 hover:border-espresso/20 hover:shadow-md'
            }`}
          >
            {mood.icon}
            <span className="font-bold tracking-wide text-sm uppercase">{mood.label[language as 'ar'|'en']}</span>
          </motion.button>
        ))}
      </div>

      {/* Recommendation Card */}
      <AnimatePresence mode="wait">
        {currentMood && (
          <motion.div
            key={currentMood.id}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Ambient Glow */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentMood.gradient} opacity-20 blur-[100px] -z-10 transform scale-90`}></div>

            <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-4 md:p-6 shadow-2xl border border-white/50 overflow-hidden relative">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedMood(null)}
                className="absolute top-6 right-6 p-2 bg-white/40 hover:bg-white/80 rounded-full text-espresso transition-colors z-20 backdrop-blur-md"
              >
                <X size={24} />
              </button>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                
                {/* Image Side */}
                <motion.div 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative h-64 md:h-96 rounded-[2.5rem] overflow-hidden shadow-lg group"
                >
                  <img 
                    src={currentMood.img} 
                    alt={currentMood.recommendation.drink[language as 'ar'|'en']}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${currentMood.gradient} opacity-20 mix-blend-overlay`}></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg text-espresso">
                    {currentMood.icon}
                  </div>
                </motion.div>

                {/* Content Side */}
                <div className="p-4 md:p-8 text-center md:text-start">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-6 bg-gradient-to-r ${currentMood.gradient} text-white shadow-sm`}>
                      {language === 'ar' ? 'اختيارنا ليك' : 'Perfect Match'}
                    </span>
                    
                    <h3 className="text-4xl md:text-6xl font-serif text-espresso mb-6 leading-tight">
                      {currentMood.recommendation.drink[language as 'ar'|'en']}
                    </h3>
                    
                    <p className="text-xl text-espresso/60 font-light mb-10 leading-relaxed">
                      {currentMood.recommendation.desc[language as 'ar'|'en']}
                    </p>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="flex items-center gap-4 bg-espresso/5 px-6 py-4 rounded-2xl w-full md:w-auto">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${currentMood.gradient} text-white shadow-md`}>
                          <Music size={20} />
                        </div>
                        <div className="text-start">
                          <span className="block text-xs font-bold uppercase text-espresso/40 tracking-wider">Vibe Song</span>
                          <span className="font-serif text-lg text-espresso">{currentMood.recommendation.song}</span>
                        </div>
                      </div>
                      
                      <Link 
                        to="/menu"
                        className="px-8 py-4 bg-espresso text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-rose-dark transition-colors shadow-lg w-full md:w-auto"
                      >
                        {language === 'ar' ? 'اطلب دلوقتي' : 'Order Now'}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const { t, language } = useLanguage();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 10]);
  
  // Smooth scroll progress for parallax
  const springConfig = { stiffness: 50, damping: 20, restDelta: 0.001 };
  const scale = useSpring(useTransform(scrollY, [0, 500], [1, 1.05]), springConfig);

  const moods = [
    { 
      id: 'morning', 
      label: { ar: 'بداية اليوم', en: 'Morning Ritual' }, 
      desc: { ar: 'قهوة وفطار', en: 'Coffee & Breakfast' }, 
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop' 
    },
    { 
      id: 'sweet', 
      label: { ar: 'حاجة حلوة', en: 'Sweet Indulgence' }, 
      desc: { ar: 'حلويات وكيك', en: 'Cakes & Pastries' }, 
      img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=2000&auto=format&fit=crop' 
    },
    { 
      id: 'chill', 
      label: { ar: 'روقان', en: 'Evening Calm' }, 
      desc: { ar: 'مشروبات باردة', en: 'Cold Drinks' }, 
      img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2000&auto=format&fit=crop' 
    },
  ];

  const signatures = [
    { name: { ar: 'مولتن كيك', en: 'Molten Cake' }, price: '90', img: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2670&auto=format&fit=crop' },
    { name: { ar: 'آيس سبانيش', en: 'Iced Spanish' }, price: '75', img: 'https://images.unsplash.com/photo-1579992353560-fd1d929f406f?q=80&w=2574&auto=format&fit=crop' },
    { name: { ar: 'لوتس تشيز كيك', en: 'Lotus Cheesecake' }, price: '85', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2670&auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-rose-surface selection:bg-rose-dark selection:text-white overflow-hidden relative">
      
      {/* Dreamy Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-rose-blush/20 rounded-full blur-[150px] animate-blob mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[-20%] w-[70vw] h-[70vw] bg-gold/10 rounded-full blur-[150px] animate-blob animation-delay-2000 mix-blend-multiply"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] bg-rose-dark/10 rounded-full blur-[150px] animate-blob animation-delay-4000 mix-blend-multiply"></div>
      </div>

      {/* Hero Section - Luxury Modern 2026 */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        
        {/* Full Screen Background Image with Parallax & Scale */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop" 
              alt="Despacito Interior" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Warm Dark Overlay (Cinematic) */}
          <div className="absolute inset-0 bg-espresso/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content Container - Minimal & Powerful */}
        <div className="container mx-auto px-6 relative z-10 text-center pt-48">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-5xl mx-auto"
          >
            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium text-white leading-[1.1] tracking-tight mb-12 drop-shadow-lg">
              Slow Moments.<br />
              <span className="italic font-light text-white/90">Beautiful Coffee.</span>
            </h1>
            
            {/* Clean CTA Structure */}
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <Link
                to="/reservation"
                className="px-10 py-4 bg-white text-espresso rounded-full font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:bg-rose-light hover:scale-105 hover:shadow-lg min-w-[200px]"
              >
                {t('hero.reserve')}
              </Link>
              
              <Link
                to="/menu"
                className="group px-10 py-4 rounded-full border border-white/30 text-white font-medium text-sm tracking-widest uppercase transition-all duration-300 hover:bg-white/10 hover:border-white min-w-[200px] flex items-center justify-center gap-2"
              >
                {t('hero.explore')} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator - Minimal */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-16 bg-white/20 overflow-hidden">
            <div className="w-full h-full bg-white/60 animate-float"></div>
          </div>
        </motion.div>
      </section>

      {/* Curated Moments (Moods) - Horizontal Scroll */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div>
              <span className="text-rose-dark font-bold tracking-[0.3em] uppercase text-xs mb-4 block flex items-center gap-2">
                <span className="w-8 h-[1px] bg-rose-dark"></span> The Experience
              </span>
              <h2 className="text-6xl md:text-7xl font-serif text-espresso leading-none">Curated <br/><span className="italic text-rose-dark">Moments</span></h2>
            </div>
            <p className="text-espresso/60 max-w-sm text-balance font-light text-lg">
              {language === 'ar' ? 'اكتشف لحظات مصممة خصيصاً لمزاجك اليومي.' : 'Immersive experiences designed to elevate your daily ritual.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moods.map((mood, idx) => (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden cursor-pointer shadow-lg"
              >
                <img 
                  src={mood.img} 
                  alt={mood.label[language as 'ar'|'en']}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                <div className="absolute bottom-0 left-0 w-full p-10 text-white">
                  <div className="glass-panel inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 backdrop-blur-md border-white/20 text-white shadow-lg">
                    {mood.desc[language as 'ar'|'en']}
                  </div>
                  <h3 className="text-4xl font-serif mb-2 group-hover:translate-x-2 transition-transform duration-500">{mood.label[language as 'ar'|'en']}</h3>
                  <div className="w-0 group-hover:w-12 h-[1px] bg-white transition-all duration-500 mt-4"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Your Vibe Section - Creative Interactive */}
      <section className="py-32 bg-rose-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-block bg-white px-6 py-2 rounded-full shadow-sm mb-6"
            >
              <span className="text-rose-dark font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                <Sparkles size={14} /> {language === 'ar' ? 'اكتشف مودك' : 'Find Your Vibe'}
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-7xl font-serif text-espresso mb-6">
              {language === 'ar' ? 'حاسس بإيه النهاردة؟' : 'How are you feeling today?'}
            </h2>
            <p className="text-espresso/60 text-lg max-w-xl mx-auto">
              {language === 'ar' ? 'اختار مودك وهنقولك إيه أحسن حاجة تطلبها وتسمعها.' : 'Select your current mood and let us curate the perfect treat and tune for you.'}
            </p>
          </div>

          <VibeSelector language={language} t={t} />
        </div>
      </section>

      {/* Signature Creations - Magazine Layout */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <span className="text-rose-dark font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Menu Highlights</span>
            <h2 className="text-6xl md:text-8xl font-serif text-espresso mb-8">Signature <span className="font-script text-rose-dark">Creations</span></h2>
            <div className="w-[1px] h-24 bg-gradient-to-b from-espresso/20 to-transparent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {signatures.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group text-center"
              >
                <div className="relative aspect-square rounded-full overflow-hidden mb-10 bg-white/30 border border-white/50 shadow-2xl mx-auto w-full max-w-sm group-hover:shadow-[0_30px_60px_-20px_rgba(230,164,180,0.4)] transition-all duration-700">
                  <img 
                    src={item.img} 
                    alt={item.name[language as 'ar'|'en']}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-rose-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="text-3xl font-serif text-espresso mb-3 group-hover:text-rose-dark transition-colors">{item.name[language as 'ar'|'en']}</h3>
                <div className="flex items-center justify-center gap-2 text-espresso/60 font-bold tracking-widest text-sm">
                  <span>{item.price}</span>
                  <span className="text-[10px]">{t('common.currency')}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-24">
            <Link 
              to="/menu" 
              className="inline-flex items-center gap-4 text-espresso font-bold uppercase tracking-[0.2em] text-sm hover:text-rose-dark transition-colors group"
            >
              <span className="border-b border-espresso/20 pb-1 group-hover:border-rose-dark transition-colors">{t('hero.explore')}</span>
              <ArrowRight size={16} className="rtl:rotate-180 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Atmosphere / Vibes - Immersive */}
      <section className="py-32 bg-espresso text-rose-surface relative overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-rose-dark/20 rounded-full blur-[150px] animate-pulse"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-rose-blush font-bold tracking-[0.3em] uppercase text-xs mb-6 block">The Atmosphere</span>
              <h2 className="text-6xl md:text-8xl font-serif mb-10 leading-[0.9]">
                {language === 'ar' ? 'أكثر من مجرد قهوة' : 'More Than Just Coffee.'}
              </h2>
              <p className="text-rose-surface/70 text-xl leading-relaxed mb-12 max-w-md text-balance font-light">
                {language === 'ar' 
                  ? 'مكان مصمم عشان تفصل عن العالم. إضاءة هادية، مزيكا رايقة، وريحة القهوة اللي بتخطفك.' 
                  : 'A sanctuary designed for disconnection. Soft lighting, curated playlists, and the aroma of freshly roasted beans.'}
              </p>
              <Link 
                to="/vibes" 
                className="px-10 py-5 bg-rose-surface text-espresso rounded-full font-bold hover:bg-rose-blush transition-colors inline-block uppercase tracking-widest text-sm"
              >
                {language === 'ar' ? 'شوف الأجواء' : 'View Gallery'}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                style={{ y: y1 }}
                className="space-y-6"
              >
                <img loading="lazy" src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop" className="rounded-[2rem] w-full aspect-[3/4] object-cover opacity-60 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0" />
                <img loading="lazy" src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop" className="rounded-[2rem] w-full aspect-square object-cover opacity-60 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0" />
              </motion.div>
              <motion.div 
                style={{ y: y2 }}
                className="space-y-6 pt-20"
              >
                <img loading="lazy" src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop" className="rounded-[2rem] w-full aspect-square object-cover opacity-60 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0" />
                <img loading="lazy" src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop" className="rounded-[2rem] w-full aspect-[3/4] object-cover opacity-60 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
