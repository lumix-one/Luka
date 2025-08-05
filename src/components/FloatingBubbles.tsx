
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
}

export function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 8; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 60 + 20,
          left: Math.random() * 100,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 5,
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
            }
          }
        `}
      </style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: '-100px',
              animationName: 'float-up',
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
            }}
          />
        ))}
      </div>
    </>
  );
}
