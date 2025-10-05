"use client";

import Link from 'next/link';
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [firstSectionLocked, setFirstSectionLocked] = useState(true);
  const [isInitialReady, setIsInitialReady] = useState(false);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const router = useRouter();
  const [marsRocketTransform, setMarsRocketTransform] = useState({
    y: 0,
    rotation: 0,
  });
  const marsSectionRef = useRef<HTMLDivElement>(null);

  // ADDED: State to control the timeline's visibility
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);
  const buttonSectionRef = useRef<HTMLDivElement>(null);

  const sections = [
    {
      title: "Low Earth Orbit",
      description:
        "Roughly 400 kilometers above Earth, you orbit the planet every 90 minutes. Sunrises flash past the window sixteen times a day. Earth’s magnetic field still shields you from most radiation. The International Space Station maintains this orbit, constantly adjusting altitude to avoid debris. Communications are near-instant, and resupply from Earth remains possible. LEO is humanity’s training ground for sustained life beyond our atmosphere.",
    },
    {
      title: "Lunar Gateway",
      description:
        "Far beyond Earth’s magnetic reach, the Lunar Gateway orbits the Moon in a near-rectilinear halo path. The view alternates between the lunar surface and distant Earth. Radiation increases, and communication delays reach several seconds. The station tests navigation, power, and life-support systems for deep-space missions. It marks the first permanent human presence operating in true deep-space conditions between two worlds.",
    },
    {
      title: "Mars Transit",
      description:
        "You’ve left lunar orbit and entered interplanetary space. The Sun appears smaller, and stars remain fixed against a black backdrop. Communications with Earth lag up to 20 minutes. Solar storms and cosmic rays strike the spacecraft, demanding constant monitoring. Everything—navigation, energy, and life support—depends on precision and redundancy. Mars grows brighter each week, a distant orange point slowly resolving into a planet.",
    },
    {
      title: "Mars Surface",
      description:
        "You’ve landed on a world half again as far from the Sun as Earth. The sky glows butterscotch under a thin CO₂ atmosphere. Gravity is weak; dust settles slowly. Temperatures swing wildly from day to night, and storms can engulf the horizon for weeks. From this vantage, Earth is a faint star. Mars offers the first real test of building and surviving on another planet.",
    },
  ];

  const scrollToSection = (index: number) => {
    const section = sectionRefs.current[index];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      if (index === 1) setFirstSectionLocked(false);
    }
  };

  const indicatorTop =
    typeof window !== "undefined" && typeof document !== "undefined"
      ? Math.min(
          (scrollY / (document.body.scrollHeight - window.innerHeight)) *
            (window.innerHeight - 40),
          window.innerHeight - 40
        )
      : 0;

  useEffect(() => {
    const handleScroll = (e: Event) => {
      setScrollY(window.scrollY);

      if (!firstSectionLocked || !sectionRefs.current[0]) return;

      const firstSection = sectionRefs.current[0];
      const sectionBottom =
        firstSection.offsetTop + firstSection.offsetHeight + 400;

      if (window.scrollY > sectionBottom) {
        window.scrollTo({ top: sectionBottom, behavior: "instant" });
        e.preventDefault();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: false });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [firstSectionLocked]);

  useEffect(() => {
    const section = marsSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          const targetY = window.innerHeight / 2;
          setMarsRocketTransform({ y: targetY, rotation: 180 });
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Ensure deep-linking to bottom lands user at the bottom section without visible jump
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#bottom") {
      setFirstSectionLocked(false);
      const section = buttonSectionRef.current;
      if (section) {
        const prevScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        // Remove the hash to prevent the browser or any observers from re-scrolling
        try {
          const { pathname, search } = window.location;
          window.history.replaceState(null, "", `${pathname}${search}`);
        } catch {}
        const offset = 300; // pixels above the bottom section
        const targetTop = Math.max(0, section.offsetTop - offset);
        // Ensure layout has settled: do two frames just in case
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetTop, behavior: "auto" });
          requestAnimationFrame(() => {
            window.scrollTo({ top: targetTop, behavior: "auto" });
          });
        });
        // Restore any previous smooth scroll behavior
        document.documentElement.style.scrollBehavior = prevScrollBehavior;
      } else {
        const offset = 400;
        const targetTop = Math.max(0, document.body.scrollHeight - window.innerHeight - offset);
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetTop, behavior: "auto" });
        });
      }
      setIsInitialReady(true);
      return;
    }
    setIsInitialReady(true);
  }, []);

  // ADDED: This useEffect watches the button section to hide/show the timeline
  useEffect(() => {
    const section = buttonSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // When the button section is on screen, hide the timeline.
        // When it's off screen, show it.
        setIsTimelineVisible(!entry.isIntersecting);
      },
      {
        // This threshold means it triggers when the section just starts to enter the view
        threshold: 0.01,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  

  return (
    <div style={{ visibility: isInitialReady ? "visible" : "hidden" }}>
      <div className="flex text-center justify-center h-[100vh] w-full relative">
        <div className="flex flex-col items-center">
          <h1
            className={`${montserrat.className} flex item-center mt-25 text-6xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-extrabold`}
          >
            Start Your Journey
          </h1>
          <h1
            className={`${montserrat.className} flex items-center mt-30 sm:mt-5 md:mt-10 text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-[500] italic text-gray-200`}
          >
            Go For Launch
          </h1>
        </div>

        <div
          style={{
            background:
              "linear-gradient(180deg, #00FFE6 0%, #123057 45%, #000000 100%)",
            transform: `translate(-50%, -50%) rotate(${scrollY * 0.5}deg)`,
          }}
          className="
           absolute 
           top-1/2 left-1/2
           w-[50vw] h-[50vw] rounded-full
           transition-transform duration-500 
           z-15
           opacity-50
           mt-75
         "
        ></div>

        <div
          style={{
            background:
              "radial-gradient(closest-side at 60% 50%, rgba(46,204,113,0.25) 0%, rgba(46,204,113,0.0) 65%), " +
              "radial-gradient(closest-side at 35% 40%, rgba(46,204,113,0.18) 0%, rgba(46,204,113,0.0) 60%), " +
              "linear-gradient(180deg, #00FFE6 0%, #1A4B63 55%, #0B0B0B 100%)",
          }}
          className="
           absolute 
           top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
           w-[45vw] h-[45vw] rounded-full
           transition-all duration-500 
           z-15
           mt-75
         "
        ></div>
      </div>

      <div className="relative z-0 bg-black mt-100">
        {/* MODIFIED: Added classes to control fading based on state */}
        <div
          className={`hidden lg:flex fixed top-0 left-0 h-screen w-1/5 items-center justify-center transition-opacity duration-300 ${
            isTimelineVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full flex justify-center">
            <div className="w-1 bg-white h-full"></div>
            <div
              style={{
                top: `${indicatorTop}px`,
                transform: `rotate(${Math.sin(scrollY / 100) * 20}deg)`,
              }}
              className="absolute w-24 h-24 transition-all duration-100"
            >
              <img
                src="/roktet 1.png"
                alt="Rocket"
                height={1500}
                width={1500}
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-4/5 lg:ml-50 px-4">
          {sections.map((sec, index: number) => (
            <div
              key={index}
              ref={(el) => {
                if (el) sectionRefs.current[index] = el;
              }}
              className="w-full h-screen flex flex-col md:flex-row items-center justify-center px-8 py-8 text-white relative"
            >
              <div className="w-full md:w-1/4 flex items-center justify-center mb-4 md:mb-0">
                <h2 className="text-5xl sm:text-2xl md:text-3xl font-extrabold">
                  {sec.title}
                </h2>
              </div>
              <div className="w-full md:w-2/4 flex items-start md:items-start px-2 md:px-0 mb-4 md:mb-0">
                <p className="text-lg sm:text-base md:text-base lg:text-lg font-[400] text-gray-200">
                  {sec.description}
                </p>
              </div>
              <div className="w-full md:w-1/4 flex flex-col items-center justify-center text-gray-400 text-xs sm:text-sm md:text-sm lg:text-base font-[300]">
                <p>Time from Take Off:</p>
                <p>Survivability:</p>
                <p>Fun fact:</p>
                <p>Threats:</p>
                <p>Radiation Dose:</p>
              </div>
              {index > 0 && (
                <button
                  onClick={() => scrollToSection(index - 1)}
                  className="absolute top-8 right-8 bg-white text-black p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-4 h-4 rotate-180"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
              {index < sections.length - 1 && (
                <button
                  onClick={() => scrollToSection(index + 1)}
                  className="absolute bottom-8 right-8 bg-white text-black p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={marsSectionRef}
        className="bg-black w-full h-[150vh] relative overflow-hidden"
        id="marsSection"
      >
        <div
          style={{
            backgroundImage: "url('/Mars.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="
           mt-50
           absolute
           top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
           w-[120vw] h-[60vw] rounded-full
           transition-all duration-500
           z-[20]
         "
        ></div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 z-[40]">
          <img
            src="/roktet 1.png"
            alt="Rocket"
            className="w-[8vw] h-auto transition-transform duration-[2500ms] ease-out"
            style={{
              transform: `translateY(${marsRocketTransform.y}px) rotate(${marsRocketTransform.rotation}deg)`,
            }}
          />
        </div>
        
        
        <div className="absolute top-[70%] left-1/2 transform -translate-x-1/2 flex justify-center z-[30]">
        <Link href="/MarsSurvivalKit">
          <div className="flex flex-col items-center -translate-y-6 transform transition-transform duration-300 hover:scale-110 mr-[15vw]">
            <img src="/Base.png" alt="Base" className="w-[12vw] h-auto" />
            <p className="mt-2 text-white text-center font-[700]">Mars Survival Kit</p>
          </div>
        </Link>
          <Link href="/JourneyEvaluation">
          <div className="flex flex-col items-center translate-y-6 transform transition-transform duration-300 hover:scale-110">
            <img
              src="/JourneyEval.png"
              alt="JourneyEval"
              className="w-[12vw] h-auto"
            />
            <p className="mt-2 text-white text-center font-[700]">Journey Evaluation</p>
          </div>
          </Link>
          <Link href="/ResearchHub"> {/* <-- 3. Set the href to your internal path */}
          <div className="flex flex-col items-center -translate-y-6 transform transition-transform duration-300 hover:scale-110 ml-[15vw]">
            <img
              src="/Satelite.png"
              alt="Satelite"
              className="w-[12vw] h-auto"
            />
            <p className="mt-2 text-white text-center font-[700]">Biology on Mars</p>
          </div>
        </Link>
        </div>
      </div>
      
      {/* ADDED: ref to this div so we can watch it */}
      <div
        ref={buttonSectionRef}
        className="bg-black flex justify-center items-center py-24"
      >
        <button
      onClick={() => router.push("/EndJourney")}
      className="relative text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide px-10 py-4 rounded-full text-[#E3B18C]
      bg-gradient-to-r from-[#2B0F00] via-[#4A1A08] to-[#1A0A05]
      shadow-[0_0_10px_#2B0F00]
      hover:shadow-[0_0_10px_#8B2E1E]
      hover:scale-102 transition-all duration-500 ease-in-out
      before:content-[''] before:absolute before:inset-0 before:rounded-full before:opacity-0 
      before:bg-gradient-to-r before:from-[#8B2E1E] before:to-[#CC5E2E]
      hover:before:opacity-10 overflow-hidden"
    >
      <span className="relative z-10">Enter The Dark Side</span>
      </button>
      </div>
    </div>
  );
}