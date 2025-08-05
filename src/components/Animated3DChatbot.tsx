
import { useState, useEffect } from "react";

export function Animated3DChatbot({ size = 120 }: { size?: number }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 3000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className={`transition-all duration-1000 ${isAnimating ? 'animate-bounce' : ''}`}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          className={`drop-shadow-2xl transition-all duration-2000 ${isAnimating ? 'animate-spin' : ''}`}
        >
          <defs>
            <linearGradient id="chatbotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="30%" stopColor="#3B82F6" />
              <stop offset="60%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <filter id="glow3d">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Robot Head */}
          <ellipse
            cx="60"
            cy="45"
            rx="35"
            ry="30"
            fill="url(#chatbotGradient)"
            filter="url(#shadow)"
            className={`transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}
          />
          
          {/* Eyes */}
          <circle
            cx="50"
            cy="38"
            r="4"
            fill="white"
            className={`transition-all duration-500 ${isAnimating ? 'animate-ping' : ''}`}
          />
          <circle
            cx="70"
            cy="38"
            r="4"
            fill="white"
            className={`transition-all duration-500 delay-100 ${isAnimating ? 'animate-ping' : ''}`}
          />
          
          {/* Eye pupils */}
          <circle cx="50" cy="38" r="2" fill="#1F2937" />
          <circle cx="70" cy="38" r="2" fill="#1F2937" />
          
          {/* Mouth */}
          <path
            d="M 50 50 Q 60 55 70 50"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className={`transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}
          />
          
          {/* Antenna */}
          <line
            x1="60"
            y1="15"
            x2="60"
            y2="5"
            stroke="url(#chatbotGradient)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="5"
            r="3"
            fill="#EF4444"
            className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
          />
          
          {/* Body */}
          <rect
            x="35"
            y="65"
            width="50"
            height="40"
            rx="8"
            fill="url(#chatbotGradient)"
            filter="url(#shadow)"
            className={`transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}
          />
          
          {/* Chest panel */}
          <rect
            x="45"
            y="75"
            width="30"
            height="20"
            rx="3"
            fill="rgba(255,255,255,0.2)"
          />
          
          {/* Control buttons */}
          <circle cx="52" cy="82" r="2" fill="#10B981" className={isAnimating ? 'animate-ping' : ''} />
          <circle cx="60" cy="82" r="2" fill="#F59E0B" className={isAnimating ? 'animate-ping delay-75' : ''} />
          <circle cx="68" cy="82" r="2" fill="#EF4444" className={isAnimating ? 'animate-ping delay-150' : ''} />
          
          {/* Arms */}
          <ellipse
            cx="25"
            cy="75"
            rx="8"
            ry="15"
            fill="url(#chatbotGradient)"
            className={`transition-all duration-1000 ${isAnimating ? 'animate-bounce' : ''}`}
          />
          <ellipse
            cx="95"
            cy="75"
            rx="8"
            ry="15"
            fill="url(#chatbotGradient)"
            className={`transition-all duration-1000 delay-100 ${isAnimating ? 'animate-bounce' : ''}`}
          />
          
          {/* Neural network connections */}
          <g className={`transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-60'}`}>
            <path
              d="M45 85 L55 88 M55 88 L65 85 M55 88 L60 95"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              className={isAnimating ? 'animate-pulse' : ''}
            />
          </g>
        </svg>
      </div>
      
      {/* Floating particles */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75" />
          <div className="absolute bottom-8 left-4 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-150" />
          <div className="absolute bottom-4 right-8 w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200" />
        </div>
      )}
    </div>
  );
}
