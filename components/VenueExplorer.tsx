import React from 'react';

export interface VenueInfo {
    name: string;
    address: string;
    mapUri?: string;
    desc?: string;
    email?: string;
    photoUrl?: string;
}

interface VenueExplorerProps {
    venue: VenueInfo;
    mapEmbedUrl?: string;
}

const VenueExplorer: React.FC<VenueExplorerProps> = ({ venue, mapEmbedUrl }) => {
    return (
        <div className="mt-12 p-6 md:p-10 bg-white shadow-xl rounded-2xl border border-[#d4af37]/20 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col h-full">
                    <h2 className="text-3xl font-serif text-[#4a4a4a] mb-4">
                        Svečana sala
                    </h2>

                    <p className="font-semibold text-[#d4af37] text-xl mb-2">
                        {venue.name}
                    </p>

                    <p className="text-[#7a7a7a] text-sm mb-6 leading-relaxed italic">
                        {venue.address}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {venue.mapUri && (
                            <a
                                href={venue.mapUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-8 py-3 bg-[#d4af37] text-white rounded-full text-sm tracking-widest hover:bg-[#b8962d] transition-all duration-300 shadow-lg shadow-[#d4af37]/20 hover:shadow-xl hover:shadow-[#d4af37]/30 hover:-translate-y-0.5"
                            >
                                📍 GOOGLE MAPS
                            </a>
                        )}
                    </div>
                </div>

                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl bg-gray-50 border border-gray-100">
                    {/* Google Maps Embed or Venue Image */}
                    {mapEmbedUrl ? (
                        <iframe
                            src={mapEmbedUrl}
                            className="w-full h-full border-0"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map of ${venue.name}`}
                        />
                    ) : (
                        <>
                            {/* Venue Image */}
                            <img
                                src={venue.photoUrl || `https://picsum.photos/seed/158/800/600`}
                                alt={venue.name}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                            {/* Venue Label */}
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs uppercase tracking-[0.2em] font-light block mb-1">
                  Pridružite nam se u
                </span>
                                <p className="font-serif text-2xl drop-shadow-lg">
                                    {venue.name}
                                </p>
                            </div>

                            {/* Corner Decoration */}
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30"></div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30"></div>
                        </>
                    )}
                </div>
                <p className="mt-auto text-sm font-semibold text-[#4a4a4a]">
                    {venue.desc}
                </p>
            </div>
        </div>
    );
};

export default VenueExplorer;