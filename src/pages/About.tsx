import { motion } from 'motion/react';
import { Section } from '../components/ui/Section';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Coffee, Users } from 'lucide-react';

export default function About() {
  const { language } = useLanguage();

  return (
    <div className="pt-48 min-h-screen bg-rose-light overflow-hidden">
      <Section className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-blush/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
          
          {/* Text Content */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-1 bg-rose-blush rounded-full"></div>
                <span className="text-rose-blush font-bold uppercase tracking-widest">
                  {language === 'ar' ? 'من نحن' : 'WHO WE ARE'}
                </span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-espresso mb-8 leading-[1.1]">
                {language === 'ar' ? (
                  <>
                    حكايتنا بدأت <br/>
                    <span className="text-rose-blush">بفنجان قهوة</span>
                  </>
                ) : (
                  <>
                    Our Story Started <br/>
                    <span className="text-rose-blush">With Coffee</span>
                  </>
                )}
              </h2>
              
              <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg md:text-xl">
                <p>
                  {language === 'ar' 
                    ? 'في ديسباسيتو، الموضوع مش بس قهوة وحلو. إحنا بنبيع "لحظة روقان". كل تفصيلة في المكان معمولة عشان تفصلك عن دوشة اليوم وتخليك تستمتع بكل رشفة وكل قطمة.'
                    : 'At Despacito, it’s not just about coffee and sweets. We sell "moments of peace". Every detail is designed to disconnect you from the daily noise and let you enjoy every sip and bite.'}
                </p>
                <p>
                  {language === 'ar'
                    ? 'سواء جاي تذاكر، تشتغل، أو تقابل صحابك، مكاننا بيتك. بنهتم بأدق التفاصيل، من أول نوع البن لحد ابتسامة الباريستا وهو بيقدم لك طلبك.'
                    : 'Whether you are studying, working, or meeting friends, our place is your home. We care about every detail, from the bean quality to the barista’s smile.'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { icon: <Coffee size={24} />, label: { ar: 'قهوة مميزة', en: 'Premium Coffee' } },
                  { icon: <Heart size={24} />, label: { ar: 'معمول بحب', en: 'Made with Love' } },
                  { icon: <Users size={24} />, label: { ar: 'مجتمعنا', en: 'Community' } },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-rose-blush border border-rose-100">
                      {item.icon}
                    </div>
                    <span className="font-bold text-sm text-espresso">{item.label[language as 'ar'|'en']}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-white p-6 rounded-[2rem] shadow-lg border border-rose-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-blush"></div>
                <p className="font-script text-3xl text-cocoa italic relative z-10">
                  {language === 'ar'
                    ? '"ديسباسيتو.. مش مجرد كافيه، ده حالة حب."'
                    : '"Despacito.. not just a café, it’s a state of love."'}
                </p>
                <div className="absolute -bottom-4 -right-4 text-rose-100 opacity-50">
                  <Heart size={100} fill="currentColor" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Content - Collage */}
          <div className="lg:w-1/2 order-1 lg:order-2 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 mt-12"
              >
                <img 
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop" 
                  alt="Barista" 
                  className="w-full h-64 object-cover rounded-[2.5rem] shadow-xl"
                />
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop" 
                  alt="Interior" 
                  className="w-full h-48 object-cover rounded-[2.5rem] shadow-xl"
                />
              </motion.div>
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-4"
              >
                <img 
                  src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2671&auto=format&fit=crop" 
                  alt="Coffee" 
                  className="w-full h-48 object-cover rounded-[2.5rem] shadow-xl"
                />
                <img 
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop" 
                  alt="Vibe" 
                  className="w-full h-64 object-cover rounded-[2.5rem] shadow-xl"
                />
              </motion.div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-2xl border-4 border-rose-50 z-20">
              <div className="w-24 h-24 bg-rose-blush rounded-full flex items-center justify-center text-white text-center font-bold leading-tight border-2 border-white border-dashed">
                {language === 'ar' ? 'منذ ٢٠٢٠' : 'Est. 2020'}
              </div>
            </div>
          </div>

        </div>
      </Section>
    </div>
  );
}
