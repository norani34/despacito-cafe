import { Section } from '../components/ui/Section';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export default function Contact() {
  const { t } = useLanguage();

  const contactCards = [
    {
      icon: <MapPin size={32} />,
      title: t('contact.location'),
      content: t('contact.address'),
      color: 'bg-rose-100 text-rose-600',
      delay: 0.1
    },
    {
      icon: <Phone size={32} />,
      title: t('contact.phone'),
      content: '0102 004 0656',
      color: 'bg-blue-100 text-blue-600',
      delay: 0.2
    },
    {
      icon: <Clock size={32} />,
      title: t('contact.hours'),
      content: t('contact.daily'),
      color: 'bg-yellow-100 text-yellow-600',
      delay: 0.3
    }
  ];

  return (
    <div className="pt-32 min-h-screen bg-rose-surface overflow-hidden">
      <Section className="container mx-auto px-6 pb-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif text-espresso mb-6"
          >
            {t('contact.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-espresso/60 font-light max-w-2xl mx-auto"
          >
            We'd love to hear from you. Drop by for a coffee or send us a message.
          </motion.p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {contactCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: card.delay }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white/50 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300"
            >
              <div className={`p-6 rounded-full mb-6 ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <h3 className="text-2xl font-serif text-espresso mb-3">{card.title}</h3>
              <p className="text-espresso/60 font-medium text-lg">{card.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white h-[500px] group"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3458.696196238384!2d30.8400!3d29.3080!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDE4JzI4LjgiTiAzMMKwNTAnMjQuMCJF!5e0!3m2!1sen!2seg!4v1625000000000!5m2!1sen!2seg" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
          
          <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-lg max-w-xs hidden md:block">
            <h4 className="font-serif text-xl text-espresso mb-2">Find Us Here</h4>
            <p className="text-sm text-espresso/60">Come say hi! We are located in the heart of the city.</p>
          </div>
        </motion.div>

        {/* Socials */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-serif text-espresso mb-8">Follow Our Vibe</h3>
          <div className="flex justify-center gap-6">
            <a href="#" className="p-4 bg-white rounded-full text-rose-dark shadow-md hover:bg-rose-dark hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Instagram size={24} />
            </a>
            <a href="#" className="p-4 bg-white rounded-full text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Facebook size={24} />
            </a>
            <a href="#" className="p-4 bg-white rounded-full text-espresso shadow-md hover:bg-espresso hover:text-white transition-all duration-300 hover:-translate-y-1">
              <Mail size={24} />
            </a>
          </div>
        </div>

      </Section>
    </div>
  );
}
