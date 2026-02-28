import { Section } from '../components/ui/Section';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

const IMAGES = [
  { src: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2670&auto=format&fit=crop", alt: "Coffee Art" },
  { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2670&auto=format&fit=crop", alt: "Cafe Interior" },
  { src: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=2670&auto=format&fit=crop", alt: "Cupcake" },
  { src: "https://images.unsplash.com/photo-1461023058943-48db09b9acb9?q=80&w=2670&auto=format&fit=crop", alt: "Dessert Plate" },
  { src: "https://images.unsplash.com/photo-1507133750069-69d3cdad19a5?q=80&w=2670&auto=format&fit=crop", alt: "Latte Pour" },
  { src: "https://images.unsplash.com/photo-1615719413546-198b25453f85?q=80&w=2536&auto=format&fit=crop", alt: "Croissant" },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2647&auto=format&fit=crop", alt: "Ambience" },
  { src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop", alt: "Social" },
];

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <div className="pt-48 min-h-screen bg-rose-light">
      <Section className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-serif text-cocoa mb-6">
            {t('nav.gallery')}
          </h2>
          <div className="w-24 h-1 bg-rose-blush mx-auto rounded-full"></div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {IMAGES.map((img, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-2xl break-inside-avoid shadow-lg group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-rose-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                <span className="text-white font-serif text-xl tracking-wider border border-white px-6 py-2 rounded-full">
                  Despacito
                </span>
              </div>
              <img 
                src={img.src} 
                alt={img.alt} 
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>
      </Section>
    </div>
  );
}
