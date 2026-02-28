import { Heart, Instagram, Facebook, Twitter, ChefHat } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-rose-surface text-espresso py-20 border-t border-rose-dark/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4E342E 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Logo */}
          <div className="relative flex flex-col items-center mb-12 group cursor-default">
            <ChefHat size={40} className="text-rose-dark mb-3 opacity-90 group-hover:rotate-12 transition-transform duration-500" strokeWidth={1.5} />
            <h2 className="font-script text-6xl md:text-7xl font-bold tracking-tight text-espresso transform -rotate-3 drop-shadow-sm mb-3 transition-transform duration-500 group-hover:scale-105">
              Despacito<span className="text-rose-dark">.</span>
            </h2>
            <span className="text-sm font-serif font-bold tracking-[0.3em] text-espresso/70 uppercase">
              Patisserie
            </span>
            <span className="text-[0.65rem] font-sans font-medium tracking-widest text-rose-dark/80 uppercase mt-1.5">
              Made with Love
            </span>
          </div>
          
          {/* Navigation Links (Optional, for SEO/Access) */}
          <div className="flex gap-8 mb-10 text-sm font-medium tracking-widest uppercase text-espresso/60">
            <a href="/menu" className="hover:text-rose-dark transition-colors">Menu</a>
            <a href="/vibes" className="hover:text-rose-dark transition-colors">Vibes</a>
            <a href="/contact" className="hover:text-rose-dark transition-colors">Contact</a>
          </div>

          {/* Socials */}
          <div className="flex gap-6 mb-12">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:scale-110 hover:text-rose-dark transition-all duration-300 border border-rose-dark/10">
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-12 h-[2px] bg-rose-dark/20 mb-8 rounded-full"></div>

          {/* Copyright */}
          <p className="font-sans text-espresso/40 text-xs tracking-wider mb-4">
            {t('footer.rights')}
          </p>
          
          {/* Made with Love */}
          <div className="flex items-center gap-2 text-xs text-espresso/30 font-medium tracking-widest uppercase">
            <span>{t('footer.crafted')}</span>
            <Heart size={10} className="text-rose-dark fill-rose-dark animate-pulse" />
          </div>
        </div>
      </div>
    </footer>
  );
}
