import { useState, useEffect, useRef } from 'react';
import { agendaData } from '../data/agendaData';
import TimelineItem from './TimelineItem';

const AgendaTimeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      
      // Calculate progress: very gradual fade-in starting when section is 50% down viewport
      let progress = 0;
      
      // Start fading in when section top is at 80% of viewport height
      const startFade = windowHeight * 0.8;
      const endFade = windowHeight * 0.2;
      
      if (sectionTop < startFade && sectionTop > endFade) {
        // Gradual fade: 0 at startFade, 1 at endFade
        progress = (startFade - sectionTop) / (startFade - endFade);
      } else if (sectionTop <= endFade) {
        progress = 1;
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity and transform for very smooth, gradual appearance
  const sectionOpacity = Math.max(0, Math.min(1, scrollProgress));
  const sectionTransform = `translateY(${Math.max(0, 30 * (1 - scrollProgress))}px)`;

  return (
    <div 
      ref={sectionRef}
      data-section="agenda"
      className="relative min-h-screen w-full py-8 md:py-16 px-4 md:px-8 transition-opacity duration-1000 ease-out"
      style={{ 
        opacity: sectionOpacity,
        transform: sectionTransform,
        willChange: 'opacity, transform',
        // Match hero gradient exactly: continues from #003366 (hero bottom) and goes darker (dark blue)
        background: 'linear-gradient(to bottom, #003366, #001133, #000822, #000000)'
      }}
    >
      
      {/* Center Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-transparent via-white/30 to-transparent transform -translate-x-1/2"></div>

      {/* Timeline Items Container */}
      <div className="relative max-w-6xl mx-auto">
        {agendaData.map((item, index) => (
          <TimelineItem key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AgendaTimeline;

