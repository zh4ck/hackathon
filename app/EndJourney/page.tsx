"use client";

import Image from 'next/image';
import { Share_Tech_Mono } from 'next/font/google';
import { Rss, Beaker, Thermometer, Wind, AlertTriangle, HelpCircle, Activity } from 'lucide-react';
import { useState, useEffect, ReactNode, ElementType } from 'react';

// A more futuristic, monospace font for the terminal feel
const techMono = Share_Tech_Mono({ subsets: ['latin'], weight: ['400'] });

// --- Custom Hook for Typing Effect ---
function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Reset on text change
    const intervalId = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return displayedText;
}

// --- New Component for Log Entries ---
interface LogEntryProps {
  timestamp: string;
  title: string;
  icon: ElementType;
  children: ReactNode;
}

function LogEntry({ timestamp, title, icon: Icon, children }: LogEntryProps) {
  const bodyText = typeof children === 'string' ? children : '';
  const typedBody = useTypingEffect(bodyText, 10);

  return (
    <div className="relative border-b border-blue-500/20 py-6 px-4 group">
      {/* Corner Brackets for effect */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/0 group-hover:border-blue-500 transition-all duration-300"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/0 group-hover:border-blue-500 transition-all duration-300"></div>
      
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-4 mt-1 text-blue-400 flex-shrink-0" />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-xl text-blue-300">{title}</h3>
            <p className="text-xs text-gray-500">{timestamp}</p>
          </div>
          <p className="text-gray-300 mt-2 pr-4">{typedBody}
            <span className="animate-pulse">_</span>
          </p>
        </div>
      </div>
    </div>
  );
}


export default function EndJourney() {
  return (
    <main className={`${techMono.className} min-h-screen bg-[#02040a] text-white`}>
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:2rem_2rem]"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-[#02040a] to-[#02040a]"></div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-left mb-8 border-b-2 border-red-500/50 pb-4">
          <h1 className="text-5xl font-bold text-red-400 tracking-wider">UNKNOWN OBJECTS</h1>
          <p className="text-gray-400 text-lg">CONNECTION ESTABLISHED: MARS DEEP ORBIT PROBE 7</p>
        </header>

        {/* --- NEW IMAGE SECTION AT THE TOP --- */}
        <div className="w-full h-[60vh] relative mb-12 border-2 border-blue-600 shadow-lg shadow-blue-500/30 rounded-lg overflow-hidden">
          <Image
            src="/EndMars.png"
            alt="Mars Surface View"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="opacity-70 saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
            <p className="text-3xl text-white font-bold tracking-wide">SURFACE VIEW: UNKNOWN ANOMALY AREA</p>
          </div>
          <div className="absolute top-4 right-4 text-xs text-red-400 bg-black/50 px-3 py-1 rounded-full border border-red-600">LIVE FEED</div>
        </div>
        {/* --- END NEW IMAGE SECTION --- */}


        {/* Log Entries */}
        <div className="space-y-4">
          <LogEntry timestamp="2025-10-05 15:40:49" title="SYSTEM STATUS" icon={Activity}>
            All systems nominal. Initiating data stream from Elysium Planitia sector. Awaiting telemetry...
          </LogEntry>

          <LogEntry timestamp="2025-10-05 15:41:12" title="ATMOSPHERIC ANOMALY" icon={Rss}>
            Transient methane plume detected at coordinates [REDACTED]. Concentration: 45 PPB. Duration: 1.2 hours. Source signature does not match known geological models. Querying biological origin probability...
          </LogEntry>
          
          <LogEntry timestamp="2025-10-05 15:42:05" title="SUBSURFACE SCAN" icon={Beaker}>
            Ground-penetrating radar confirms high-conductivity liquid layer 800m below Vastitas Borealis. Perchlorate saturation estimated at 28%. Analysis suggests potential for microbial viability under extreme conditions.
          </LogEntry>
          
          <LogEntry timestamp="2025-10-05 15:42:58" title="HISTORICAL ANALYSIS" icon={Wind}>
            Core sample magnetic data aligns with the "Great Calamity" hypothesis. Magnetosphere collapse occurred over approx. 10,000 years. Pre-event biosignatures remain inconclusive.
          </LogEntry>

          <LogEntry timestamp="2025-10-05 15:43:21" title="PRIORITY ALERT" icon={AlertTriangle}>
            Recurring Slope Lineae analysis from HiRISE imagery shows spectral evidence of hydrated salts, but also complex organic compounds. Cross-referencing with rover soil samples. WARNING: Data mismatch detected.
          </LogEntry>

          <LogEntry timestamp="2025-10-05 15:44:03" title="UNKNOWN SIGNAL" icon={HelpCircle}>
            A non-EM, patterned signal has been isolated from background seismic noise near the Tharsis Montes region. Pattern is non-random but does not conform to known geological phenomena. Further investigation required. [LOGGING PAUSED]
          </LogEntry>
        </div>
      </div>
    </main>
  );
}