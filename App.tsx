
import React, {useEffect, useRef, useState} from 'react';
import ScratchCard from './components/ScratchCard';
import VenueExplorer from './components/VenueExplorer';
import Agenda from './components/Agenda';

interface AppProps {
    audioUrl?: string; // URL to your mp3 or wav file
}

const App: React.FC = ({ audioUrl = '/wedding-music.mp3' }: AppProps) => {
    const vocoPodgorica = {
        name: "voco Podgorica by IHG",
        address: "Bulevar Svetog Petra Cetinjskog 96, Podgorica 81000, Montenegro",
        description: "Smješten u srcu glavnog grada Crne Gore, voco Podgorica spaja moderni luksuz s toplim balkanskim gostoprimstvom. Ovaj elegantni hotel nudi savremene sobe, bogatu gastronomiju i najsavremenije prostore za razne događaje.",
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

    useEffect(() => {
        const audio = new Audio(audioUrl);
        audio.loop = true; // Loop the music continuously
        audio.volume = 0.25; // Set to 30% volume for subtle background music

        audio.addEventListener('canplaythrough', () => {
            setIsLoaded(true);
            setError(false);
        });

        audio.addEventListener('error', () => {
            setError(true);
            console.error('Failed to load audio file');
        });

        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [audioUrl]);

    // Handle play/pause
    useEffect(() => {
        if (!audioRef.current || !isLoaded) return;

        if (isPlaying) {
            audioRef.current.play().catch(err => {
                console.error('Failed to play audio:', err);
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, isLoaded]);

    const toggleMusic = () => {
        if (isLoaded && !error) {
            setIsPlaying(!isPlaying);
        }
    };

    // Auto-play on first user interaction
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (isLoaded && !error && !isPlaying) {
                setIsPlaying(true);
            }
            document.removeEventListener('scroll', handleFirstInteraction);
            document.removeEventListener('click', handleFirstInteraction);
            document.removeEventListener('touchstart', handleFirstInteraction);
        };

        if (isLoaded && !error) {
            document.removeEventListener('scroll', handleFirstInteraction);
            document.addEventListener('click', handleFirstInteraction);
            document.addEventListener('touchstart', handleFirstInteraction);

            return () => {
                document.removeEventListener('scroll', handleFirstInteraction);
                document.removeEventListener('click', handleFirstInteraction);
                document.removeEventListener('touchstart', handleFirstInteraction);
            };
        }
    }, [isLoaded, error, isPlaying]);

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header / Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Wedding Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-[#faf9f6]/80"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <span className="text-sm tracking-[0.4em] text-[#d4af37] uppercase mb-6 block font-light animate-fade-in">
            Svečano Vas pozivamo na vjenčanje
          </span>
          <h1 className="text-6xl md:text-8xl font-cursive text-[#4a4a4a] mb-6 animate-slide-up">
            Jelene & Stefana
          </h1>
          <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-[#7a7a7a] leading-relaxed font-light font-serif italic">
            "Radio bih dijelio jedan život s tobom, nego suočiti sa svim razdobljima ovoga svijeta sam."
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
          <h2 className="text-2xl font-serif text-[#4a4a4a] mb-2">Rezervišite datum!</h2>
          <p className="text-sm text-[#7a7a7a] mb-12 tracking-widest uppercase font-light">Ogrebi ispod za datum vjenčanja</p>
          
          <div className="max-w-md mx-auto">
            <ScratchCard 
              revealText="16. maj 2026."
              subText="Dolazak gostiju u restoran od 15h"
              onScratched={() => setScratched(true)}
            />
          </div>

          {scratched && (
            <div className="mt-8 animate-fade-in">
              <p className="text-[#d4af37] font-serif text-xl italic">Molimo Vas da potvrdite dolazak do 01.05.2026.</p>
                <p><a href="viber://chat?number=%2B38269010567" className="text-[#d4af37] font-serif text-xl italic">Stefan: +38269010567</a></p>
                <p><a href="viber://chat?number=%2B67019007" className="text-[#d4af37] font-serif text-xl italic">Jelena: +38267019007</a></p>
              <button className="mt-6 px-10 py-4 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all uppercase text-xs tracking-[0.3em] font-semibold rounded-sm">
                  <a href="/event.ics">Dodaj u kalendar</a>
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
