import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.about': { ar: 'حكايتنا', en: 'Our Story' },
  'nav.menu': { ar: 'المنيو', en: 'Menu' },
  'nav.community': { ar: 'مجتمعنا', en: 'Community' },
  'nav.gallery': { ar: 'صورنا', en: 'Gallery' },
  'nav.contact': { ar: 'كلمنا', en: 'Contact Us' },
  'nav.book': { ar: 'احجز الآن', en: 'Book Now' },

  // Hero
  'hero.welcome': { ar: 'أهلاً بيك في عالمنا', en: 'Welcome to our world' },
  'hero.title': { ar: 'مودك.. مسؤوليتنا', en: 'Your Mood.. Our Mission' },
  'hero.subtitle': { ar: 'المكان اللي يفصلك عن دوشة العالم', en: 'The Place That Disconnects You From Noise' },
  'hero.desc': { ar: 'سيب همومك برة وتعالى.. قهوة تظبط الدماغ، وحلو يدوب في القلب، وقعدة ترد الروح في قلب الفيوم.', en: 'Leave your worries outside.. Coffee that hits the spot, sweets that melt the heart, and a vibe that heals the soul in Fayoum.' },
  'hero.explore': { ar: 'يلا نشوف المنيو', en: 'Check the Menu' },
  'hero.reserve': { ar: 'احجز قعدتك', en: 'Book Your Spot' },

  // Home - Soft & Cozy Vibe
  'home.hero.title': { ar: 'ديسباسيتو.. مكانك', en: 'Despacito. Your Space.' },
  'home.hero.subtitle': { ar: 'قهوة معمولة بحب، ومكان معمولة عشانك. افصل عن العالم وعيش اللحظة.', en: 'Coffee made with love, a space made for you. Disconnect and enjoy the moment.' },
  'home.mood.title': { ar: 'مودك إيه؟', en: 'How are you feeling?' },
  'home.mood.subtitle': { ar: 'اختار المود واحنا هنظبطك 😉', en: 'Pick your mood, we\'ll handle the rest 😉' },
  'home.mood.tired': { ar: 'فرهد 😴', en: 'Tired 😴' },
  'home.mood.happy': { ar: 'مبسوط 🤩', en: 'Happy 🤩' },
  'home.mood.sad': { ar: 'زعلان 💔', en: 'Sad 💔' },
  'home.mood.hungry': { ar: 'جعان 😋', en: 'Hungry 😋' },
  
  // Home - Testimonials
  'home.reviews.title': { ar: 'كلام من القلب', en: 'Words from the Heart' },

  // Vibes Page
  'vibes.title': { ar: 'مجتمع ديسباسيتو', en: 'Despacito Community' },
  'vibes.subtitle': { ar: 'ذكرياتكم ومزيكتنا.. روح المكان', en: 'Your memories, our music.. the soul of the place' },
  'vibes.moments': { ar: 'لحظات حلوة', en: 'Sweet Moments' },
  'vibes.addMoment': { ar: 'شاركنا ذكرياتك', en: 'Share a Memory' },
  'vibes.songs': { ar: 'مزيكا المكان', en: 'Our Vibe Playlist' },
  'vibes.suggestSong': { ar: 'اقترح أغنية', en: 'Suggest a Song' },
  
  // Nav
  'common.viewAll': { ar: 'شوف كله', en: 'View All' },
  'common.loading': { ar: 'ثواني والقهوة تجهز...', en: 'Brewing...' },
  'common.currency': { ar: 'ج.م', en: 'EGP' },

  // Footer
  'footer.rights': { ar: '© 2026 ديسباسيتو كافيه. كل الحقوق محفوظة.', en: '© 2026 Despacito Café. All rights reserved.' },
  'footer.crafted': { ar: 'معمول بحب في الفيوم', en: 'Made with love in Fayoum' },

  // Menu Categories
  'menu.hot': { ar: 'مشروبات سخنة', en: 'Hot Drinks' },
  'menu.cold': { ar: 'حاجات ساقعة', en: 'Cold Drinks' },
  'menu.sweets': { ar: 'الحلو عندنا', en: 'Desserts' },
  'menu.bakery': { ar: 'مخبوزات طازة', en: 'Fresh Bakery' },
  
  // Contact
  'contact.title': { ar: 'مستنيينك تنورنا', en: 'Waiting for You' },
  'contact.location': { ar: 'عنواننا', en: 'Location' },
  'contact.phone': { ar: 'تليفوننا', en: 'Phone' },
  'contact.hours': { ar: 'مواعيدنا', en: 'Working Hours' },
  'contact.address': { ar: 'جمال عبد الناصر، الفيوم، مصر', en: 'Gamal Abd El-Nasir, Fayoum, Egypt' },
  'contact.daily': { ar: 'كل يوم: ٨ الصبح – ٢ بالليل', en: 'Daily: 8:00 AM – 2:00 AM' },
  
  // Reservation
  'reserve.title': { ar: 'احجز مكانك', en: 'Reserve Your Spot' },
  'reserve.subtitle': { ar: 'عشان نكون جاهزين لاستقبالك', en: 'So we can be ready for you' },
  'reserve.name': { ar: 'الاسم', en: 'Name' },
  'reserve.phone': { ar: 'رقم الموبايل', en: 'Phone Number' },
  'reserve.date': { ar: 'اليوم', en: 'Date' },
  'reserve.time': { ar: 'الساعة', en: 'Time' },
  'reserve.guests': { ar: 'كام واحد؟', en: 'How many people?' },
  'reserve.submit': { ar: 'أكد الحجز', en: 'Confirm Booking' },
  'reserve.whatsapp': { ar: 'تحب تحجز واتساب أسرع؟', en: 'Want to book via WhatsApp?' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
