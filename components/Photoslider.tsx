import React, { useState, useEffect, useRef } from 'react';

interface Slide {
    url: string;
    caption?: string;
}

const slides: Slide[] = [
    {
        url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&q=80',
        caption: 'Zajedno zauvijek',
    },
    {
        url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1200&q=80',
        caption: 'Ljubav koja traje',
    },
    {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
        caption: 'Naš poseban dan',
    },
    {
        url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
        caption: 'Sretan početak',
    },
];

const PhotoSlider: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartX = useRef<number | null>(null);

    const goTo = (index: number, dir: 'left' | 'right') => {
        if (isAnimating) return;
        setDirection(dir);
        setIsAnimating(true);
        setTimeout(() => {
            setCurrent(index);
            setIsAnimating(false);
        }, 500);
    };

    const prev = () => {
        const idx = (current - 1 + slides.length) % slides.length;
        goTo(idx, 'left');
    };

    const next = () => {
        const idx = (current + 1) % slides.length;
        goTo(idx, 'right');
    };

    // Auto-advance
    useEffect(() => {
        timerRef.current = setTimeout(() => next(), 4500);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current]);

    // Touch swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
        touchStartX.current = null;
    };

    return (
        <div className="max-w-3xl mx-auto px-4">
            {/* Section header */}
            <div className="text-center mb-10">
                <span className="text-xs tracking-[0.4em] text-[#d4af37] uppercase font-bold">Naši trenuci</span>
                <div className="w-10 h-0.5 bg-[#d4af37] mx-auto mt-3"></div>
            </div>

            {/* Card */}
            <div
                className="relative rounded-2xl overflow-hidden shadow-2xl bg-white"
                style={{ boxShadow: '0 8px 48px 0 rgba(212,175,55,0.13), 0 2px 16px 0 rgba(0,0,0,0.10)' }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Image */}
                <div className="relative w-full overflow-hidden" style={{ paddingBottom: '62%' }}>
                    {slides.map((slide, i) => (
                        <img
                            key={i}
                            src={slide.url}
                            alt={slide.caption}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                            style={{
                                opacity: i === current ? 1 : 0,
                                transform: i === current
                                    ? 'scale(1.02)'
                                    : isAnimating
                                        ? direction === 'right'
                                            ? 'translateX(-30px) scale(1)'
                                            : 'translateX(30px) scale(1)'
                                        : 'scale(1)',
                                transition: 'opacity 0.5s ease, transform 0.5s ease',
                                zIndex: i === current ? 1 : 0,
                            }}
                        />
                    ))}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />

                    {/* Caption */}
                    {slides[current].caption && (
                        <div className="absolute bottom-5 left-0 right-0 z-20 text-center px-6">
                            <p className="text-white font-serif italic text-lg tracking-wide drop-shadow-md">
                                {slides[current].caption}
                            </p>
                        </div>
                    )}

                    {/* Prev / Next arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 hover:bg-white backdrop-blur transition-all shadow"
                        aria-label="Prethodna slika"
                    >
                        <svg className="w-4 h-4 text-[#4a4a4a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/70 hover:bg-white backdrop-blur transition-all shadow"
                        aria-label="Sljedeća slika"
                    >
                        <svg className="w-4 h-4 text-[#4a4a4a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dot indicators + gold bar */}
                <div className="flex flex-col items-center gap-3 py-5 bg-white">
                    {/* Progress bar */}
                    <div className="w-48 h-0.5 bg-[#f0e6c0] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#d4af37] rounded-full transition-all duration-500"
                            style={{ width: `${((current + 1) / slides.length) * 100}%` }}
                        />
                    </div>

                    {/* Dots */}
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > current ? 'right' : 'left')}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: i === current ? 20 : 7,
                                    height: 7,
                                    background: i === current ? '#d4af37' : '#e0d5b8',
                                }}
                                aria-label={`Idi na sliku ${i + 1}`}
                            />
                        ))}
                    </div>

                    {/* Slide counter */}
                    <p className="text-xs text-[#bbb] tracking-widest font-light">
                        {current + 1} / {slides.length}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PhotoSlider;