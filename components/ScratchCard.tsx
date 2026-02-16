
import React, { useEffect, useRef, useState } from 'react';

interface ScratchCardProps {
  revealText: string;
  subText: string;
  onScratched?: () => void;
}

const ScratchCard: React.FC<ScratchCardProps> = ({ revealText, subText, onScratched }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const lastCheckRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play scratch sound
  // const playScratchSound = () => {
  //   if (!audioContextRef.current) return;
  //
  //   const ctx = audioContextRef.current;
  //   const oscillator = ctx.createOscillator();
  //   const gainNode = ctx.createGain();
  //
  //   oscillator.connect(gainNode);
  //   gainNode.connect(ctx.destination);
  //
  //   oscillator.type = 'triangle';
  //   oscillator.frequency.setValueAtTime(100 + Math.random() * 50, ctx.currentTime);
  //
  //   gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
  //   gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  //
  //   oscillator.start(ctx.currentTime);
  //   oscillator.stop(ctx.currentTime + 0.05);
  // };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
        
        // Redraw overlay
        // ctx.fillStyle = '#FFD700'; // Gold color
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0.1, '#E0AA3E');
        gradient.addColorStop(0.75, '#FEFE68');
        gradient.addColorStop(1, '#F3A80A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some noise/texture
        for (let i = 0; i < 500; i++) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
        }

        ctx.font = '20px Montserrat';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        // ctx.fillText('OGREBI ZA DATUM', canvas.width / 2, canvas.height / 2 + 7);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isDone) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    // Play scratch sound
    // playScratchSound();

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    const now = Date.now();
    if (now - lastCheckRef.current > 100) {
      lastCheckRef.current = now;
      checkScratched();
    }
  };

  const checkScratched = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparentPixels++;
    }

    const percentage = (transparentPixels / (pixels.length / 4)) * 100;
    if (percentage > 60 && !isDone) {
      setIsDone(true);
      if (onScratched) onScratched();
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    scratch(e);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDrawing) scratch(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-md h-48 mx-auto bg-white rounded-lg shadow-inner overflow-hidden flex flex-col items-center justify-center p-6 border-2 border-[#d4af37]/30"
    >
      {/* Revealed Content */}
      <div className="text-center z-0">
        <h3 className="text-3xl font-serif text-[#d4af37] mb-2">{revealText}</h3>
        <p className="text-sm tracking-widest text-[#7a7a7a] uppercase">{subText}</p>
      </div>

      {/* Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 cursor-crosshair transition-opacity duration-500 z-10 touch-none ${isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
    </div>
  );
};

export default ScratchCard;
