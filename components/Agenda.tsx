
import React from 'react';

interface AgendaItem {
  time: string;
  title: string;
  description: string;
}

const agendaItems: AgendaItem[] = [
  {
    time: "12:00h",
    title: "Crkveno vjenčanje",
    description: "manastir Dajbabe"
  },
  {
    time: "od 15:00h",
    title: "Vrijeme dolaska",
    description: "restoran voco Podgorica by IHG"
  },
  {
    time: "16:00h",
    title: "Ceremonija vjenčanja",
    description: "restoran voco Podgorica by IHG"
  }
];

const Agenda: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        {/*<span className="text-xs tracking-[0.3em] text-[#d4af37] uppercase font-light">Agenda vjenčanja</span>*/}
        <h2 className="text-4xl font-serif text-[#4a4a4a] mt-2">Agenda</h2>
        <div className="w-12 h-px bg-[#d4af37] mx-auto mt-4"></div>
      </div>

      <div className="relative">
        {/* Central Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-200 hidden md:block"></div>

        <div className="space-y-12 md:space-y-0">
          {agendaItems.map((item, index) => (
            <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Content Box */}
              <div className="w-full md:w-1/2 px-4 md:px-12 text-center md:text-left">
                <div className={`p-6 rounded-lg bg-white shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-300 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-[#d4af37] font-semibold tracking-tighter text-lg">{item.time}</span>
                  <h3 className="text-xl font-serif text-[#4a4a4a] mt-1 mb-2 uppercase">{item.title}</h3>
                  <p className="text-sm text-[#7a7a7a] leading-relaxed">{item.description}</p>
                </div>
              </div>

              {/* Dot on timeline */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-[#d4af37] bg-white z-10 items-center justify-center">
                 <div className="w-1 h-1 bg-[#d4af37] rounded-full"></div>
              </div>

              {/* Spacer for the other side */}
              <div className="hidden md:block md:w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agenda;
