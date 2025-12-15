import { useEffect, useRef } from 'react';

const Hero = () => {
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);
  const snowflakesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fireworks class
    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.5);
        this.speed = 2 + Math.random() * 3;
        this.particles = [];
        this.exploded = false;
        this.hue = Math.random() * 360;
      }

      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          // Update particles (reverse loop to avoid index issues when removing)
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            particle.vx *= 0.98; // friction
            particle.vy *= 0.98;
            particle.life--;
            
            if (particle.life <= 0) {
              this.particles.splice(i, 1);
            }
          }
        }
      }

      explode() {
        this.exploded = true;
        const particleCount = 50 + Math.random() * 30; // More particles
        for (let i = 0; i < particleCount; i++) {
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: (Math.random() - 0.5) * 10, // Faster spread
            vy: (Math.random() - 0.5) * 10,
            life: 80 + Math.random() * 50, // Longer life
            hue: this.hue + (Math.random() - 0.5) * 30,
            size: 3 + Math.random() * 3, // Bigger particles
          });
        }
      }

      draw() {
        if (!this.exploded) {
          // Make rocket more visible
          ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
          ctx.fill();
          // Add glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        } else {
          ctx.shadowBlur = 0; // Reset shadow
          this.particles.forEach((particle) => {
            const alpha = particle.life / 130;
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            // Add glow to particles
            ctx.shadowBlur = 5;
            ctx.shadowColor = `hsla(${particle.hue}, 100%, 60%, ${alpha * 0.5})`;
          });
          ctx.shadowBlur = 0;
        }
      }
    }

    // Snowflake class with actual snowflake pattern
    class Snowflake {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 4 + 3; // Larger size for visibility
        this.speed = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.6;
        this.wind = (Math.random() - 0.5) * 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y += this.speed;
        this.x += this.wind + Math.sin(this.y * 0.01) * 0.2;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
        if (this.x > canvas.width) {
          this.x = 0;
        } else if (this.x < 0) {
          this.x = canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();

        // Draw 6-pointed snowflake
        const branches = 6;
        const radius = this.size;
        
        for (let i = 0; i < branches; i++) {
          const angle = (Math.PI * 2 * i) / branches;
          
          // Main branch
          ctx.moveTo(0, 0);
          ctx.lineTo(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius
          );
          
          // Side branches
          const sideBranchLength = radius * 0.4;
          const sideAngle1 = angle + Math.PI / 6;
          const sideAngle2 = angle - Math.PI / 6;
          
          ctx.moveTo(
            Math.cos(angle) * radius * 0.6,
            Math.sin(angle) * radius * 0.6
          );
          ctx.lineTo(
            Math.cos(angle) * radius * 0.6 + Math.cos(sideAngle1) * sideBranchLength,
            Math.sin(angle) * radius * 0.6 + Math.sin(sideAngle1) * sideBranchLength
          );
          
          ctx.moveTo(
            Math.cos(angle) * radius * 0.6,
            Math.sin(angle) * radius * 0.6
          );
          ctx.lineTo(
            Math.cos(angle) * radius * 0.6 + Math.cos(sideAngle2) * sideBranchLength,
            Math.sin(angle) * radius * 0.6 + Math.sin(sideAngle2) * sideBranchLength
          );
        }
        
        ctx.stroke();
        ctx.restore();
      }
    }

    // Initialize fewer snowflakes (15-20 instead of 100)
    const snowflakeCount = 18;
    for (let i = 0; i < snowflakeCount; i++) {
      snowflakesRef.current.push(new Snowflake());
    }

    // Animation loop
    const animate = () => {
      // Clear canvas completely to prevent snowflake trails
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Redraw background gradient (dark blue)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000000');
      gradient.addColorStop(0.5, '#001133');
      gradient.addColorStop(1, '#003366');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw snowflakes (no trails)
      snowflakesRef.current.forEach((snowflake) => {
        snowflake.update();
        snowflake.draw();
      });

      // Add new firework more frequently and noticeably
      if (Math.random() < 0.06 && fireworksRef.current.length < 12) {
        fireworksRef.current.push(new Firework());
      }

      // Update and draw fireworks (reverse loop to avoid index issues)
      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const firework = fireworksRef.current[i];
        firework.update();
        firework.draw();

        // Remove exploded fireworks with no particles
        if (firework.exploded && firework.particles.length === 0) {
          fireworksRef.current.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'linear-gradient(to bottom, #000000, #001133, #003366)' }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-blue-900/80" />

      {/* Beautiful clouds at the top */}
      <div className="absolute top-0 left-0 right-0 h-48 z-5 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1920 192" preserveAspectRatio="xMidYMin slice">
          <defs>
            <filter id="cloudBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
            </filter>
          </defs>
          
          {/* Cloud 1 - Left */}
          <g className="opacity-60" style={{ filter: 'url(#cloudBlur)' }}>
            <path d="M 100 80 Q 120 60, 150 65 Q 180 60, 200 75 Q 220 55, 250 60 Q 280 50, 300 70 Q 320 50, 340 65 Q 360 55, 380 75 Q 400 60, 420 80 L 420 100 L 100 100 Z" 
                  fill="rgba(255, 255, 255, 0.15)" />
          </g>
          
          {/* Cloud 2 - Center Left */}
          <g className="opacity-50" style={{ filter: 'url(#cloudBlur)' }}>
            <path d="M 600 50 Q 630 30, 670 40 Q 710 25, 750 45 Q 790 30, 830 50 Q 870 35, 910 55 Q 950 40, 980 60 L 980 85 L 600 85 Z" 
                  fill="rgba(255, 255, 255, 0.18)" />
          </g>
          
          {/* Cloud 3 - Center */}
          <g className="opacity-55" style={{ filter: 'url(#cloudBlur)' }}>
            <path d="M 1100 70 Q 1130 50, 1170 60 Q 1210 45, 1250 65 Q 1290 50, 1330 70 Q 1370 55, 1410 75 Q 1450 60, 1480 80 L 1480 100 L 1100 100 Z" 
                  fill="rgba(255, 255, 255, 0.16)" />
          </g>
          
          {/* Cloud 4 - Right */}
          <g className="opacity-45" style={{ filter: 'url(#cloudBlur)' }}>
            <path d="M 1600 60 Q 1630 40, 1670 50 Q 1710 35, 1750 55 Q 1790 40, 1820 60 L 1820 85 L 1600 85 Z" 
                  fill="rgba(255, 255, 255, 0.14)" />
          </g>
        </svg>
      </div>

      {/* Golomt Building with fence and snow-covered trees */}
      <div className="absolute bottom-0 left-0 right-0 h-80 z-5">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1920 320" preserveAspectRatio="xMidYMax slice">
          {/* Ground/Snow base */}
          <rect x="0" y="280" width="1920" height="40" fill="#e8f4f8" opacity="0.3" />
          
          {/* Fence - Behind trees */}
          <g>
            {/* Fence posts */}
            <rect x="400" y="200" width="8" height="80" fill="#000000" />
            <rect x="500" y="200" width="8" height="80" fill="#000000" />
            <rect x="600" y="200" width="8" height="80" fill="#000000" />
            <rect x="700" y="200" width="8" height="80" fill="#000000" />
            <rect x="800" y="200" width="8" height="80" fill="#000000" />
            <rect x="900" y="200" width="8" height="80" fill="#000000" />
            <rect x="1000" y="200" width="8" height="80" fill="#000000" />
            <rect x="1100" y="200" width="8" height="80" fill="#000000" />
            <rect x="1200" y="200" width="8" height="80" fill="#000000" />
            <rect x="1300" y="200" width="8" height="80" fill="#000000" />
            <rect x="1400" y="200" width="8" height="80" fill="#000000" />
            {/* Horizontal rails */}
            <rect x="400" y="220" width="1000" height="6" fill="#000000" />
            <rect x="400" y="250" width="1000" height="6" fill="#000000" />
            <rect x="400" y="200" width="1000" height="6" fill="#000000" />
          </g>
          
          {/* Snow-covered Tree 1 - Left - In front of fence */}
          <g transform="translate(300, 0)">
            {/* Tree trunk */}
            <rect x="200" y="240" width="12" height="40" fill="#4a3728" />
            {/* Tree branches with snow */}
            <path d="M 206 240 Q 180 220, 160 200 Q 140 180, 120 200 Q 100 220, 120 240 Q 140 260, 160 240 Q 180 220, 200 240 Z" fill="#2d5016" />
            <path d="M 206 240 Q 230 220, 250 200 Q 270 180, 290 200 Q 310 220, 290 240 Q 270 260, 250 240 Q 230 220, 206 240 Z" fill="#2d5016" />
            {/* Snow on branches */}
            <ellipse cx="160" cy="200" rx="25" ry="20" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="250" cy="200" rx="25" ry="20" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="206" cy="180" rx="20" ry="18" fill="rgba(255, 255, 255, 0.9)" />
          </g>
          
          {/* Snow-covered Tree 2 - Right - In front of fence */}
          <g transform="translate(-200, 0)">
            {/* Tree trunk */}
            <rect x="1600" y="250" width="12" height="30" fill="#4a3728" />
            {/* Tree branches with snow */}
            <path d="M 1606 250 Q 1580 230, 1560 210 Q 1540 190, 1520 210 Q 1500 230, 1520 250 Q 1540 270, 1560 250 Q 1580 230, 1606 250 Z" fill="#2d5016" />
            <path d="M 1606 250 Q 1630 230, 1650 210 Q 1670 190, 1690 210 Q 1710 230, 1690 250 Q 1670 270, 1650 250 Q 1630 230, 1606 250 Z" fill="#2d5016" />
            {/* Snow on branches */}
            <ellipse cx="1560" cy="210" rx="22" ry="18" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="1650" cy="210" rx="22" ry="18" fill="rgba(255, 255, 255, 0.9)" />
            <ellipse cx="1606" cy="190" rx="18" ry="16" fill="rgba(255, 255, 255, 0.9)" />
          </g>
          
          {/* Golomt Building SVG - Positioned at bottom, centered and aligned with ground */}
          <g transform="translate(960, -180) scale(1.4)">
            <image 
              href="/golomt-building.svg" 
              x="-250" 
              y="0" 
              width="500" 
              height="500"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 animate-pulse">
            AGENDA
          </h1>
          <p className="text-4xl md:text-6xl lg:text-7xl text-white/90" style={{ fontFamily: "'MOGUL Script', cursive" }}>
            Шинэ Жил 2025
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => {
          const nextSection = document.querySelector('[data-section="agenda"]');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce cursor-pointer hover:scale-110 transition-transform"
        aria-label="Scroll to agenda"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </div>
  );
};

export default Hero;

