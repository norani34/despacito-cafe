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
  const imageSrc = (() => {
    if (typeof item.image !== 'string') return item.image;
    if (item.image.startsWith('dist/')) {
      return encodeURI('/' + item.image.replace(/^dist\//, ''));
    }
    return item.image;
  })();

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
          src={imageSrc} 
          alt={item.name[language as 'ar'|'en']} 
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
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
          {/* Price hidden until real data is provided */}
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
    { id: 'cold-juices', name: { ar: 'عصائر طازجة', en: 'Fresh Juices' } },
    { id: 'smoothies', name: { ar: 'سموزي', en: 'Smoothies' } },
    { id: 'mixes', name: { ar: 'ميكسات', en: 'Mixes' } },
    { id: 'bakery', name: { ar: 'المخبوزات', en: 'Bakery' } },
    { id: 'cold-coffee', name: { ar: 'قهوة باردة', en: 'Cold Coffee & Shakes' } },
    { id: 'desserts', name: { ar: 'حلو', en: 'Desserts' } },
  ];

  const menuItemsRaw = [
    // Ramadan Specials
    {
      id: 101,
      category: 'ramadan',
      name: { en: 'Kunafa Fruit Cake', ar: 'كنافة بالفواكه' },
      description: { en: 'A stunning fusion of crispy golden kunafa layered with fresh seasonal fruits and soft cream.', ar: 'كنافة دهبي مقرمشة مع فواكه الموسم وكريمة ناعمة.. ميكس يجنن.' },
      price: '633',
      image: 'dist/Ramadan Specials/Kunafa Fruit Cake.jpeg',
      rating: 5
    },
    {
      id: 102,
      category: 'ramadan',
      name: { en: 'Dubai Trend Cup', ar: 'كوب دبي تريند' },
      description: { en: 'A rich, indulgent dessert inspired by Dubai’s viral sweet creations.', ar: 'اختراع دبي اللي مكسر الدنيا.. طبقات غنية وكريمة تدوب.' },
      price: '229',
      image: 'dist/Ramadan Specials/Dubai Trend Cup.jpeg',
      rating: 4.8
    },
    {
      id: 103,
      category: 'ramadan',
      name: { en: 'Strawberry Kunafa Cup', ar: 'كوب كنافة فراولة' },
      description: { en: 'Crispy kunafa layered with fresh strawberries and velvety cream.', ar: 'كنافة بالفراولة الفريش والكريمة.. طعم رمضان الأصلي.' },
      price: '144',
      image: 'dist/Ramadan Specials/Strawberry Kunafa Cup.jpeg',
      rating: 4.7
    },
    {
      id: 104,
      category: 'ramadan',
      name: { en: 'Despacito Trend Special', ar: 'ديسباسيتو سبيشيال' },
      description: { en: 'Our signature Ramadan trend dessert — bold flavors, elegant presentation.', ar: 'اختراع ديسباسيتو الرمضاني.. طعم وشكل ميتوصفش.' },
      price: '460',
      image: 'dist/Ramadan Specials/Despacito Trend Special.jpeg',
      rating: 5
    },
    {
      id: 105,
      category: 'ramadan',
      name: { en: 'Dubai Cake', ar: 'كيكة دبي' },
      description: { en: 'A luxurious cake inspired by rich Middle Eastern flavors.', ar: 'كيكة دبي الفاخرة.. طعم شرقي أصلي بمكونات بريميوم.' },
      price: '690',
      image: 'dist/Ramadan Specials/dubai-chocolate-cake-with-kataifi.png',
      rating: 4.9
    },
    {
      id: 106,
      category: 'ramadan',
      name: { en: 'Nutella Kunafa Cup', ar: 'كوب كنافة نوتيلا' },
      description: { en: 'Golden kunafa filled with creamy Nutella and smooth layers.', ar: 'كنافة غرقانة نوتيلا.. لعشاق الشوكولاتة.' },
      price: '173',
      image: 'dist/Ramadan Specials/nutella-nest-kunafa-4143880.jpg',
      rating: 4.8
    },
    {
      id: 107,
      category: 'ramadan',
      name: { en: 'Strawberry Kunafa Cake', ar: 'كيكة كنافة فراولة' },
      description: { en: 'Soft cake layered with crispy kunafa and fresh strawberries.', ar: 'كيكة طرية مع كنافة مقرمشة وفراولة.. ميكس قوام حكاية.' },
      price: '633',
      image: 'dist/Ramadan Specials/strwappery kunafa cake.jpg',
      rating: 5
    },
    {
      id: 108,
      category: 'ramadan',
      name: { en: 'Large Rolled Kunafa Bowl', ar: 'بولة كنافة رول كبيرة' },
      description: { en: 'A generous bowl of rolled kunafa filled with rich cream.', ar: 'بولة كنافة رول كبيرة.. مليانة كريمة وحركات.' },
      price: '690',
      image: 'dist/Ramadan Specials/large kunafa.jpg',
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
      image: 'dist/Ramadan Specials/mango-strawberry-kunafa-cake.jpg',
      rating: 5
    },
    {
      id: 111,
      category: 'ramadan',
      name: { en: 'Mango Kunafa Cake', ar: 'كيكة كنافة مانجا' },
      description: { en: 'A vibrant mango-infused kunafa cake with tropical sweetness.', ar: 'كيكة كنافة بالمانجا.. طعم الصيف في رمضان.' },
      price: '857',
      image: 'dist/Ramadan Specials/mango kunafa cake.png',
      rating: 5
    },
    {
      id: 112,
      category: 'ramadan',
      name: { en: 'Mango Kunafa Bowl', ar: 'بولة كنافة مانجا' },
      description: { en: 'A smaller portion of our signature mango kunafa delight.', ar: 'بولة كنافة بالمانجا.. على قدك بس جبارة.' },
      price: '516',
      image: 'dist/Ramadan Specials/mango kunafa bowl.jpg',
      rating: 4.8
    },
    {
      id: 113,
      category: 'ramadan',
      name: { en: 'Nutella Kunafa Bowl', ar: 'بولة كنافة نوتيلا' },
      description: { en: 'A rich bowl of crispy kunafa layered with Nutella and smooth cream.', ar: 'بولة كنافة بالنوتيلا.. دمار شامل.' },
      price: '665',
      image: 'dist/Ramadan Specials/nutella-nest-kunafa-4143880.jpg',
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
      image: 'dist/Oriental Sweets/Om Ali.jpeg',
      rating: 5
    },
    {
      id: 202,
      category: 'oriental-sweets',
      name: { en: 'Basbousa with Cream', ar: 'بسبوسة بالقشطة' },
      description: { en: 'Soft semolina cake soaked in syrup and topped with fresh cream.', ar: 'بسبوسة دايبة ومرملة وعليها قشطة فريش.' },
      price: '70',
      image: 'dist/Oriental Sweets/Basbousa with Cream.jpeg',
      rating: 4.8
    },
    {
      id: 203,
      category: 'oriental-sweets',
      name: { en: 'Rice Pudding', ar: 'رز بلبن' },
      description: { en: 'Creamy rice pudding topped with nuts and cinnamon.', ar: 'رز بلبن فرن وش مكرمل ومكسرات.' },
      price: '55',
      image: 'dist/Oriental Sweets/Rice Pudding.jpg',
      rating: 4.9
    },
    // Additional Oriental Sweets (from user list)
    {
      id: 601,
      category: 'oriental-sweets',
      name: { ar: 'بسبوسة سادة', en: 'Basbousa (Plain)' },
      description: { ar: 'بسبوسة تقليدية ساده.', en: 'Classic plain semolina cake.' },
      price: '170',
      image: 'dist/Oriental Sweets/Basbousa (Plain).jpeg',
      rating: 4.6
    },
    {
      id: 602,
      category: 'oriental-sweets',
      name: { ar: 'رواني سادة', en: 'Rawani (Plain)' },
      description: { ar: 'رواني لين بسيمه حلوة.', en: 'Soft semolina sponge.' },
      price: '160',
      image: 'https://images.unsplash.com/photo-1589308078059-4c0c9d1d0a82?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 603,
      category: 'oriental-sweets',
      name: { ar: 'لينزا', en: 'Linza' },
      description: { ar: 'حلوى لينزا شرقية.', en: 'Traditional Linza pastry.' },
      price: '200',
      image: 'https://images.unsplash.com/photo-1563805042-7684bfb9a6c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 604,
      category: 'oriental-sweets',
      name: { ar: 'رموش', en: 'Ramoush' },
      description: { ar: 'حلويات صغيرة لذيذة.', en: 'Delicate sweet fingers/pastries.' },
      price: '170',
      image: 'https://images.unsplash.com/photo-1532634896-26909d0d5a64?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 605,
      category: 'oriental-sweets',
      name: { ar: 'كنافة كريمة', en: 'Kunafa (Cream)' },
      description: { ar: 'كنافة بمحشوة قشطة كريمية.', en: 'Kunafa filled with cream.' },
      price: '225',
      image: 'https://images.unsplash.com/photo-1599785209707-3084275133eb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 606,
      category: 'oriental-sweets',
      name: { ar: 'كنافة سادة', en: 'Kunafa (Plain)' },
      description: { ar: 'كنافة مقرمشة وسادة.', en: 'Classic plain kunafa.' },
      price: '250',
      image: 'https://images.unsplash.com/photo-1617305855058-2950521447b9?q=80&w=2574&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 607,
      category: 'oriental-sweets',
      name: { ar: 'اساور نوتيلا', en: 'Nutella Bracelets' },
      description: { ar: 'مقبلات حلوانية بحشوة نوتيلا.', en: 'Pastry rings filled with Nutella.' },
      price: '250',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=2574&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 608,
      category: 'oriental-sweets',
      name: { ar: 'سيمة سادة', en: 'Sima (Plain)' },
      description: { ar: 'حلويات سيمة تقليدية.', en: 'Traditional Sima sweet.' },
      price: '240',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2589&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 609,
      category: 'oriental-sweets',
      name: { ar: 'بسبوسة بندق', en: 'Basbousa (Hazelnut)' },
      description: { ar: 'بسبوسة مع نكهة بندق.', en: 'Basbousa topped/filled with hazelnut.' },
      price: '210',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=2574&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 610,
      category: 'oriental-sweets',
      name: { ar: 'كنافة اصابع سادة', en: 'Kunafa Fingers (Plain)' },
      description: { ar: 'اصابع كنافة مقرمشة وسادة.', en: 'Plain kunafa fingers.' },
      price: '250',
      image: 'https://images.unsplash.com/photo-1630405436873-49d7301895cf?q=80&w=2669&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 611,
      category: 'oriental-sweets',
      name: { ar: 'بسبوسة نوتيلا', en: 'Basbousa (Nutella)' },
      description: { ar: 'بسبوسة مع طبقة نوتيلا لذيذة.', en: 'Basbousa topped with Nutella.' },
      price: '460',
      image: 'dist/Ramadan Specials/ProfiterolesHeader.jpg',
      rating: 4.7
    },
    {
      id: 612,
      category: 'oriental-sweets',
      name: { ar: 'مدلعة (لوتس - نوتيلا - كراميل)', en: 'Madlaa (Lotus - Nutella - Caramel)' },
      description: { ar: 'صندوق مدلعة بنكهات متعددة.', en: 'Assorted Madlaa with Lotus, Nutella, or Caramel.' },
      price: '250',
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=2568&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 613,
      category: 'oriental-sweets',
      name: { ar: 'مدلعة مانجو فراولة', en: 'Madlaa Mango Strawberry' },
      description: { ar: 'مدلعة بنكهة مانجو وفراولة.', en: 'Madlaa with mango and strawberry.' },
      price: '280',
      image: 'https://images.unsplash.com/photo-1515463138280-67d1dcbf3175?q=80&w=2669&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 614,
      category: 'oriental-sweets',
      name: { ar: 'كنافة وش مانجو', en: 'Kunafa with Mango Topping' },
      description: { ar: 'كنافة مع وجه مانجو طازج.', en: 'Kunafa topped with fresh mango.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1515463138280-67d1dcbf3175?q=80&w=2669&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 615,
      category: 'oriental-sweets',
      name: { ar: 'بسبوسة قشطة', en: 'Basbousa (Cream)' },
      description: { ar: 'بسبوسة بحشو قشطة طازج.', en: 'Basbousa filled with cream.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1559628233-0f6da3d8a5e2?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 616,
      category: 'oriental-sweets',
      name: { ar: 'كنافة كونو', en: 'Kunafa Cono' },
      description: { ar: 'كنافة على شكل مخروط محشوة.', en: 'Cone-shaped kunafa filled with cream.' },
      price: '290',
      image: 'https://images.unsplash.com/photo-1617305855058-2950521447b9?q=80&w=2574&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 617,
      category: 'oriental-sweets',
      name: { ar: 'شكلمة', en: 'Shaklma' },
      description: { ar: 'حلو شرقي مميز.', en: 'Traditional Shaklma pastry.' },
      price: '280',
      image: 'https://images.unsplash.com/photo-1532634896-26909d0d5a64?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 618,
      category: 'oriental-sweets',
      name: { ar: 'عثمانلية', en: 'Uthmanliya' },
      description: { ar: 'حلوى عثمانية فاخرة.', en: 'Rich Ottoman-style sweet.' },
      price: '390',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 619,
      category: 'oriental-sweets',
      name: { ar: 'بقلاوة اصابع', en: 'Baklava Fingers' },
      description: { ar: 'بقلاوة على شكل اصابع مقرمشة.', en: 'Crispy baklava fingers.' },
      price: '380',
      image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 620,
      category: 'oriental-sweets',
      name: { ar: 'اساور بندق', en: 'Hazelnut Bracelets' },
      description: { ar: 'حلو محشو بندق ونكهات.', en: 'Pastry rings with hazelnut.' },
      price: '150',
      image: 'dist/Ramadan Specials/protfoloeo cups.jpg',
      rating: 4.5
    },
    {
      id: 621,
      category: 'oriental-sweets',
      name: { ar: 'بقلاوة زنود كريمة', en: 'Znood El-Sit (Creamy Fingers)' },
      description: { ar: 'زنود كريمة بقلاوة محشية بكريمة غنية.', en: 'Creamy filled baklava fingers.' },
      price: '450',
      image: 'https://images.unsplash.com/photo-1563805042-7684bfb9a6c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 622,
      category: 'oriental-sweets',
      name: { ar: 'كل و اشكر بندق', en: 'Kol Wa Ashkar (Hazelnut)' },
      description: { ar: 'تشكيلة بندق فاخرة.', en: 'Assorted hazelnut specialty.' },
      price: '380',
      image: 'https://images.unsplash.com/photo-1502741126161-b048400d8d2c?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 623,
      category: 'oriental-sweets',
      name: { ar: 'عش بندق', en: 'Hazelnut Nest' },
      description: { ar: 'عش من البندق ومحشوات لذيذة.', en: 'Nest-shaped hazelnut pastry.' },
      price: '380',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 624,
      category: 'oriental-sweets',
      name: { ar: 'اساور لوز', en: 'Almond Bracelets' },
      description: { ar: 'حلقات محشوة باللوز.', en: 'Almond filled pastry rings.' },
      price: '380',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 625,
      category: 'oriental-sweets',
      name: { ar: 'مشط لوز', en: 'Almond Comb' },
      description: { ar: 'مشط من اللوز محلى بشكل جميل.', en: 'Decorative almond pastry.' },
      price: '380',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 626,
      category: 'oriental-sweets',
      name: { ar: 'بقلاوة شكولاتة', en: 'Chocolate Baklava' },
      description: { ar: 'بقلاوة بطبقة شوكولاتة شهية.', en: 'Baklava with a chocolate layer.' },
      price: '250',
      image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 627,
      category: 'oriental-sweets',
      name: { ar: 'اساور لوتس', en: 'Lotus Bracelets' },
      description: { ar: 'حلقات محشوة بطعم لوتس.', en: 'Pastry rings filled with Lotus.' },
      price: '520',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?q=80&w=2574&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 628,
      category: 'oriental-sweets',
      name: { ar: 'اسية كاجو', en: 'Cashew Assia' },
      description: { ar: 'حلوى بالكاجو الفاخر.', en: 'Premium cashew pastry.' },
      price: '520',
      image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=2568&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 629,
      category: 'oriental-sweets',
      name: { ar: 'بورمة بندق', en: 'Borma (Hazelnut)' },
      description: { ar: 'بورمة محشية بالبندق.', en: 'Borma pastry filled with hazelnut.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=2574&auto=format&fit=crop',
      rating: 4.6
    },
    // Bakery items
    {
      id: 701,
      category: 'bakery',
      name: { ar: 'دوناتس (دارك - وايت - لوتس)', en: 'Donuts (Dark - White - Lotus)' },
      description: { ar: 'دوناتس بنكهات متعددة: دارك، وايت، لوتس.', en: 'Assorted donuts: dark, white, lotus.' },
      price: '35',
      image: 'dist/Bakery/Donuts (Dark - White - Lotus).jpg',
      rating: 4.5
    },
    {
      id: 702,
      category: 'bakery',
      name: { ar: 'كرواسون شوكولاتة', en: 'Chocolate Croissant' },
      description: { ar: 'كرواسون زبدة محشو بطبقة شوكولاتة غنية.', en: 'Flaky butter croissant filled with rich chocolate.' },
      price: '35',
      image: 'dist/Bakery/Chocolate Croissant.jpg',
      rating: 4.6
    },
    {
      id: 703,
      category: 'bakery',
      name: { ar: 'دانش تفاح', en: 'Apple Danish' },
      description: { ar: 'دانش دافئ محشو بتفاح مقلي ورشة قرفة.', en: 'Warm apple danish with cinnamon and a light glaze.' },
      price: '30',
      image: 'dist/Bakery/Apple Danish.jpg',
      rating: 4.7
    },
    {
      id: 704,
      category: 'bakery',
      name: { ar: 'لفائف القرفة', en: 'Cinnamon Rolls' },
      description: { ar: 'لفائف قرفة طازجة مع طبقة من الغلاز الخفيفة.', en: 'Fresh cinnamon rolls topped with a sweet glaze.' },
      price: '25',
      image: 'dist/Bakery/Cinnamon Rolls.jpg',
      rating: 4.3
    },
    {
      id: 705,
      category: 'bakery',
      name: { ar: 'دوناتس صغير (دارك - وايت - لوتس)', en: 'Mini Donuts (Dark - White - Lotus)' },
      description: { ar: 'نسخة صغيرة من الدوناتس بنكهات متعددة.', en: 'Mini donuts assortment.' },
      price: '25',
      image: 'https://images.unsplash.com/photo-1558021212-51b6f6b5f3c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.2
    },
    {
      id: 706,
      category: 'bakery',
      name: { ar: 'دانش (فاكهة - زبيب - تفاح - عنب - مانجو)', en: 'Danish (Fruit - Raisin - Apple - Grape - Mango)' },
      description: { ar: 'مجموعة دانش محشوة بفواكه متنوعة.', en: 'Assorted danish pastries with various fruit fillings.' },
      price: '35',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 707,
      category: 'bakery',
      name: { ar: 'دانش لوتس', en: 'Lotus Danish' },
      description: { ar: 'دانش محشو بطعم لوتس المميز.', en: 'Danish filled with Lotus flavor.' },
      price: '57',
      image: 'https://images.unsplash.com/photo-1542219550-cc2ad4d8a7f9?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 708,
      category: 'bakery',
      name: { ar: 'سينابون لوتس', en: 'Cinnabon Lotus' },
      description: { ar: 'سينابون بنكهة لوتس الغنية.', en: 'Cinnabon with Lotus flavor.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 709,
      category: 'bakery',
      name: { ar: 'سينابون شوكولاتة', en: 'Cinnabon Chocolate' },
      description: { ar: 'سينابون مغلف بطبقة شوكولاتة.', en: 'Chocolate-covered cinnabon.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 710,
      category: 'bakery',
      name: { ar: 'سينابون كراميل', en: 'Cinnabon Caramel' },
      description: { ar: 'سينابون مع صوص الكراميل.', en: 'Cinnabon with caramel sauce.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 711,
      category: 'bakery',
      name: { ar: 'باتيه جبنة بيضاء', en: 'Pate White Cheese' },
      description: { ar: 'باتيه محشو بجبنة بيضاء.', en: 'Pastry filled with white cheese.' },
      price: '32',
      image: 'https://images.unsplash.com/photo-1527515637460-5d4b6a8f2f97?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 712,
      category: 'bakery',
      name: { ar: 'باتيه جبنة رومى', en: 'Pate Roumy Cheese' },
      description: { ar: 'باتيه محشو بجبنة رومى.', en: 'Pastry filled with Roumy cheese.' },
      price: '37',
      image: 'https://images.unsplash.com/photo-1527515637460-5d4b6a8f2f97?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 713,
      category: 'bakery',
      name: { ar: 'باتيه جبنة شيدر', en: 'Pate Cheddar' },
      description: { ar: 'باتيه محشو بجبنة شيدر.', en: 'Pastry filled with cheddar cheese.' },
      price: '33',
      image: 'https://images.unsplash.com/photo-1527515637460-5d4b6a8f2f97?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 714,
      category: 'bakery',
      name: { ar: 'باتيه سوسيس', en: 'Pate Sausage' },
      description: { ar: 'باتيه محشو بسوسيس.', en: 'Sausage filled pastry.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1527515637460-5d4b6a8f2f97?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 715,
      category: 'bakery',
      name: { ar: 'باتيه بسطرمة', en: 'Pate Pastrami' },
      description: { ar: 'باتيه محشو بقطع بسترمة.', en: 'Pastrami filled pastry.' },
      price: '35',
      image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?q=80&w=2574&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 716,
      category: 'bakery',
      name: { ar: 'باتيه فاهيتا', en: 'Pate Fajita' },
      description: { ar: 'باتيه على طريقة الفاهيتا مع خلطات توابل.', en: 'Fajita-style pate with spiced filling.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1542444459-db2f4a8f3b2a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 717,
      category: 'bakery',
      name: { ar: 'كرواسون سادة', en: 'Plain Croissant' },
      description: { ar: 'كرواسون زبدة كلاسيكي.', en: 'Classic buttery croissant.' },
      price: '32',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 718,
      category: 'bakery',
      name: { ar: 'كرواسون براون', en: 'Brown Croissant' },
      description: { ar: 'كرواسون بحشوة الشوكولاتة.', en: 'Chocolate-filled croissant.' },
      price: '32',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 719,
      category: 'bakery',
      name: { ar: 'كرواسون روز بيف', en: 'Croissant Roast Beef' },
      description: { ar: 'كرواسون محشو روز بيف شهي.', en: 'Croissant stuffed with roast beef.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1515442261605-65987759f6d9?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 720,
      category: 'bakery',
      name: { ar: 'كرواسون تركي مدخن', en: 'Smoked Turkish Croissant' },
      description: { ar: 'كرواسون محشو بالتركي المدخن.', en: 'Croissant with smoked turkey.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1515442261605-65987759f6d9?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 721,
      category: 'bakery',
      name: { ar: 'كرواسون ميكس جبن', en: 'Mixed Cheese Croissant' },
      description: { ar: 'كرواسون بحشوة مزيج أجبان.', en: 'Croissant with mixed cheese filling.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 722,
      category: 'bakery',
      name: { ar: 'ساندوتش فراخ', en: 'Chicken Sandwich' },
      description: { ar: 'ساندوتش فراخ مشوية مع صوص خاص.', en: 'Grilled chicken sandwich with special sauce.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 723,
      category: 'bakery',
      name: { ar: 'ساندوتش تونة براون', en: 'Tuna Brown Sandwich' },
      description: { ar: 'ساندوتش تونة مع خبز بني وخضار.', en: 'Tuna sandwich on brown bread with greens.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 724,
      category: 'bakery',
      name: { ar: 'بيتزا بسطرمة', en: 'Basturma Pizza' },
      description: { ar: 'بيتزا مع شرائح البسطرمة والتوابل.', en: 'Pizza topped with basturma slices.' },
      price: '320',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 725,
      category: 'bakery',
      name: { ar: 'بيتزا سوسيس', en: 'Sausage Pizza' },
      description: { ar: 'بيتزا مع شرائح السوسيس الجاهزة.', en: 'Pizza topped with sausage.' },
      price: '320',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 726,
      category: 'bakery',
      name: { ar: 'بيتزا فراخ', en: 'Chicken Pizza' },
      description: { ar: 'بيتزا مع قطع فراخ متبلة.', en: 'Pizza topped with seasoned chicken.' },
      price: '320',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 727,
      category: 'bakery',
      name: { ar: 'بيتزا فونجيني', en: 'Funghi Pizza' },
      description: { ar: 'بيتزا بالفطر والجبنة.', en: 'Pizza with mushrooms and cheese.' },
      price: '320',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 728,
      category: 'bakery',
      name: { ar: 'ميني ساندوتش', en: 'Mini Sandwich' },
      description: { ar: 'سندوتش صغير مثالي للحفلات.', en: 'Party-size mini sandwich.' },
      price: '330',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 729,
      category: 'bakery',
      name: { ar: 'ميني بيتزا', en: 'Mini Pizza' },
      description: { ar: 'بيتزا صغيرة مناسبة للتقديم كمقبلات.', en: 'Small pizza, great as an appetizer.' },
      price: '300',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 730,
      category: 'bakery',
      name: { ar: 'كلوب ساندوتش 1 ك', en: 'Club Sandwich (1 kg)' },
      description: { ar: 'كلوب ساندوتش كبير للتقديم.', en: 'Large club sandwich for sharing.' },
      price: '360',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 731,
      category: 'bakery',
      name: { ar: 'ساليزون 1 ك', en: 'Salizon (1 kg)' },
      description: { ar: 'منتج معجنات خاص بوزن 1 كجم.', en: 'Special pastry product, 1 kg.' },
      price: '90',
      image: 'https://images.unsplash.com/photo-1502741126161-b048400d8d2c?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 732,
      category: 'bakery',
      name: { ar: 'انجلش كيك', en: 'English Cake' },
      description: { ar: 'كيك انجليزي كلاسيكي.', en: 'Classic English cake.' },
      price: '90',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    // Waffles & Pancakes
    {
      id: 801,
      category: 'bakery',
      name: { ar: 'وافل', en: 'Waffle' },
      description: { ar: 'وافل ذهبي ومقرمش يقدم مع صوص حسب الاختيار.', en: 'Golden crispy waffle, served with sauce.' },
      price: '80',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 802,
      category: 'bakery',
      name: { ar: 'وافل نوتيلا', en: 'Nutella Waffle' },
      description: { ar: 'وافل مع طبقة نوتيلا وكريمة.', en: 'Waffle topped with Nutella and cream.' },
      price: '90',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 803,
      category: 'bakery',
      name: { ar: 'وافل كيندر', en: 'Kinder Waffle' },
      description: { ar: 'وافل مع قطع كيندر وغنيمة شوكولاتة.', en: 'Waffle with Kinder pieces.' },
      price: '85',
      image: 'https://images.unsplash.com/photo-1558021212-51b6f6b5f3c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 804,
      category: 'bakery',
      name: { ar: 'وافل لوتس', en: 'Lotus Waffle' },
      description: { ar: 'وافل مع طبقات لوتس الهشة.', en: 'Waffle layered with Lotus spread.' },
      price: '85',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 805,
      category: 'bakery',
      name: { ar: 'وافل اوريو', en: 'Oreo Waffle' },
      description: { ar: 'وافل مزين بقطع اوريو وصوص شوكولاتة.', en: 'Waffle topped with Oreo pieces and chocolate sauce.' },
      price: '95',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 806,
      category: 'bakery',
      name: { ar: 'وافل فستق', en: 'Pistachio Waffle' },
      description: { ar: 'وافل مع طبقة فستق وقطع محمصة.', en: 'Waffle topped with pistachio and roasted bits.' },
      price: '80',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 807,
      category: 'bakery',
      name: { ar: 'وافل وايت', en: 'White Waffle' },
      description: { ar: 'وافل مع صوص وايت تشوكليت وكريمة.', en: 'Waffle with white chocolate sauce and cream.' },
      price: '90',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 808,
      category: 'bakery',
      name: { ar: 'وافل ديسباسيتو', en: 'Despacito Waffle' },
      description: { ar: 'وافل سبيشيال من ديسباسيتو مع توبينغ مميز.', en: 'Despacito signature waffle with special toppings.' },
      price: '95',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.9
    },
    {
      id: 809,
      category: 'bakery',
      name: { ar: 'ميني بان كيك (7 قطع)', en: 'Mini Pancake (7 pcs)' },
      description: { ar: 'سبع قطع بان كيك صغيرة تقدم مع شراب المفضّل.', en: 'Seven mini pancakes served with your choice of syrup.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 810,
      category: 'bakery',
      name: { ar: 'هاف وافل', en: 'Half Waffle' },
      description: { ar: 'نصف وفل صغير وسريع.', en: 'Half-size waffle for a light treat.' },
      price: '25',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 811,
      category: 'bakery',
      name: { ar: 'سلايس وافل', en: 'Waffle Slice' },
      description: { ar: 'شريحة وفل مخصصة للتقديم أو التحلية.', en: 'Single slice of waffle for dessert or sharing.' },
      price: '30',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.2
    },

    // Existing Items
    {
      id: 1,
      category: 'desserts',
      name: { ar: 'مولتن كيك', en: 'Molten Cake' },
      description: { ar: 'غرقانة شوكولاتة وبتدوب في بؤك، معاها بولة آيس كريم.', en: 'Rich chocolate lava cake served with vanilla ice cream.' },
      price: '90',
      image: 'dist/Desserts/Molten Cake.jpg',
      rating: 5
    },
    {
      id: 3,
      category: 'desserts',
      name: { ar: 'تشيز كيك لوتس', en: 'Lotus Cheesecake' },
      description: { ar: 'طبقة بسكوت لوتس مقرمشة مع كريمة غنية وصوص لوتس.', en: 'Creamy cheesecake with a crunchy Lotus biscuit base.' },
      price: '85',
      image: 'dist/Desserts/Lotus Cheesecake.jpg',
      rating: 4.9
    },
    // Additional Desserts (user list)
    {
      id: 901,
      category: 'desserts',
      name: { ar: 'جيلاتو لوكس', en: 'Gelato Luxe' },
      description: { ar: 'جيلاتو فاخر بنكهات متنوعة.', en: 'Premium gelato selection.' },
      price: '35',
      image: 'dist/Desserts/Gelato Luxe.jpg',
      rating: 4.5
    },
    {
      id: 902,
      category: 'desserts',
      name: { ar: 'جاتو اسبشيال', en: 'Gateau Special' },
      description: { ar: 'جاتو مميز من اختيار الشيف.', en: 'Chef-selected special gateau.' },
      price: '46',
      image: 'dist/Desserts/Gateau Special.jpeg',
      rating: 4.6
    },
    {
      id: 903,
      category: 'desserts',
      name: { ar: 'جاتو اوريجنال', en: 'Gateau Original' },
      description: { ar: 'جاتو كلاسيكي بنكهة غنية.', en: 'Classic original gateau.' },
      price: '46',
      image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 904,
      category: 'desserts',
      name: { ar: 'ريد فيلفت', en: 'Red Velvet Cake' },
      description: { ar: 'كيكة ريد فيلفت ناعمة مع كريمة جبنة.', en: 'Soft red velvet cake with cream cheese frosting.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 905,
      category: 'desserts',
      name: { ar: 'تشيز كيك كلاسيك', en: 'Classic Cheesecake' },
      description: { ar: 'تشيز كيك ناعم وكريمي.', en: 'Smooth and creamy classic cheesecake.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 906,
      category: 'desserts',
      name: { ar: 'تشيز كيك بلو بيري', en: 'Blueberry Cheesecake' },
      description: { ar: 'تشيز كيك مع طبقة توت ازرق طازجة.', en: 'Cheesecake topped with fresh blueberries.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1509403252976-9b7b1f1b9e1b?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 907,
      category: 'desserts',
      name: { ar: 'تشيز كيك راسبري', en: 'Raspberry Cheesecake' },
      description: { ar: 'تشيز كيك مع صوص توت العليق.', en: 'Cheesecake with raspberry sauce.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 908,
      category: 'desserts',
      name: { ar: 'تشيز كيك نوتيلا', en: 'Nutella Cheesecake' },
      description: { ar: 'تشيز كيك بنكهة نوتيلا الغنية.', en: 'Cheesecake infused with Nutella.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1604917877930-2b9a9e5c3b5d?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 909,
      category: 'desserts',
      name: { ar: 'تشيز كيك لوتس', en: 'Lotus Cheesecake (Special)' },
      description: { ar: 'نسخة خاصة من تشيز كيك لوتس.', en: 'Special Lotus cheesecake variant.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 910,
      category: 'desserts',
      name: { ar: 'تشيز كيك كراميل', en: 'Caramel Cheesecake' },
      description: { ar: 'تشيز كيك مع طبقة كراميل مملّس.', en: 'Cheesecake topped with salted caramel.' },
      price: '42',
      image: 'https://images.unsplash.com/photo-1558021212-51b6f6b5f3c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 911,
      category: 'desserts',
      name: { ar: 'كيكة العسل', en: 'Honey Cake' },
      description: { ar: 'كيكة طرية بنكهة العسل الطبيعي.', en: 'Moist cake flavored with natural honey.' },
      price: '46',
      image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 912,
      category: 'desserts',
      name: { ar: 'تارت فاكهة', en: 'Fruit Tart' },
      description: { ar: 'تارت مع تشكيلة فواكه طازجة.', en: 'Tart topped with assorted fresh fruits.' },
      price: '46',
      image: 'https://images.unsplash.com/photo-1516685018646-549c4c8b362f?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 913,
      category: 'desserts',
      name: { ar: 'تارت نوتيلا', en: 'Nutella Tart' },
      description: { ar: 'تارت محشوة بطبقة نوتيلا لذيذة.', en: 'Tart filled with a delicious Nutella layer.' },
      price: '42',
      image: 'https://images.unsplash.com/photo-1541832670-6a7b1b6c7d15?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 914,
      category: 'desserts',
      name: { ar: 'تارت عين جمل', en: 'Walnut Tart' },
      description: { ar: 'تارت محشو بعين الجمل ومكسرات.', en: 'Tart filled with walnuts and nuts.' },
      price: '46',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 915,
      category: 'desserts',
      name: { ar: 'سويس رول لوتس', en: 'Swiss Roll Lotus' },
      description: { ar: 'سويس رول محشو بطبقة لوتس.', en: 'Swiss roll filled with Lotus spread.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1505253716365-6c8e1e1a6d6a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 916,
      category: 'desserts',
      name: { ar: 'سويس رول شوكولاتة', en: 'Swiss Roll Chocolate' },
      description: { ar: 'سويس رول بطبقة شوكولاتة غنية.', en: 'Chocolate filled Swiss roll.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 917,
      category: 'desserts',
      name: { ar: 'سويس رول خوخ', en: 'Swiss Roll Peach' },
      description: { ar: 'سويس رول بنكهة الخوخ الطازج.', en: 'Peach-flavored Swiss roll.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1505253716365-6c8e1e1a6d6a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 918,
      category: 'desserts',
      name: { ar: 'مولتن كيك شوكولاتة', en: 'Molten Chocolate Cake' },
      description: { ar: 'مولتن كيك غني بالشوكولاتة.', en: 'Rich molten chocolate cake.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1604917877930-2b9a9e5c3b5d?q=80&w=2670&auto=format&fit=crop',
      rating: 4.8
    },
    {
      id: 919,
      category: 'desserts',
      name: { ar: 'جار شوكولاتة', en: 'Chocolate Jar' },
      description: { ar: 'جاتو مقدّم بجرّة بنكهة الشوكولاتة.', en: 'Chocolate dessert served in a jar.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 920,
      category: 'desserts',
      name: { ar: 'جار لوتس', en: 'Lotus Jar' },
      description: { ar: 'حلوة جرة بطبقات لوتس وكريمة.', en: 'Jar dessert with Lotus layers and cream.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 921,
      category: 'desserts',
      name: { ar: 'طاجن شوكولاتة', en: 'Chocolate Tagine' },
      description: { ar: 'طاجن شوكولاتة دافئ ومليء بالنكهات.', en: 'Warm chocolate tagine dessert.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 922,
      category: 'desserts',
      name: { ar: 'طاجن لوتس', en: 'Lotus Tagine' },
      description: { ar: 'طاجن بطبقات لوتس وغنى بالنكهات.', en: 'Tagine dessert with Lotus layers.' },
      price: '300',
      image: 'https://images.unsplash.com/photo-1541832670-6a7b1b6c7d15?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 923,
      category: 'desserts',
      name: { ar: 'جاتو سوارية', en: 'Gateau Sawariya' },
      description: { ar: 'جاتو سوارية مزخرف بشكل خاص.', en: 'Decorative Sawariya gateau.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1505253716365-6c8e1e1a6d6a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 924,
      category: 'desserts',
      name: { ar: 'كب كيك', en: 'Cupcake' },
      description: { ar: 'كب كيك طازج يقدم قطعة بقطعة.', en: 'Fresh cupcake (sold per piece).' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 925,
      category: 'desserts',
      name: { ar: 'كوكيز بالقطعة', en: 'Cookies (per piece)' },
      description: { ar: 'كوكيز طازجة كل قطعة على حدة.', en: 'Fresh cookies sold per piece.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1542414537-1c0b52d5b0e2?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 926,
      category: 'desserts',
      name: { ar: 'بروانيز كراميل عين جمل', en: 'Brownies Caramel Walnut' },
      description: { ar: 'بروانيز محشو بكراميل وقطع عين الجمل.', en: 'Brownies with caramel and walnut pieces.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 927,
      category: 'desserts',
      name: { ar: 'ماتيلدا كيك', en: 'Matilda Cake' },
      description: { ar: 'كيك ماتيلدا محضر بعناية.', en: 'Carefully prepared Matilda cake.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 928,
      category: 'desserts',
      name: { ar: 'جار ريد فيلفت', en: 'Red Velvet Jar' },
      description: { ar: 'ريد فيلفت مقدم بجرّة.', en: 'Red velvet dessert served in a jar.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 929,
      category: 'desserts',
      name: { ar: 'جار اوريو', en: 'Oreo Jar' },
      description: { ar: 'حلوية بالاوريو داخل جرّة تقديم.', en: 'Oreo-layered jar dessert.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1548365328-6f2f7c4f9f12?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 930,
      category: 'desserts',
      name: { ar: 'جار مانجا', en: 'Mango Jar' },
      description: { ar: 'جرّة بطبقات مانجا وفواكه.', en: 'Jar dessert layered with mango and fruits.' },
      price: '—',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 4,
      category: 'hot-drinks',
      name: { ar: 'كابتشينو', en: 'Cappuccino' },
      description: { ar: 'رغوة كثيفة وقهوة مظبوطة، كلاسيك.', en: 'Classic espresso with steamed milk and thick foam.' },
      price: '55',
      image: 'dist/Hot Drinks/Cappuccino.jpg',
      rating: 4.7
    },
    // Added hot drinks
    {
      id: 401,
      category: 'hot-drinks',
      name: { ar: 'اسبريسو (سنجل)', en: 'Espresso (Single)' },
      description: { ar: 'اسبرسو مركز وقوي.', en: 'Single shot of rich espresso.' },
      price: '40',
      image: 'dist/Hot Drinks/Espresso (Single).png',
      rating: 4.6
    },
    {
      id: 402,
      category: 'hot-drinks',
      name: { ar: 'اسبريسو (دبل)', en: 'Espresso (Double)' },
      description: { ar: 'دبل شوت اسبرسو لمزيج أقوى.', en: 'Double shot for extra strength.' },
      price: '50',
      image: 'dist/Hot Drinks/Espresso (Double).jpg',
      rating: 4.7
    },
    {
      id: 403,
      category: 'hot-drinks',
      name: { ar: 'امريكانو', en: 'Americano' },
      description: { ar: 'اسبريسو مخفف بماء ساخن.', en: 'Espresso diluted with hot water.' },
      price: '40',
      image: 'dist/Hot Drinks/Americano.jpg',
      rating: 4.4
    },
    {
      id: 404,
      category: 'hot-drinks',
      name: { ar: 'هوت موكا', en: 'Hot Mocha' },
      description: { ar: 'اسبريسو مع كاكاو وحليب ساخن.', en: 'Espresso with cocoa and steamed milk.' },
      price: '55',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 405,
      category: 'hot-drinks',
      name: { ar: 'لاتيه', en: 'Latte' },
      description: { ar: 'اسبريسو مع حليب مبخر وقليل من الرغوة.', en: 'Espresso with steamed milk and light foam.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 406,
      category: 'hot-drinks',
      name: { ar: 'فلات وايت', en: 'Flat White' },
      description: { ar: 'اسبريسو مع رغوة ناعمة وطبقة حليب رقيقة.', en: 'Velvety microfoam over espresso.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 407,
      category: 'hot-drinks',
      name: { ar: 'نسكافيه بلاك', en: 'Nescafe Black' },
      description: { ar: 'قهوة نسكافيه ساخنة بدون إضافات.', en: 'Classic black Nescafe.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1515442261605-65987759f6d9?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 408,
      category: 'hot-drinks',
      name: { ar: 'ماكياتو كراميل', en: 'Macchiato Caramel' },
      description: { ar: 'اسبرسو مع نقطة رغوة وكاراميل.', en: 'Espresso marked with foam and caramel.' },
      price: '50',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 409,
      category: 'hot-drinks',
      name: { ar: 'نسكافيه جلاكسي', en: 'Nescafe Galaxy' },
      description: { ar: 'نسكافيه مع لمسات حلاوة ونكهات مميزة.', en: 'Nescafe with a sweet, signature twist.' },
      price: '50',
      image: 'https://images.unsplash.com/photo-1515442261605-65987759f6d9?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 6,
      category: 'desserts',
      name: { ar: 'تشيز كيك لوتس', en: 'Lotus Cheesecake (duplicate placeholder)' },
      description: { ar: 'عنصر نائب بعد حذف أقسام المشروبات الباردة والفطار.', en: 'Placeholder entry after removing cold drinks and breakfast categories.' },
      price: '0',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=2670&auto=format&fit=crop',
      rating: 0
    },
    // Fresh Juices
    {
      id: 301,
      category: 'cold-juices',
      name: { ar: 'عصير مانجو فريش', en: 'Mango Fresh Juice' },
      description: { ar: 'عصير مانجو طازج ومثلّج.', en: 'Fresh chilled mango juice.' },
      price: '50',
      image: 'dist/Fresh Juices/Mango Fresh Juice.jpg',
      rating: 4.7
    },
    {
      id: 302,
      category: 'cold-juices',
      name: { ar: 'عصير فراولة فريش', en: 'Strawberry Fresh Juice' },
      description: { ar: 'عصير فراولة طازج وحلو.', en: 'Fresh strawberry juice.' },
      price: '45',
      image: 'dist/Fresh Juices/Strawberry Fresh Juice.jpg',
      rating: 4.6
    },
    {
      id: 303,
      category: 'cold-juices',
      name: { ar: 'عصير جوافة فريش', en: 'Guava Fresh Juice' },
      description: { ar: 'عصير جوافة طازج ومنعش.', en: 'Fresh guava juice.' },
      price: '50',
      image: 'dist/Fresh Juices/Guava Fresh Juice.jpg',
      rating: 4.5
    },
    {
      id: 304,
      category: 'cold-juices',
      name: { ar: 'عصير موز باللبن فريش', en: 'Banana with Milk Fresh' },
      description: { ar: 'عصير موز مخلوط مع لبن طازج.', en: 'Creamy banana milkshake-style juice.' },
      price: '65',
      image: 'dist/Fresh Juices/Banana with Milk Fresh.jpg',
      rating: 4.6
    },
    {
      id: 305,
      category: 'cold-juices',
      name: { ar: 'عصير كيوي باللبن', en: 'Kiwi with Milk' },
      description: { ar: 'كيوي مخلوط مع لبن لمذاق مميز.', en: 'Kiwi blended with milk for a silky texture.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 306,
      category: 'cold-juices',
      name: { ar: 'عصير كيوي فريش', en: 'Kiwi Fresh Juice' },
      description: { ar: 'عصير كيوي طازج ومنعش.', en: 'Fresh kiwi juice.' },
      price: '35',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.2
    },
    {
      id: 307,
      category: 'cold-juices',
      name: { ar: 'عصير ليمون فريش', en: 'Lemon Fresh Juice' },
      description: { ar: 'ليمون طازج مع لمسة سكر حسب الرغبة.', en: 'Freshly squeezed lemon juice.' },
      price: '40',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 308,
      category: 'cold-juices',
      name: { ar: 'عصير ليمون مينت', en: 'Lemon Mint' },
      description: { ar: 'ليمون مع نعناع لطيف ومنعش.', en: 'Lemon with fresh mint.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1542444459-db2f4a8f3b2a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 309,
      category: 'cold-juices',
      name: { ar: 'عصير بلح باللبن فريش', en: 'Dates with Milk Fresh' },
      description: { ar: 'خليط البلح واللبن التقليدي والمنعش.', en: 'Traditional dates blended with milk.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1604908177522-2f58f0e3b1d6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 310,
      category: 'cold-juices',
      name: { ar: 'عصير بطيخ فريش', en: 'Watermelon Fresh Juice' },
      description: { ar: 'بطيخ طازج ومنعش.', en: 'Fresh watermelon juice.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 311,
      category: 'cold-juices',
      name: { ar: 'عصير برتقال فريش', en: 'Orange Fresh Juice' },
      description: { ar: 'برتقال عصير طازج.', en: 'Freshly squeezed orange juice.' },
      price: '40',
      image: 'https://images.unsplash.com/photo-1502741126161-b048400d8d2c?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 312,
      category: 'cold-juices',
      name: { ar: 'عصير رمان فريش', en: 'Pomegranate Fresh Juice' },
      description: { ar: 'رمان طازج وحمضي حلو.', en: 'Fresh pomegranate juice.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1506812574058-fc75fa93fead?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 313,
      category: 'cold-juices',
      name: { ar: 'عصير افوكاتو فريش', en: 'Avocado Fresh' },
      description: { ar: 'عصير أفوكادو كريمي ومغذي.', en: 'Creamy avocado drink.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf4f?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 314,
      category: 'cold-juices',
      name: { ar: 'عصير كانتلوب', en: 'Cantaloupe Juice' },
      description: { ar: 'كانتلوب مهروس ومنعش.', en: 'Sweet cantaloupe juice.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2670&auto=format&fit=crop',
      rating: 4.2
    },

    // Smoothies
    {
      id: 315,
      category: 'smoothies',
      name: { ar: 'سموزي مانجو', en: 'Mango Smoothie' },
      description: { ar: 'سموزي مانجو طازج وكريمي.', en: 'Fresh creamy mango smoothie.' },
      price: '55',
      image: 'dist/Smoothies/Mango Smoothie.jpg',
      rating: 4.7
    },
    {
      id: 316,
      category: 'smoothies',
      name: { ar: 'سموزي فراولة لوزي', en: 'Almond Strawberry Smoothie' },
      description: { ar: 'فراولة مع لوز وحليب لمذاق غني.', en: 'Strawberry with almond and milk.' },
      price: '60',
      image: 'dist/Smoothies/Almond Strawberry Smoothie.jpg',
      rating: 4.6
    },
    {
      id: 317,
      category: 'smoothies',
      name: { ar: 'سموزي توت مشكل', en: 'Mixed Berry Smoothie' },
      description: { ar: 'خليط توت مشكل مع زبادي وعسل لمذاق منعش وكريمي.', en: 'A creamy mix of strawberries, blueberries and raspberries with yogurt and honey.' },
      price: '55',
      image: 'dist/Smoothies/Mixed Berry Smoothie.jpg',
      rating: 4.7
    },
    {
      id: 318,
      category: 'smoothies',
      name: { ar: 'سموزي لوزي باشن', en: 'Almond Passion Smoothie' },
      description: { ar: 'باشن فروت مع لوز لمذاق مميز.', en: 'Passion fruit with almond.' },
      price: '60',
      image: 'dist/Smoothies/Almond Passion Smoothie.jpg',
      rating: 4.5
    },
    {
      id: 319,
      category: 'smoothies',
      name: { ar: 'سموزي خوخ', en: 'Peach Smoothie' },
      description: { ar: 'خوخ طازج مع حليب لمذاق ناعم.', en: 'Fresh peach blended with milk.' },
      price: '70',
      image: 'https://images.unsplash.com/photo-1542444459-db2f4a8f3b2a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 320,
      category: 'smoothies',
      name: { ar: 'سموزي كيوي', en: 'Kiwi Smoothie' },
      description: { ar: 'كيوي طازج ومميز.', en: 'Fresh kiwi smoothie.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 321,
      category: 'smoothies',
      name: { ar: 'سموزي يوسفي', en: 'Tangerine Smoothie' },
      description: { ar: 'يوسفي مع ثلج لمذاق منعش.', en: 'Tangerine blended with ice.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 322,
      category: 'smoothies',
      name: { ar: 'سموزي بطيخ', en: 'Watermelon Smoothie' },
      description: { ar: 'بطيخ طازج ومنعش جداً.', en: 'Very refreshing watermelon smoothie.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 323,
      category: 'smoothies',
      name: { ar: 'سموزي ليمون نعناع', en: 'Lemon Mint Smoothie' },
      description: { ar: 'ليمون ونعناع لمذاق منعش وحاد.', en: 'Lemon and mint for a sharp fresh taste.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1542444459-db2f4a8f3b2a?q=80&w=2670&auto=format&fit=crop',
      rating: 4.4
    },
    {
      id: 324,
      category: 'smoothies',
      name: { ar: 'سموزي جرين ابّل لوزي', en: 'Almond Green Apple Smoothie' },
      description: { ar: 'تفاح أخضر مع لوز لطعم منعش وحاد.', en: 'Green apple with almond.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1502741126161-b048400d8d2c?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 325,
      category: 'smoothies',
      name: { ar: 'سموزي فواكه استوائية', en: 'Tropical Fruit Smoothie' },
      description: { ar: 'خليط فواكه استوائية كريمي.', en: 'Creamy mix of tropical fruits.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 326,
      category: 'smoothies',
      name: { ar: 'سموزي بلو بيري لوزي', en: 'Almond Blueberry Smoothie' },
      description: { ar: 'توت أزرق مع لمسة لوز وكريمة.', en: 'Blueberry with almond and cream.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 327,
      category: 'smoothies',
      name: { ar: 'سموزي ميكس بيري', en: 'Mixed Berry Smoothie' },
      description: { ar: 'مزيج توت مشكل كريمي ومنعش.', en: 'Creamy mixed berries.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 328,
      category: 'smoothies',
      name: { ar: 'سموزي بلو صودا', en: 'Blue Soda Smoothie' },
      description: { ar: 'سموزي مع نكهة صودا بتشبع برودة.', en: 'Smoothie with blue soda notes.' },
      price: '40',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.2
    },
    {
      id: 329,
      category: 'smoothies',
      name: { ar: 'سموزي جوافة', en: 'Guava Smoothie' },
      description: { ar: 'جوافة طازجة مع لمسة حليب.', en: 'Fresh guava with a hint of milk.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    // Mixes
    {
      id: 501,
      category: 'mixes',
      name: { ar: 'بينا كولادا', en: 'Pina Colada' },
      description: { ar: 'أناناس وحليب جوز الهند لمذاق استوائي.', en: 'Pineapple & coconut milk, tropical mix.' },
      price: '65',
      image: 'dist/Mixes/Pina Colada.jpg',
      rating: 4.7
    },
    {
      id: 502,
      category: 'mixes',
      name: { ar: 'بيري منت', en: 'Berry Mint' },
      description: { ar: 'مزيج توت ومنعش بالنعناع.', en: 'Mixed berries with fresh mint.' },
      price: '65',
      image: 'dist/Mixes/Berry Mint.jpg',
      rating: 4.6
    },
    {
      id: 503,
      category: 'mixes',
      name: { ar: 'مانجو باشن', en: 'Mango Passion' },
      description: { ar: 'مانجو مع باشن فروت لمنعش استوائي.', en: 'Mango with passion fruit.' },
      price: '65',
      image: 'dist/Mixes/Mango Passion.jpg',
      rating: 4.7
    },
    {
      id: 504,
      category: 'mixes',
      name: { ar: 'موهيتو صغير', en: 'Mojito (Small)' },
      description: { ar: 'نعناع وليمون مع لمسة فوار.', en: 'Mint & lime with a fizzy touch.' },
      price: '35',
      image: 'dist/Mixes/Mojito (Small).jpg',
      rating: 4.4
    },
    {
      id: 505,
      category: 'mixes',
      name: { ar: 'لايم كولا', en: 'Lime Cola' },
      description: { ar: 'كولا مع عصرة ليمون منعشة.', en: 'Cola with a splash of lime.' },
      price: '40',
      image: 'https://images.unsplash.com/photo-1541542684-1d2b4f0d4f9d?q=80&w=2670&auto=format&fit=crop',
      rating: 4.3
    },
    {
      id: 506,
      category: 'mixes',
      name: { ar: 'ماندرين كيوي', en: 'Mandarin Kiwi' },
      description: { ar: 'يوسفي وكيـوي لمزيج حمضي حلو.', en: 'Mandarin and kiwi, tangy & sweet.' },
      price: '45',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 507,
      category: 'mixes',
      name: { ar: 'شيري اناناس', en: 'Cherry Pineapple' },
      description: { ar: 'كرز وأناناس لمذاق استوائي وحلو.', en: 'Cherry and pineapple tropical mix.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1502741126161-b048400d8d2c?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 508,
      category: 'mixes',
      name: { ar: 'صن شاين', en: 'Sunshine' },
      description: { ar: 'مزيج فواكه صيفي ومنعش.', en: 'A sunny, refreshing fruit mix.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 509,
      category: 'mixes',
      name: { ar: 'سكوتش منت', en: 'Scotch Mint' },
      description: { ar: 'نعناع مع لمسة غنية ومنعشة.', en: 'Rich minty mix with a cool finish.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2670&auto=format&fit=crop',
      rating: 4.5
    },
    {
      id: 510,
      category: 'mixes',
      name: { ar: 'شيري كولا', en: 'Cherry Cola' },
      description: { ar: 'كولا مع نكهة الكرز اللذيذة.', en: 'Cola flavored with sweet cherry.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1541542684-1d2b4f0d4f9d?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },

    // Cold Coffee & Shakes
    {
      id: 351,
      category: 'cold-coffee',
      name: { ar: 'آيس لاتيه', en: 'Iced Latte' },
      description: { ar: 'اسبريسو مع حليب مثلج.', en: 'Espresso with chilled milk and ice.' },
      price: '55',
      image: 'dist/Cold Coffee & Shakes/Iced Latte.jpg',
      rating: 4.6
    },
    {
      id: 352,
      category: 'cold-coffee',
      name: { ar: 'آيس كابتشينو', en: 'Iced Cappuccino' },
      description: { ar: 'رغوة خفيفة مع اسبريسو مثلج.', en: 'Light foam with chilled espresso.' },
      price: '55',
      image: 'dist/Cold Coffee & Shakes/Iced Cappuccino.jpg',
      rating: 4.5
    },
    {
      id: 353,
      category: 'cold-coffee',
      name: { ar: 'شوكولاتة آيس بلاست', en: 'Cold Brew Float' },
      description: { ar: 'كولد برو مع كرة آيس كريم فانيلا لمزيج منعش وغني.', en: 'Cold brew coffee topped with a scoop of vanilla ice cream.' },
      price: '60',
      image: 'dist/Cold Coffee & Shakes/Cold Brew Float.jpg',
      rating: 4.7
    },
    {
      id: 354,
      category: 'cold-coffee',
      name: { ar: 'آيس كراميل ماكياتو', en: 'Iced Caramel Macchiato' },
      description: { ar: 'اسبريسو مع حليب مثلج وشراب كراميل.', en: 'Espresso over chilled milk with caramel drizzle.' },
      price: '50',
      image: 'dist/Cold Coffee & Shakes/Iced Caramel Macchiato.jpg',
      rating: 4.5
    },
    {
      id: 355,
      category: 'cold-coffee',
      name: { ar: 'فرابتشينو شوكلت', en: 'Frappuccino Chocolate' },
      description: { ar: 'فرابتشينو مثلج بطعم الشوكولاتة.', en: 'Iced blended Frappuccino with chocolate.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1563805042-7684bfb9a6c6?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 356,
      category: 'cold-coffee',
      name: { ar: 'فرابتشينو فاني', en: 'Frappuccino Vanilla' },
      description: { ar: 'فرابتشينو مثلج بطعم الفانيليا.', en: 'Iced blended Frappuccino with vanilla.' },
      price: '60',
      image: 'https://images.unsplash.com/photo-1542395971-7f8e4d6d2eaa?q=80&w=2670&auto=format&fit=crop',
      rating: 4.6
    },
    {
      id: 357,
      category: 'cold-coffee',
      name: { ar: 'فرابتشينو كاراميل', en: 'Frappuccino Caramel' },
      description: { ar: 'فرابتشينو بطعم الكراميل.', en: 'Iced blended Frappuccino with caramel.' },
      price: '65',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
    {
      id: 358,
      category: 'cold-coffee',
      name: { ar: 'فرابتشينو قهوة توفي', en: 'Frappuccino Coffee Toffee' },
      description: { ar: 'مزيج قهوة بطعم التوفي والحلاوة.', en: 'Coffee frappuccino with toffee notes.' },
      price: '70',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2670&auto=format&fit=crop',
      rating: 4.7
    },
  ];

  const menuItems = (() => {
    const counts: Record<string, number> = {};
    const res: any[] = [];
    for (const item of menuItemsRaw) {
      const cat = item.category as string;
      counts[cat] = (counts[cat] || 0) + 1;
      if (counts[cat] <= 4) res.push(item);
    }
    return res;
  })();

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
                   Menu
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
