import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, Phone, Star } from 'lucide-react';

const Squiggle = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 20" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M2 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 98 10" />
  </svg>
);

export default function Reservation() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-rose-surface relative flex items-center justify-center pt-32 pb-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gold/10 rounded-full blur-[100px]" />
      </div>

      <Section className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-start"
          >
            <div className="inline-block relative mb-6">
              <h2 className="text-5xl md:text-7xl font-serif text-espresso relative z-10">
                {t('reserve.title')}
              </h2>
              <Squiggle className="w-32 h-6 text-rose-dark/40 absolute -bottom-2 right-0" />
            </div>
            
            <p className="text-xl text-espresso/70 mb-12 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
              {t('reserve.subtitle') || "Reserve your spot for an unforgettable experience. Good vibes, great coffee, and even better company."}
            </p>

            <div className="hidden lg:flex flex-col gap-6">
              <div className="flex items-center gap-4 text-espresso/80">
                <div className="p-3 bg-white rounded-full shadow-sm text-rose-dark">
                  <Star size={24} fill="currentColor" className="text-rose-dark/20" />
                </div>
                <span className="font-medium">Premium Service</span>
              </div>
              <div className="flex items-center gap-4 text-espresso/80">
                <div className="p-3 bg-white rounded-full shadow-sm text-rose-dark">
                  <Users size={24} />
                </div>
                <span className="font-medium">Perfect for Gatherings</span>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/50 relative"
          >
            <div className="absolute -top-6 -right-6 bg-rose-blush text-white p-4 rounded-full shadow-lg rotate-12 hidden md:block">
              <Calendar size={32} />
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-espresso/50 font-bold ml-2">{t('reserve.name')}</label>
                  <input 
                    type="text" 
                    className="w-full bg-white border border-rose-100 rounded-2xl px-6 py-4 text-espresso placeholder-espresso/30 focus:outline-none focus:border-rose-dark focus:ring-2 focus:ring-rose-dark/10 transition-all duration-300"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-espresso/50 font-bold ml-2">{t('reserve.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/30" size={18} />
                    <input 
                      type="tel" 
                      className="w-full bg-white border border-rose-100 rounded-2xl pl-12 pr-6 py-4 text-espresso placeholder-espresso/30 focus:outline-none focus:border-rose-dark focus:ring-2 focus:ring-rose-dark/10 transition-all duration-300"
                      placeholder="010xxxxxxx"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-espresso/50 font-bold ml-2">{t('reserve.date')}</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/30" size={18} />
                    <input 
                      type="date" 
                      className="w-full bg-white border border-rose-100 rounded-2xl pl-12 pr-6 py-4 text-espresso focus:outline-none focus:border-rose-dark focus:ring-2 focus:ring-rose-dark/10 transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-espresso/50 font-bold ml-2">{t('reserve.time')}</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso/30" size={18} />
                    <input 
                      type="time" 
                      className="w-full bg-white border border-rose-100 rounded-2xl pl-12 pr-6 py-4 text-espresso focus:outline-none focus:border-rose-dark focus:ring-2 focus:ring-rose-dark/10 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-espresso/50 font-bold ml-2">{t('reserve.guests')}</label>
                <div className="grid grid-cols-4 gap-4">
                  {[2, 3, 4, '5+'].map((num) => (
                    <label key={num} className="cursor-pointer">
                      <input type="radio" name="guests" className="peer hidden" />
                      <div className="w-full py-4 rounded-2xl border border-rose-100 bg-white text-center text-espresso font-bold peer-checked:bg-rose-dark peer-checked:text-white peer-checked:border-rose-dark transition-all duration-300 hover:border-rose-dark/50">
                        {num}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="button"
                  className="w-full bg-espresso text-white font-bold tracking-widest uppercase py-5 rounded-2xl hover:bg-rose-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl text-lg"
                >
                  {t('reserve.submit')}
                </button>
              </div>
              
              <div className="text-center pt-2">
                <p className="text-espresso/40 text-sm">
                  {t('reserve.whatsapp') || "Or book via WhatsApp"}
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
