"use client";

import Image from 'next/image';
import Link from 'next/link';
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
            {timestamp && <p className="text-xs text-gray-500">{timestamp}</p>}
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
        <header className="flex items-center justify-between mb-8 border-b-2 border-red-500/50 pb-4">
          <div>
            <h1 className="text-5xl font-bold text-red-400 tracking-wider">UNKNOWN OBJECTS</h1>
            <p className="text-gray-400 text-lg">CONNECTION ESTABLISHED: MARS DEEP ORBIT PROBE 7</p>
          </div>
          <Link href="/StartJourney#bottom" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 transition-colors">
            Back
          </Link>
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

        {/* --- STATIC TOPICS SECTION: Mars Questions to Explore --- */}
        <section className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-red-300 tracking-wide mb-6">OPEN QUESTIONS: MARS EXPLORATION</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-red-500/30 bg-black/30 p-5 hover:border-red-400/50 transition-colors">
              <h3 className="text-2xl text-red-200 mb-2">1. Was there (or is there) life?</h3>
              <p className="text-gray-300 leading-relaxed">
                From ancient lakebeds in Jezero Crater to organics detected by Curiosity, Mars keeps teasing us. The key is context: biosignatures must be distinguished from abiotic organics. Sample return and coordinated in situ geochemistry are crucial next steps.
              </p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-black/30 p-5 hover:border-red-400/50 transition-colors">
              <h3 className="text-2xl text-red-200 mb-2">2. Could life exist now?</h3>
              <p className="text-gray-300 leading-relaxed">
                Modern Mars is cold, dry, and irradiated—yet subsurface brines, perchlorates, and transient methane plumes hint at niches. If life persists, it likely hides underground where liquid water and shielding coexist.
              </p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-black/30 p-5 hover:border-red-400/50 transition-colors">
              <h3 className="text-2xl text-red-200 mb-2">3. Planetary history: Why did Mars “die”?</h3>
              <p className="text-gray-300 leading-relaxed">
                Mars once had rivers, lakes, and perhaps seas. The magnetic field collapsed, the atmosphere thinned, and surface habitability waned. Untangling chronology—volcanism, dynamo shutoff, and atmospheric escape—defines how long Mars stayed friendly to life.
              </p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-black/30 p-5 hover:border-red-400/50 transition-colors">
              <h3 className="text-2xl text-red-200 mb-2">4. Current environment: How dangerous is it really?</h3>
              <p className="text-gray-300 leading-relaxed">
                Cosmic rays, dust storms, perchlorate chemistry, and extreme diurnal swings all pose hazards. Quantifying real exposure—radiation dose rates, dust toxicity, and storm dynamics—sets the bar for human exploration and long-term settlement.
              </p>
            </div>
          </div>
        </section>


        {/* Small Topics */}
        <div className="space-y-4">
          <LogEntry timestamp="" title="Dust Devils & Electrification" icon={Wind}>
            How do electrostatic charge and dust lifting interact, and what does that mean for surface operations and instrument longevity?
          </LogEntry>

          <LogEntry timestamp="" title="Subglacial Ice Mapping" icon={Rss}>
            Refine orbital radar constraints on buried ice sheets to identify accessible water resources and paleoclimate archives.
          </LogEntry>

          <LogEntry timestamp="" title="Seasonal CO₂ Jets" icon={Thermometer}>
            Geyser-like CO₂ sublimation events sculpt terrain each spring—what controls their distribution and energy budget?
          </LogEntry>

          <LogEntry timestamp="" title="Tharsis Volcanism Timescales" icon={Activity}>
            Pin down eruptive chronology to link interior heat flow with atmospheric evolution and transient habitability windows.
          </LogEntry>

          <LogEntry timestamp="" title="Lava Tubes as Shelters" icon={HelpCircle}>
            Characterize lava tube stability and radiation shielding to evaluate natural habitats for future crews (and biosignature preservation).
          </LogEntry>

          <LogEntry timestamp="" title="Perchlorate Chemistry & Health" icon={Beaker}>
            Assess perchlorate reactivity in regolith and its implications for agriculture, life support, and human physiology.
          </LogEntry>

          <LogEntry timestamp="" title="Dune Migration Dynamics" icon={Wind}>
            Quantify present-day aeolian transport rates to understand climate variability and dust storm initiation thresholds.
          </LogEntry>

          <LogEntry timestamp="" title="Radiation Microenvironments" icon={AlertTriangle}>
            Map dose rate variability across surface features to inform EVA limits and habitat siting.
          </LogEntry>
        </div>
      </div>
    </main>
  );
}