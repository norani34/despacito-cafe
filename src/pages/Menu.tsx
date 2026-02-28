import { useState, FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Search, Star, Heart, Moon } from 'lucide-react';

interface MenuItemProps {
  item: any;
  isRamadan: boolean;
  isOriental: boolean;
  language: any;
  t: any;
}

const MenuItem: FC<MenuItemProps> = ({ item, isRamadan, isOriental, language, t }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-[3rem] p-4 flex flex-col sm:flex-row gap-6 group overflow-hidden relative transition-all duration-500 ${
        isRamadan 
          ? 'bg-white/5 border border-white/10 hover:border-gold/40 hover:shadow-[0_10px_40px_rgba(233,196,106,0.15)] backdrop-blur-md' 
          : isOriental
          ? 'bg-[#0B1026]/60 border border-[#FFD700]/30 hover:border-[#FFD700] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] backdrop-blur-md'
          : 'glass-card border-white/60'
      }`}
    >
      {/* Image */}
      <div className="w-full sm:w-48 h-48 rounded-[2.5rem] overflow-hidden shrink-0 relative shadow-md group-hover:shadow-lg transition-all bg-gray-100/50">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${isRamadan ? 'border-gold' : isOriental ? 'border-[#FFD700]' : 'border-rose-blush'}`}></div>
          </div>
        )}
        <motion.img 
          src={item.image} 
          alt={item.name[language as 'ar'|'en']} 
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <button className={`absolute top-3 right-3 w-8 h-8 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
          isRamadan ? 'bg-black/50 text-gold hover:bg-gold hover:text-espresso' 
          : isOriental ? 'bg-[#0B1026]/80 text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0B1026]'
          : 'bg-white/80 text-rose-dark hover:bg-rose-dark hover:text-white'
        }`}>
          <Heart size={16} />
        </button>
        {isRamadan && item.category === 'ramadan' && (
          <div className="absolute bottom-3 left-3 bg-gold/90 text-espresso text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
            Ramadan Special
          </div>
        )}
        {isOriental && item.category === 'oriental-sweets' && (
          <div className="absolute bottom-3 left-3 bg-[#FFD700] text-[#0B1026] text-[10px] font-bold px-2 py-1 rounded-full shadow-lg tracking-widest uppercase">
            Pharaonic
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col justify-center py-2 pr-4 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-2xl font-serif font-bold leading-tight transition-colors duration-300 ${
            isRamadan ? 'text-gold group-hover:text-white' 
            : isOriental ? 'text-[#FFD700] group-hover:text-white tracking-wide'
            : 'text-espresso group-hover:text-rose-dark'
          }`}>
            {item.name[language as 'ar'|'en']}
          </h3>
          <span className={`text-xl font-bold whitespace-nowrap transition-colors duration-300 ${
            isRamadan ? 'text-white' 
            : isOriental ? 'text-white'
            : 'text-rose-dark'
          }`}>
            {item.price} <span className={`text-sm font-normal ${isRamadan || isOriental ? 'text-white/50' : 'text-espresso/40'}`}>{t('common.currency')}</span>
          </span>
        </div>
        
        <p className={`text-sm mb-4 leading-relaxed font-medium transition-colors duration-300 text-balance ${
          isRamadan ? 'text-gray-300 group-hover:text-white/90' 
          : isOriental ? 'text-gray-400 group-hover:text-white/90'
          : 'text-espresso/60 group-hover:text-espresso/80'
        }`}>
          {item.description[language as 'ar'|'en']}
        </p>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={
                i < Math.floor(item.rating) 
                  ? (isRamadan ? "text-gold fill-gold" : isOriental ? "text-[#FFD700] fill-[#FFD700]" : "text-gold fill-gold")
                  : (isRamadan || isOriental ? "text-white/20" : "text-espresso/10")
              } 
            />
          ))}
          <span className={`text-xs mx-2 ${isRamadan || isOriental ? 'text-white/40' : 'text-espresso/30'}`}>({item.rating})</span>
        </div>
      </div>

      {/* Decorative Blob */}
      <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
        isRamadan ? 'bg-gold/20' 
        : isOriental ? 'bg-[#FFD700]/20'
        : 'bg-rose-blush/30'
      }`}></div>
    </motion.div>
  );
};

export default function Menu() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ramadan');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ramadan', name: { ar: 'رمضانيات 🌙', en: 'Ramadan Specials 🌙' } },
    { id: 'oriental-sweets', name: { ar: 'حلويات شرقية 🕌', en: 'Oriental Sweets 🕌' } },
    { id: 'hot-drinks', name: { ar: 'مشروبات ساخنة', en: 'Hot Drinks' } },
    { id: 'cold-drinks', name: { ar: 'مشروبات باردة', en: 'Cold Drinks' } },
    { id: 'desserts', name: { ar: 'حلو', en: 'Desserts' } },
    { id: 'breakfast', name: { ar: 'فطار', en: 'Breakfast' } },
  ];

  const menuItems = [
    // Ramadan Specials
    {
      id: 101,
      category: 'ramadan',
      name: { en: 'Kunafa Fruit Cake', ar: 'كنافة بالفواكه' },
      description: { en: 'A stunning fusion of crispy golden kunafa layered with fresh seasonal fruits and soft cream.', ar: 'كنافة دهبي مقرمشة مع فواكه الموسم وكريمة ناعمة.. ميكس يجنن.' },
      price: '633',
      image: 'https://images.unsplash.com/photo-1576506542790-51244b486a6b?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 102,
      category: 'ramadan',
      name: { en: 'Dubai Trend Cup', ar: 'كوب دبي تريند' },
      description: { en: 'A rich, indulgent dessert inspired by Dubai’s viral sweet creations.', ar: 'اختراع دبي اللي مكسر الدنيا.. طبقات غنية وكريمة تدوب.' },
      price: '229',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 103,
      category: 'ramadan',
      name: { en: 'Strawberry Kunafa Cup', ar: 'كوب كنافة فراولة' },
      description: { en: 'Crispy kunafa layered with fresh strawberries and velvety cream.', ar: 'كنافة بالفراولة الفريش والكريمة.. طعم رمضان الأصلي.' },
      price: '144',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=2578&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 104,
      category: 'ramadan',
      name: { en: 'Despacito Trend Special', ar: 'ديسباسيتو سبيشيال' },
      description: { en: 'Our signature Ramadan trend dessert — bold flavors, elegant presentation.', ar: 'اختراع ديسباسيتو الرمضاني.. طعم وشكل ميتوصفش.' },
      price: '460',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 105,
      category: 'ramadan',
      name: { en: 'Dubai Cake', ar: 'كيكة دبي' },
      description: { en: 'A luxurious cake inspired by rich Middle Eastern flavors.', ar: 'كيكة دبي الفاخرة.. طعم شرقي أصلي بمكونات بريميوم.' },
      price: '690',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2589&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 106,
      category: 'ramadan',
      name: { en: 'Nutella Kunafa Cup', ar: 'كوب كنافة نوتيلا' },
      description: { en: 'Golden kunafa filled with creamy Nutella and smooth layers.', ar: 'كنافة غرقانة نوتيلا.. لعشاق الشوكولاتة.' },
      price: '173',
      image: 'https://images.unsplash.com/photo-1599785209707-3084275133eb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 107,
      category: 'ramadan',
      name: { en: 'Strawberry Kunafa Cake', ar: 'كيكة كنافة فراولة' },
      description: { en: 'Soft cake layered with crispy kunafa and fresh strawberries.', ar: 'كيكة طرية مع كنافة مقرمشة وفراولة.. ميكس قوام حكاية.' },
      price: '633',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=2665&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 108,
      category: 'ramadan',
      name: { en: 'Large Rolled Kunafa Bowl', ar: 'بولة كنافة رول كبيرة' },
      description: { en: 'A generous bowl of rolled kunafa filled with rich cream.', ar: 'بولة كنافة رول كبيرة.. مليانة كريمة وحركات.' },
      price: '690',
      image: 'https://images.unsplash.com/photo-1617305855058-2950521447b9?q=80&w=2574&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 109,
      category: 'ramadan',
      name: { en: 'Large Profiterole', ar: 'بروفيترول كبير' },
      description: { en: 'Soft choux pastry filled with cream and covered in rich chocolate.', ar: 'بروفيترول كبير محشي كريمة وغرقان صوص شوكولاتة.' },
      price: '460',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 110,
      category: 'ramadan',
      name: { en: 'Mango & Strawberry Kunafa', ar: 'كنافة مانجا وفراولة' },
      description: { en: 'A refreshing blend of mango and strawberry layered over crispy kunafa.', ar: 'ميكس مانجا وفراولة مع كنافة وكريمة.. انتعاش.' },
      price: '550',
      image: 'https://images.unsplash.com/photo-1515463138280-67d1dcbf3175?q=80&w=2669&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 111,
      category: 'ramadan',
      name: { en: 'Mango Kunafa Cake', ar: 'كيكة كنافة مانجا' },
      description: { en: 'A vibrant mango-infused kunafa cake with tropical sweetness.', ar: 'كيكة كنافة بالمانجا.. طعم الصيف في رمضان.' },
      price: '857',
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=2568&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 112,
      category: 'ramadan',
      name: { en: 'Mango Kunafa Bowl', ar: 'بولة كنافة مانجا' },
      description: { en: 'A smaller portion of our signature mango kunafa delight.', ar: 'بولة كنافة بالمانجا.. على قدك بس جبارة.' },
      price: '516',
      image: 'https://images.unsplash.com/photo-1595272262678-755734d32646?q=80&w=2574&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 113,
      category: 'ramadan',
      name: { en: 'Nutella Kunafa Bowl', ar: 'بولة كنافة نوتيلا' },
      description: { en: 'A rich bowl of crispy kunafa layered with Nutella and smooth cream.', ar: 'بولة كنافة بالنوتيلا.. دمار شامل.' },
      price: '665',
      image: 'https://images.unsplash.com/photo-1630405436873-49d7301895cf?q=80&w=2669&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 114,
      category: 'ramadan',
      name: { en: 'Profiterole Cup', ar: 'كوب بروفيترول' },
      description: { en: 'Mini profiteroles layered with chocolate sauce and cream.', ar: 'كوباية بروفيترول صغنن.. خفيف بس يظبطك.' },
      price: '150',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 115,
      category: 'ramadan',
      name: { en: 'Maashouqa Bowl', ar: 'بولة المعشوقة' },
      description: { en: 'A signature Ramadan creation crafted for true dessert lovers.', ar: 'بولة المعشوقة.. اختراع رمضان المخصوص للعشاق.' },
      price: '500',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },

    // Oriental Sweets
    {
      id: 201,
      category: 'oriental-sweets',
      name: { en: 'Om Ali', ar: 'أم علي' },
      description: { en: 'Traditional Egyptian bread pudding with nuts, raisins, and hot milk.', ar: 'أم علي بالسمنة البلدي والمكسرات.. الدفا كله.' },
      price: '85',
      image: 'https://images.unsplash.com/photo-1576506542790-51244b486a6b?q=80&w=2574&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 202,
      category: 'oriental-sweets',
      name: { en: 'Basbousa with Cream', ar: 'بسبوسة بالقشطة' },
      description: { en: 'Soft semolina cake soaked in syrup and topped with fresh cream.', ar: 'بسبوسة دايبة ومرملة وعليها قشطة فريش.' },
      price: '70',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2589&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 203,
      category: 'oriental-sweets',
      name: { en: 'Rice Pudding', ar: 'رز بلبن' },
      description: { en: 'Creamy rice pudding topped with nuts and cinnamon.', ar: 'رز بلبن فرن وش مكرمل ومكسرات.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2670&auto=format&fit=crop',
      rating: 4.9
    },

    // Existing Items
    {
      id: 1,
      category: 'desserts',
      name: { ar: 'مولتن كيك', en: 'Molten Cake' },
      description: { ar: 'غرقانة شوكولاتة وبتدوب في بؤك، معاها بولة آيس كريم.', en: 'Rich chocolate lava cake served with vanilla ice cream.' },
      price: '90',
      image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=2670&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 2,
      category: 'cold-drinks',
      name: { ar: 'آيس سبانيش لاتيه', en: 'Iced Spanish Latte' },
      description: { ar: 'ميكس حليب مكثف مع اسبريسو وتلج، يروق عليك.', en: 'Sweet condensed milk with fresh espresso and ice.' },
      price: '75',
      image: 'https://images.unsplash.com/photo-1579992353560-fd1d929f406f?q=80&w=2574&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 3,
      category: 'desserts',
      name: { ar: 'تشيز كيك لوتس', en: 'Lotus Cheesecake' },
      description: { ar: 'طبقة بسكوت لوتس مقرمشة مع كريمة غنية وصوص لوتس.', en: 'Creamy cheesecake with a crunchy Lotus biscuit base.' },
      price: '85',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2670&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 4,
      category: 'hot-drinks',
      name: { ar: 'كابتشينو', en: 'Cappuccino' },
      description: { ar: 'رغوة كثيفة وقهوة مظبوطة، كلاسيك.', en: 'Classic espresso with steamed milk and thick foam.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 5,
      category: 'breakfast',
      name: { ar: 'فطار مصري', en: 'Egyptian Breakfast' },
      description: { ar: 'فول، فلافل، بيض، جبنة، وعيش بلدي سخن.', en: 'Foul, Falafel, Eggs, Cheese, and fresh Baladi bread.' },
      price: '120',
      image: 'https://images.unsplash.com/photo-1529563021893-cc83c914d7c4?q=80&w=2670&auto=format&fit=crop',
      rating: 5
    },
    {
      id: 6,
      category: 'cold-drinks',
      name: { ar: 'موهيتو فراولة', en: 'Strawberry Mojito' },
      description: { ar: 'منعش ولذيذ، نعناع وليمون وصودا مع سيرب فراولة.', en: 'Refreshing mint, lime, soda with strawberry syrup.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=2574&auto=format&fit=crop',
      rating: 4.6
    },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === item.category;
    const matchesSearch = item.name[language as 'ar'|'en'].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isRamadan = activeCategory === 'ramadan';
  const isOriental = activeCategory === 'oriental-sweets';

  return (
    <div className={`min-h-screen pt-48 pb-20 px-6 transition-colors duration-700 ${
      isRamadan ? 'bg-[#1a1015]' 
      : isOriental ? 'bg-[#0B1026]' // Royal Blue for Ancient Egypt
      : 'bg-rose-surface'
    }`}>
      
      {/* Background Vibes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {isRamadan ? (
            <motion.div 
              key="ramadan-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-10 w-64 h-64 bg-gold/10 rounded-full blur-[100px] animate-pulse-slow"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-blush/5 rounded-full blur-[120px] animate-pulse-slow"></div>
              
              {/* Hanging Lanterns */}
              <div className="absolute top-0 right-10 md:right-32 w-0.5 bg-gradient-to-b from-gold/50 to-transparent h-32 md:h-48">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-gold/10 border border-gold/30 rounded-lg shadow-[0_0_30px_rgba(233,196,106,0.3)] animate-float"></div>
              </div>
              <div className="absolute top-0 left-10 md:left-32 w-0.5 bg-gradient-to-b from-gold/50 to-transparent h-24 md:h-36">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-10 bg-gold/10 border border-gold/30 rounded-lg shadow-[0_0_30px_rgba(233,196,106,0.3)] animate-float" style={{ animationDelay: '1.5s' }}></div>
              </div>
            </motion.div>
          ) : isOriental ? (
            <motion.div 
              key="oriental-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Ancient Egypt Night Sky */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B1026] via-[#1B264F] to-[#0F0F0F]"></div>
              
              {/* Stars */}
              <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

              {/* Pyramids Silhouette */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 flex items-end justify-center opacity-20 pointer-events-none">
                 <svg viewBox="0 0 1440 320" className="w-full h-full text-[#C6A87C] fill-current">
                    <path d="M200,320 L450,100 L700,320 Z" /> {/* Left Pyramid */}
                    <path d="M600,320 L950,50 L1300,320 Z" /> {/* Main Pyramid */}
                    <path d="M1100,320 L1250,200 L1400,320 Z" /> {/* Right Pyramid */}
                 </svg>
              </div>

              {/* Eye of Horus / Ra Sun */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-[100px]"></div>
              <div className="absolute top-24 left-1/2 -translate-x-1/2 opacity-10 animate-pulse-slow">
                 <svg width="200" height="100" viewBox="0 0 200 100" fill="none" stroke="#FFD700" strokeWidth="2">
                    {/* Stylized Eye */}
                    <path d="M20,50 Q100,0 180,50 Q100,100 20,50 Z" />
                    <circle cx="100" cy="50" r="25" />
                 </svg>
              </div>

              {/* Floating Gold Dust */}
              <div className="absolute top-1/4 left-10 w-2 h-2 bg-[#FFD700] rounded-full blur-[1px] animate-float"></div>
              <div className="absolute top-1/3 right-20 w-3 h-3 bg-[#FFD700] rounded-full blur-[2px] animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-[#FFD700] rounded-full blur-[1px] animate-float" style={{ animationDelay: '2.5s' }}></div>
            </motion.div>
          ) : (
            <motion.div 
              key="standard-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Warm Blobs */}
              <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-rose-blush/10 rounded-full blur-[100px] animate-float"></div>
              <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }}></div>
              
              {/* Floating Icons */}
              <div className="absolute top-1/4 left-10 text-rose-blush/20 animate-float">
                <Heart size={48} fill="currentColor" />
              </div>
              <div className="absolute bottom-1/3 right-10 text-rose-blush/20 animate-float" style={{ animationDelay: '1s' }}>
                <Star size={32} fill="currentColor" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <h1 className={`text-6xl md:text-8xl font-black mb-4 relative z-10 transition-colors duration-500 ${
              isRamadan ? 'text-gold drop-shadow-[0_0_15px_rgba(233,196,106,0.5)]' 
              : isOriental ? 'text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] font-serif tracking-widest'
              : 'text-espresso'
            }`}>
              {isRamadan ? (
                <span className="flex items-center justify-center gap-4">
                  <Moon className="text-gold fill-gold animate-pulse" size={40} />
                  Menu
                  <Moon className="text-gold fill-gold animate-pulse" size={40} />
                </span>
              ) : isOriental ? (
                <span className="flex items-center justify-center gap-4">
                   <span className="text-4xl opacity-80">𓀀</span>
                   MENU
                   <span className="text-4xl opacity-80">𓀀</span>
                </span>
              ) : (
                'Menu'
              )}
            </h1>
            <div className={`h-4 w-full -mt-6 relative z-0 rounded-full transition-colors duration-500 ${
              isRamadan ? 'bg-gold/20' 
              : isOriental ? 'bg-[#FFD700]/20'
              : 'bg-rose-blush/30'
            }`}></div>
          </motion.div>
          <p className={`text-xl mt-4 max-w-2xl mx-auto font-medium transition-colors duration-500 ${
            isRamadan ? 'text-white/80' 
            : isOriental ? 'text-[#FFD700]/80 tracking-widest uppercase'
            : 'text-gray-600'
          }`}>
            {language === 'ar' ? 'اختار اللي يظبط مودك النهاردة' : 'Pick what matches your mood today'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-24 z-30 backdrop-blur-md p-4 rounded-full shadow-lg border transition-all duration-500 ${
          isRamadan ? 'bg-black/30 border-white/10' 
          : isOriental ? 'bg-[#0B1026]/50 border-[#FFD700]/30'
          : 'bg-white/80 border-white/50'
        }`}>
          
          {/* Categories */}
          <motion.div 
            className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categories.map((cat, index) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? isRamadan 
                      ? 'bg-gold text-espresso shadow-[0_0_20px_rgba(233,196,106,0.4)] scale-105' 
                      : isOriental
                      ? 'bg-[#FFD700] text-[#0B1026] shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105 tracking-widest'
                      : 'bg-rose-blush text-white shadow-md transform scale-105'
                    : isRamadan 
                      ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-gold' 
                      : isOriental
                      ? 'bg-[#0B1026]/40 text-white/60 hover:bg-[#0B1026]/60 hover:text-[#FFD700]'
                      : 'bg-transparent text-espresso hover:bg-rose-100'
                }`}
              >
                {cat.name[language as 'ar'|'en']}
              </motion.button>
            ))}
          </motion.div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? 'right-4' : 'left-4'} ${
              isRamadan ? 'text-white/40' 
              : isOriental ? 'text-[#FFD700]/60'
              : 'text-gray-400'
            }`} size={20} />
            <input
              type="text"
              placeholder={language === 'ar' ? 'دور على اللي نفسك فيه...' : 'Search for cravings...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-full py-3 px-12 focus:outline-none focus:ring-2 transition-all ${language === 'ar' ? 'text-right' : 'text-left'} ${
                isRamadan ? 'bg-white/10 border-white/10 text-white placeholder-white/40 focus:ring-gold/50' 
                : isOriental ? 'bg-[#0B1026]/40 border-[#FFD700]/30 text-white placeholder-white/40 focus:ring-[#FFD700]/50'
                : 'bg-gray-50 border-gray-200 focus:ring-rose-blush/50'
              }`}
            />
          </div>
        </div>

        {/* Menu Grid - Magazine Style */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <MenuItem 
                key={item.id} 
                item={item} 
                isRamadan={isRamadan} 
                isOriental={isOriental}
                language={language} 
                t={t} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className={`text-2xl font-bold ${isRamadan || isOriental ? 'text-white/50' : 'text-gray-400'}`}>
              {language === 'ar' ? 'مفيش حاجة بالاسم ده 😔' : 'No cravings found 😔'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
