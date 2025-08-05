
import { useState, useEffect } from "react";

export function AnimatedLogo({ size = 32 }: { size?: number }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={`transition-all duration-1000 ${isAnimating ? 'animate-pulse scale-110' : ''}`}
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="lukaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#lukaGradient)"
          filter="url(#glow)"
          className={`transition-all duration-1000 ${isAnimating ? 'animate-spin' : ''}`}
        />
        
        {/* Letter L */}
        <path
          d="M25 25 L25 75 L45 75 M35 65 L55 65"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          className={`transition-all duration-500 ${isAnimating ? 'stroke-dasharray-[200] animate-[dash_2s_ease-in-out]' : ''}`}
        />
        
        {/* AI Neural network dots */}
        <circle cx="65" cy="35" r="3" fill="white" className={`transition-all duration-300 ${isAnimating ? 'animate-ping' : ''}`} />
        <circle cx="75" cy="45" r="2" fill="white" className={`transition-all duration-300 delay-100 ${isAnimating ? 'animate-ping' : ''}`} />
        <circle cx="70" cy="55" r="2.5" fill="white" className={`transition-all duration-300 delay-200 ${isAnimating ? 'animate-ping' : ''}`} />
        
        {/* Connection lines */}
        <path
          d="M65 35 L75 45 M75 45 L70 55 M65 35 L70 55"
          stroke="white"
          strokeWidth="1"
          opacity="0.6"
          className={`transition-all duration-1000 ${isAnimating ? 'opacity-100 animate-pulse' : ''}`}
        />
      </svg>
      
      {/* Floating particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 left-2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
          <div className="absolute top-4 right-3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75" />
          <div className="absolute bottom-3 left-4 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-150" />
        </div>
      )}
    </div>
  );
}
