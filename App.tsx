
import React, {useEffect, useRef, useState} from 'react';
import ScratchCard from './components/ScratchCard';
import VenueExplorer from './components/VenueExplorer';
import Agenda from './components/Agenda';

interface AppProps {
    audioUrl?: string; // URL to your mp3 or wav file
}

const App: React.FC = ({ audioUrl = `${import.meta.env.BASE_URL}wedding-music.mp3` }: AppProps) => {
    const vocoPodgorica = {
        name: "voco Podgorica by IHG",
        address: "Bulevar Svetog Petra Cetinjskog 96, Podgorica 81000, Crna Gora",
        phone: "+382 20 406 100",
        mapUri: "https://www.google.com/maps/search/?api=1&query=voco+Podgorica+by+IHG",
        photoUrl: "https://www.instagram.com/p/DJrq77FoT2g/"
    };

    // Google Maps embed URL
    const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1472.7368559991976!2d19.2003979!3d42.417650699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134debfdfd22ac99%3A0x4f787ae629c6bf91!2svoco%20Podgorica%20by%20IHG!5e0!3m2!1sen!2s!4v1771172413277!5m2!1sen!2s";
    const [scratched, setScratched] = useState(false);

    // Initialize audio

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const [showPlayPrompt, setShowPlayPrompt] = useState(false);

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audio.loop = true; // Loop the music continuously
        audio.volume = 0.25; // Set to 30% volume for subtle background music

        // Important for mobile: Set playsinline attribute
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');

        const handleCanPlay = () => {
            setIsLoaded(true);
            setError(false);
        };

        const handleError = () => {
            setError(true);
            console.error('Failed to load audio file');
        };

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        audio.addEventListener('canplaythrough', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        audioRef.current = audio;

        return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.pause();
            audio.src = '';
        };
    }, [audioUrl]);

    const toggleMusic = async () => {
        const audio = audioRef.current;
        if (!audio || !isLoaded || error) return;

        try {
            if (audio.paused) {
                // For mobile: ensure we have user gesture context
                await audio.play();
                setShowPlayPrompt(false); // Hide prompt once music starts
            } else {
                audio.pause();
            }
        } catch (err) {
            console.error('Failed to toggle audio:', err);
            // If autoplay is blocked, show the button so user can manually start
            setIsPlaying(false);
            setShowPlayPrompt(true);
        }
    };

    // Autoplay on first user interaction
    useEffect(() => {
        let attempted = false;

        const handleFirstInteraction = (e: Event) => {
            if (attempted) return;
            attempted = true;

            const audio = audioRef.current;
            if (audio && isLoaded && !error && audio.paused) {
                // Force audio context resume for mobile browsers
                audio.play()
                    .then(() => {
                        setShowPlayPrompt(false);
                    })
                    .catch(err => {
                        console.error('Autoplay failed:', err);
                        // Show prompt for user to manually start music
                        setShowPlayPrompt(true);
                        attempted = false;
                    });
            }
        };

        if (isLoaded && !error) {
            // Listen to multiple event types for better mobile support
            const events = ['click', 'touchend', 'touchstart'];

            events.forEach(event => {
                document.addEventListener(event, handleFirstInteraction, { once: true, passive: true });
            });

            return () => {
                events.forEach(event => {
                    document.removeEventListener(event, handleFirstInteraction);
                });
            };
        }
    }, [isLoaded, error]);

  return (
    <div className="min-h-screen flex flex-col pb-20">
        {/* Music Control Button */}
        {!error && (
            <button
                onClick={toggleMusic}
                disabled={!isLoaded}
                className={`fixed top-4 right-4 z-50 p-2.5 bg-white/90 backdrop-blur rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-[#d4af37]/20 ${
                    isLoaded ? 'hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {!isLoaded ? (
                    <svg className="w-4 h-4 text-[#d4af37] animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : isPlaying ? (
                    <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
        )}

        {/* Music indicator */}
        {isPlaying && (
            <div className="fixed top-4 right-16 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full shadow-md border border-[#d4af37]/20 animate-fade-in">
                <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-[#d4af37] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-0.5 h-3 bg-[#d4af37] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-0.5 h-3 bg-[#d4af37] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-gray-600">♫</span>
            </div>
        )}
      {/* Header / Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Wedding Background" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[#faf9f6]/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <span className="text-sm tracking-[0.4em] text-[#d4af37] uppercase mb-6 block font-bold animate-fade-in">
            Pozivamo vas da svojim prisustvom uljepšate naš dan
          </span>
            <h1 className="text-6xl md:text-8xl font-cursive text-[#4a4a4a] mb-6 animate-slide-up flex flex-col md:flex-row md:gap-2 items-center justify-center">
                <span>Jelena</span>
                <span>&</span>
                <span>Stefan</span>
            </h1>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-[#7a7a7a] leading-relaxed font-light font-serif italic">
            "Ljubav jača od vina, prati nas kao sudbina, kao najljepša čarolija"
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </header>

      {/* Scratcher Section */}
      <section className="px-6 py-24 bg-white border-b border-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          {/*<h2 className="text-2xl font-serif text-[#4a4a4a] mb-2">Rezervišite datum!</h2>*/}
          <p className="text-sm text-[#7a7a7a] mb-12 tracking-widest uppercase font-light">OGREBITE ZLATNO POLJE DA OTKRIJETE DATUM VJENČANJA</p>
          
          <div className="max-w-md mx-auto">
            <ScratchCard 
              revealText="16. maj 2026."
              subText="Dolazak u restoran od 15h"
              onScratched={() => setScratched(true)}
            />
          </div>

          {scratched && (
            <div className="mt-8 animate-fade-in">
              <p className="text-[#d4af37] font-serif text-xl italic uppercase">Molimo Vas da potvrdite dolazak do 01.05.2026.</p>
                <p><a href="viber://add?number=%2B38269010567" className="text-[#d4af37] font-serif text-xl italic">Stefan: <u>+38269010567</u></a></p>
                <p><a href="viber://add?number=%2B38267019007" className="text-[#d4af37] font-serif text-xl italic">Jelena: <u>+38267019007</u></a></p>
              <button className="mt-6 px-10 py-4 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all uppercase text-xs tracking-[0.3em] font-semibold rounded-sm">
                  <a href={`${import.meta.env.BASE_URL}event.ics`}>Dodaj u kalendar</a>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Agenda Section */}
      <section id="agenda" className="px-6 py-20 bg-[#faf9f6]">
        <Agenda />
      </section>

      {/* Venue Section */}
      <section id="venue" className="px-6 py-20 bg-[#f4f3f0]">
        <VenueExplorer
            venue={vocoPodgorica}
            mapEmbedUrl={mapEmbedUrl}
        />
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 text-center bg-white border-t border-gray-100">
          <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">RADUJEMO SE VAŠEM DOLASKU!</p>
        <p className="text-xs tracking-[0.2em] text-[#999] uppercase mb-4">Jelena & Stefan • 2026</p>
        <div className="flex justify-center space-x-6">
          <button className="text-[#7a7a7a] hover:text-[#d4af37] transition-colors">
            <svg className="w-5 h-5" fill="red" viewBox="0 0 24 24"><path d="M12 21s-6-4.35-9.33-8.22C-.5 7.39 3.24 1 8.4 4.28 10.08 5.32 12 7.5 12 7.5s1.92-2.18 3.6-3.22C20.76 1 24.5 7.39 21.33 12.78 18 16.65 12 21 12 21z"/>
            </svg>
          </button>
        </div>
      </footer>

      {/* Global CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
