import { useEffect, useRef, useState } from 'react';

const TimelineItem = ({ item, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Bidirectional: show when entering viewport, hide when leaving
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className={`relative flex items-center mb-12 md:mb-16 ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } transition-all duration-700 ease-out`}
    >
      {/* Content Card */}
      <div
        className={`w-[calc(50%-20px)] md:w-[calc(50%-30px)] ${
          isLeft ? 'pr-4 md:pr-6' : 'pl-4 md:pl-6'
        }`}
      >
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-gray-800/50">
          {/* Time */}
          <div className="text-2xl md:text-3xl font-bold text-white mb-2">
            {item.time}
          </div>

          {/* Title */}
          <div className="text-lg md:text-xl font-medium text-white mb-2">
            {item.title}
          </div>

          {/* Description */}
          {item.description && (
            <div className="text-sm md:text-base text-gray-400 mb-4">
              {item.description}
            </div>
          )}

          {/* Image */}
          {item.image && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className={`w-full h-32 md:h-48 object-cover rounded-lg transition-all duration-300 ${
                  // If blur is enabled, start blurred and reveal on hover.
                  // Otherwise, keep images full-color (no default grayscale).
                  item.blur ? 'blur-sm hover:blur-none' : ''
                }`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Timeline Dot */}
      <div className="relative z-10 flex-shrink-0 w-10 md:w-12 flex items-center justify-center">
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-lg shadow-white/50 ring-2 ring-white/20"></div>
      </div>

      {/* Spacer for right side */}
      <div className={`w-[calc(50%-20px)] md:w-[calc(50%-30px)] ${isLeft ? '' : 'hidden'}`}></div>
    </div>
  );
};

export default TimelineItem;

