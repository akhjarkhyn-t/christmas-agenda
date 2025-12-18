import { useState, useEffect, useRef } from 'react';
import { afterPartyData } from '../data/afterPartyData';

const AfterParty = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Calculate progress: fade in when section enters viewport
      let progress = 0;
      
      // Start fading when section top is at 80% of viewport, fully visible at 40%
      const startFade = windowHeight * 0.8;
      const endFade = windowHeight * 0.4;
      
      if (sectionTop < startFade && sectionTop > -sectionHeight) {
        if (sectionTop <= endFade) {
          // Fully visible - ensure progress is 1
          progress = 1;
        } else {
          // Fading in
          progress = Math.min(1, (startFade - sectionTop) / (startFade - endFade));
        }
      } else if (sectionTop <= -sectionHeight) {
        // Section is above viewport - fully visible
        progress = 1;
      } else if (sectionTop >= 0 && sectionTop < windowHeight * 0.5) {
        // Section is well within viewport - ensure fully visible
        progress = 1;
      }
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity and transform based on scroll progress
  // Background fades as content appears
  const backgroundOpacity = Math.max(0, Math.min(1, 1 - scrollProgress * 0.8));
  
  // Title appears first (starts at 0.2 progress, fully visible at 0.5)
  const titleProgress = Math.max(0, Math.min(1, (scrollProgress - 0.2) / 0.3));
  const titleOpacity = scrollProgress >= 0.5 ? 1 : titleProgress;
  const titleTransform = `translateY(${30 * (1 - titleProgress)}px)`;
  
  // Content appears after title (starts at 0.4 progress, fully visible at 0.7)
  const contentProgress = Math.max(0, Math.min(1, (scrollProgress - 0.4) / 0.3));
  const contentOpacity = scrollProgress >= 0.7 ? 1 : contentProgress;
  const contentTransform = `translateY(${50 * (1 - contentProgress)}px)`;

  return (
    <div ref={sectionRef} className="relative w-full min-h-screen overflow-hidden">
      {/* Animated Background Section */}
      <div 
        className="absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ease-out"
        style={{ opacity: backgroundOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900 to-blue-800">
          {/* Animated background image overlay */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `url(${afterPartyData[0]?.image || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&h=1080&fit=crop'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animation: 'kenBurns 20s ease-in-out infinite alternate'
            }}
          />
          {/* Animated gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, rgba(30, 58, 138, 0.4), rgba(30, 64, 175, 0.4), rgba(37, 99, 235, 0.4))',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 8s ease infinite'
            }}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 pt-12 md:pt-16 pb-12 md:pb-16 px-4 md:px-8 min-h-[400px]">
        {/* Title with scroll animation */}
        <h2 
          ref={titleRef}
          className="text-2xl md:text-3xl font-bold text-white mb-8 text-center transition-opacity duration-700 ease-out"
          style={{ 
            opacity: titleOpacity,
            transform: titleTransform,
            willChange: 'opacity, transform'
          }}
        >
          Афтерпарти?
        </h2>
        
        {/* Content with scroll animation */}
        <div 
          ref={contentRef}
          className="overflow-x-auto scrollbar-hide transition-opacity duration-700 ease-out"
          style={{ 
            opacity: contentOpacity,
            transform: contentTransform,
            willChange: 'opacity, transform'
          }}
        >
          <div className="flex gap-4 md:gap-6 pb-4">
            {afterPartyData.map((venue, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-64 md:w-80 bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800/50"
              >
                {/* Image */}
                <div className="w-full h-40 md:h-48 overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className={`w-full h-full object-cover hover:scale-110 transition-all duration-300 ${
                      venue.blur ? 'blur-sm hover:blur-none' : ''
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-medium text-white mb-2">
                    {venue.name}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 mb-4">
                    {venue.address}
                  </p>
                  
                  {/* Walking Time */}
                  <div className="flex items-center gap-2 text-sm md:text-base text-gray-300">
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>{venue.walkingTime} walk</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-2%, -2%);
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default AfterParty;

