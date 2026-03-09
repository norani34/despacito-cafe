import { useState, useEffect } from 'react';
import { Menu as MenuIcon, X, Globe, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.menu'), href: '/menu' },
    { name: t('nav.community'), href: '/vibes' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4' : 'py-6'
      }`}
      dir={dir}
    >
      <div className="container mx-auto px-6 flex justify-center">
        <div className={`
          flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 w-full max-w-5xl
          glass-panel shadow-lg bg-white/90 backdrop-blur-md
        `}>
          
          {/* Logo */}
          <Link to="/" className="relative z-50 group flex-shrink-0 flex flex-col items-center leading-none py-1">
            <div className="relative flex flex-col items-center">
              <ChefHat size={24} className="mb-1 opacity-90 transition-colors duration-300 text-rose-dark" strokeWidth={1.5} />
              <h1 className="font-script text-4xl font-bold tracking-tight transition-colors duration-300 text-espresso transform -rotate-3 drop-shadow-sm">
                Despacito<span className="text-rose-dark">.</span>
              </h1>
              <span className="text-[0.65rem] font-serif font-bold tracking-[0.3em] uppercase mt-1 transition-colors duration-300 text-espresso/70">
                Patisserie
              </span>
              <span className="text-[0.5rem] font-sans font-medium tracking-widest uppercase mt-0.5 transition-colors duration-300 text-rose-dark/80">
                Made with Love
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="relative group py-2"
              >
                <span className={`text-sm font-medium tracking-widest transition-colors duration-300 ${
                  location.pathname === link.href
                    ? 'text-rose-dark'
                    : 'text-espresso/80 group-hover:text-espresso'
                }`}>
                  {link.name}
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-[1px] transform origin-left transition-transform duration-300 bg-rose-dark ${
                  location.pathname === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>
          
          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-bold transition-colors uppercase tracking-widest text-espresso/60 hover:text-espresso"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            <Link
              to="/reservation"
              className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-espresso text-white hover:bg-rose-dark"
            >
              {t('nav.book')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden relative z-50">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-bold text-espresso/60"
            >
              {language === 'ar' ? 'EN' : 'عربي'}
            </button>

            <button
              className="transition-colors duration-300 text-espresso"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-24 left-6 right-6 glass-panel rounded-3xl p-8 flex flex-col items-center space-y-6 lg:hidden z-40"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-serif font-medium tracking-wide hover:text-rose-dark transition-colors ${
                    location.pathname === link.href ? 'text-rose-dark' : 'text-espresso'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/reservation"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center px-8 py-3 bg-espresso text-white rounded-full text-lg shadow-lg font-bold"
              >
                {t('nav.book')}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
