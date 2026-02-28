import { motion } from 'motion/react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-espresso flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 2.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="relative flex flex-col items-center">
        {/* Circular Logo Motion */}
        <div className="relative w-24 h-24 mb-8">
          <motion.div
            className="absolute inset-0 border-2 border-white/10 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            className="absolute inset-0 border-t-2 border-gold rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 border-r-2 border-rose-blush rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-3xl text-white font-bold">D</span>
          </div>
        </div>

        {/* Text Reveal */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-serif text-3xl text-cream tracking-widest"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Despacito
          </motion.h1>
        </div>
        
        <motion.p
          className="text-gold/80 font-script text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Elegant Indulgence
        </motion.p>
      </div>
    </motion.div>
  );
}
