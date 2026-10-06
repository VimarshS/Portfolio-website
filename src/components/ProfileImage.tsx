import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src = '/profile.jpg',
  alt = 'Vimarsh Srivastava',
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Subtle 3D tilt calculation on desktop hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6; // max 6deg
    const rotateY = ((x - centerX) / centerX) * 6;  // max 6deg

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className={`relative group select-none ${className}`}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer ambient glow reacting to hover */}
      <div 
        className={`absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/10 to-transparent blur-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-80' : 'opacity-40'
        }`}
        aria-hidden="true"
      />

      {/* Main card container with 3D tilt transform */}
      <div
        className="relative w-[210px] h-[260px] sm:w-[250px] sm:h-[310px] lg:w-[290px] lg:h-[350px] rounded-2xl sm:rounded-3xl bg-[#0d0d12] border border-neutral-800 p-2 sm:p-2.5 shadow-2xl transition-all duration-300 ease-out group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        {/* Inner frame */}
        <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-800/60">
          {!imageError ? (
            <>
              {/* Profile Image */}
              <img
                src={src}
                alt={alt}
                width={540}
                height={960}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />

              {/* Gradient scrim for depth */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" 
                aria-hidden="true"
              />

              {/* Light flare sweep on hover */}
              <div 
                className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-500 pointer-events-none ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />
            </>
          ) : null}

          {/* Fallback state: if /profile.jpg hasn't been uploaded yet */}
          {(imageError || !imageLoaded) && (
            <div 
              className={`absolute inset-0 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-[#111116] via-[#0d0d12] to-[#070709] transition-opacity duration-300 ${
                imageError ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Subtle top decoration */}
              <div className="w-full flex items-center justify-between text-neutral-500 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-indigo-400" />
                  <span>vimarsh.dev</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              {/* Central stylized monogram */}
              <div className="relative my-auto flex flex-col items-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center shadow-inner group-hover:border-indigo-400/60 transition-colors">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
                  <span className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                    VS
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-xs sm:text-sm font-bold font-display text-white">
                    Vimarsh Srivastava
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Software Engineer
                  </div>
                </div>
              </div>

              {/* Bottom engineering note */}
              <div className="w-full text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
                  <span>/public/profile.jpg</span>
                </span>
              </div>
            </div>
          )}

          {/* Location & Status Floating Capsule */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-neutral-300 pointer-events-none">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lucknow, IN</span>
            </span>
            <span className="font-mono text-neutral-400 text-[10px]">
              SWE / Full Stack
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
