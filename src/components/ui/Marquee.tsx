interface MarqueeProps {
  text: string;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({ text, className = '' }: MarqueeProps) {
  return (
    <div className={`relative flex overflow-hidden py-2 bg-transparent ${className}`} dir="ltr">
      <div className="flex whitespace-nowrap w-full justify-center items-center">
        {/* Static design - repeated text */}
        {[...Array(6)].map((_, i) => (
          <span key={i} className="mx-4 md:mx-8 flex items-center">
            {text} <span className="mx-4 opacity-50">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
