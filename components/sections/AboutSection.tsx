// components/sections/AboutSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Users, Heart, Globe, Award } from "lucide-react";
import TempleViewer from "@/components/ui/TempleViewer";
import PhotoGallery from "../sub-sections/About/Photo-gallery";

/* ---------- data ---------- */
const stats = [
  { icon: Users, value: "10,000+", label: "Devotees Connected" },
  { icon: Heart, value: "₹50L+", label: "Funds Raised" },
  { icon: Globe, value: "25+", label: "Cities Reached" },
  { icon: Award, value: "100+", label: "Projects Completed" },
];

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Royal-decree refs
  const decreeWrapperRef = useRef<HTMLDivElement | null>(null);
  const parchmentRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const topHandleRef = useRef<HTMLDivElement | null>(null);
  const bottomHandleRef = useRef<HTMLDivElement | null>(null);

  // Temple refs + flag to avoid re-animation
  const templeRef = useRef<HTMLDivElement | null>(null);
  const hasAnimatedTempleRef = useRef(false);

  // Stats refs (array)
  const statsRefs = useRef<Array<HTMLDivElement | null>>([]);
  const hasAnimatedStatsRef = useRef(false);

  // Decree open state
  const [isOpen, setIsOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const openDecreeFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (decreeWrapperRef.current) decreeWrapperRef.current.style.opacity = "0";
    if (parchmentRef.current) {
      parchmentRef.current.style.height = "40px";
    }
    if (scrollContentRef.current) {
      scrollContentRef.current.style.opacity = "0";
      scrollContentRef.current.style.transform = "translateY(-50px)";
    }
    if (topHandleRef.current) topHandleRef.current.style.transform = "rotateX(0deg)";
    if (bottomHandleRef.current) bottomHandleRef.current.style.transform = "rotateX(0deg)";

    if (templeRef.current) {
      anime.set(templeRef.current, { opacity: 0, scale: 0.95, translateY: 24 });
    }

    if (statsRefs.current.length) {
      statsRefs.current.forEach((el) => {
        if (el) anime.set(el, { opacity: 0, translateY: 40, scale: 0.96 });
      });
    }

    const openDecree = () => {
      if (
        !decreeWrapperRef.current ||
        !parchmentRef.current ||
        !scrollContentRef.current ||
        !topHandleRef.current ||
        !bottomHandleRef.current
      ) {
        return;
      }

      if (isOpen) return;
      setIsOpen(true);

      anime.set(parchmentRef.current, { height: "40px", opacity: 1 });
      anime.set(scrollContentRef.current, { opacity: 0, translateY: -50 });
      anime.set([topHandleRef.current, bottomHandleRef.current], { rotateX: 0 });

      const timeline = anime.timeline({ easing: "easeOutCubic" });

      timeline
        .add({
          targets: decreeWrapperRef.current!,
          opacity: [0, 1],
          duration: 300,
        })
        .add(
          {
            targets: [topHandleRef.current!, bottomHandleRef.current!],
            rotateX: [-10, 10],
            duration: 420,
            easing: "easeInOutSine",
            delay: anime.stagger(40),
          },
          180
        )
        .add(
          {
            targets: parchmentRef.current!,
            height: ["40px", "520px"],
            duration: 1100,
            easing: "easeOutElastic(1, 0.6)",
          },
          420
        )
        .add(
          {
            targets: topHandleRef.current!,
            rotateX: [10, 0],
            translateY: [0, -12],
            duration: 580,
            easing: "easeOutSine",
          },
          860
        )
        .add(
          {
            targets: bottomHandleRef.current!,
            rotateX: [10, 0],
            translateY: [0, 12],
            duration: 580,
            easing: "easeOutSine",
          },
          860
        )
        .add(
          {
            targets: scrollContentRef.current!,
            opacity: [0, 1],
            translateY: [-50, 0],
            duration: 760,
            easing: "easeOutQuart",
          },
          1080
        )
        .add(
          {
            targets: parchmentRef.current!,
            scale: [1, 1.02, 1],
            duration: 480,
            easing: "easeInOutSine",
          },
          1680
        );
    };

    openDecreeFnRef.current = openDecree;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (!hasAutoOpenedRef.current) {
            hasAutoOpenedRef.current = true;
            openDecree();
          }

          if (!hasAnimatedTempleRef.current && templeRef.current) {
            hasAnimatedTempleRef.current = true;
            anime({
              targets: templeRef.current,
              opacity: [0, 1],
              scale: [0.95, 1],
              translateY: [24, 0],
              duration: 900,
              easing: "easeOutCubic",
            });
          }

          if (!hasAnimatedStatsRef.current && statsRefs.current.length) {
            hasAnimatedStatsRef.current = true;
            anime
              .timeline({ easing: "easeOutExpo" })
              .add({
                targets: statsRefs.current.filter(Boolean) as Element[],
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.96, 1],
                duration: 900,
                delay: anime.stagger(140),
              })
              .add(
                {
                  targets: statsRefs.current.filter(Boolean) as Element[],
                  boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 18px 40px rgba(0,0,0,0.14)"],
                  duration: 600,
                  offset: "-=420",
                },
                "-=420"
              );
          }
        });
      },
      { threshold: 0.28, rootMargin: "0px 0px -10% 0px" }
    );

    if (sectionRef.current) io.observe(sectionRef.current);

    return () => io.disconnect();
  }, []);

  const handleParchmentClick = () => {
    if (!isOpen && openDecreeFnRef.current) openDecreeFnRef.current();
  };

  const handleParchmentKeyDown = (e: React.KeyboardEvent) => {
    if (isOpen) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (openDecreeFnRef.current) openDecreeFnRef.current();
    }
  };

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="px-4 mx-auto max-w-8xl sm:px-6 lg:px-8">
        <div ref={sectionRef}>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              About{" "}
              <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
                Bhakta Sammilan
              </span>
            </h2>
            <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-amber-600" />
          </div>

          {/* RESPONSIVE LAYOUT:
              - Mobile: stacked (temple above decree)
              - md+: two-column flex where left (temple) gets the majority of width
            */}
          <div className="mb-16">
            <div className="flex flex-col md:flex-row md:items-start md:gap-10">
              {/* LEFT: Temple viewer — larger and prioritized */}
              <div
                ref={templeRef}
                className="w-full md:flex-1 flex items-center justify-center"
                aria-hidden={false}
                style={{ minWidth: 0 }}
              >
                <div
                  className="w-full rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    /* larger height so the Canvas can be more prominent */
                    height: "clamp(420px, 72vh, 920px)", 
                    maxWidth: 1300,
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* TempleViewer fills the parent */
                  /* We keep no extra padding so the 3D canvas centers perfectly */ }
                  <div style={{ width: "100%", height: "100%" }}>
                    <TempleViewer />
                  </div>
                </div>
              </div>

              {/* RIGHT: Decree — fixed comfortable width on md+ so it doesn't crowd the temple */}
              <div className="mt-8 md:mt-0 md:w-[460px] flex-shrink-0 flex justify-center">
                <div
                  ref={decreeWrapperRef}
                  className="relative w-full max-w-xl transition-opacity duration-300"
                  aria-live="polite"
                >
                  <div
                    ref={topHandleRef}
                    className="absolute left-0 right-0 z-20 h-6 mx-8 -top-3"
                    style={{ transform: "rotateX(0deg)" }}
                  >
                    <div className="w-full h-6 rounded-full shadow-lg bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900">
                      <div className="w-full h-2 mt-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 opacity-70" />
                    </div>
                    <div className="absolute w-8 h-8 rounded-full shadow-xl bg-gradient-to-br from-amber-900 to-amber-950 -left-4 -top-1" />
                    <div className="absolute w-8 h-8 rounded-full shadow-xl bg-gradient-to-br from-amber-900 to-amber-950 -right-4 -top-1" />
                  </div>

                  <div
                    ref={parchmentRef}
                    role="button"
                    tabIndex={0}
                    onClick={handleParchmentClick}
                    onKeyDown={handleParchmentKeyDown}
                    aria-expanded={isOpen}
                    aria-controls="decree-content"
                    className={`relative w-full mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 ${
                      isOpen ? "cursor-default" : "cursor-pointer"
                    }`}
                    style={{
                      height: "40px",
                      borderLeft: "3px solid #d97706",
                      borderRight: "3px solid #d97706",
                      boxShadow: "inset 0 0 50px rgba(217,119,6,0.08), 0 25px 50px rgba(0,0,0,0.18)",
                      transition: "height 0.3s ease",
                    }}
                  >
                    <div
                      id="decree-content"
                      ref={scrollContentRef}
                      className="relative z-10 p-8 max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-800 scrollbar-track-amber-200"
                      style={{ opacity: 0 }}
                    >
                      <div className="space-y-4 font-serif text-amber-800">
                        <h3 className="mb-6 text-3xl font-bold text-center text-amber-900">
                          Compassion ॐ
                        </h3>
                        <p className="text-lg leading-relaxed text-amber-900/90">
                          Bhakta Sammilan is a sacred gathering of devotees committed to serving
                          humanity through spiritual values and compassionate action. Founded on the
                          principles of devotion, service, and unity, we bring together people from
                          all walks of life to make a meaningful difference in our communities.
                        </p>
                        <p className="text-lg leading-relaxed text-amber-900/90">
                          Our mission is to create a harmonious society where spiritual growth and
                          social welfare go hand in hand. Through various initiatives in education,
                          healthcare, community development, and spiritual upliftment, we touch
                          thousands of lives every year.
                        </p>
                        <p className="text-lg leading-relaxed text-amber-900/90">
                          Join us in this divine journey of service and transformation. Together, we
                          can create ripples of positive change that echo through generations.
                        </p>
                      </div>
                    </div>

                    {!isOpen && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                        <div className="px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase rounded-full bg-amber-900/10 text-amber-900">
                          Tap to open royal decree
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    ref={bottomHandleRef}
                    className="absolute left-0 right-0 z-20 h-6 mx-8 -bottom-3"
                    style={{ transform: "rotateX(0deg)" }}
                  >
                    <div className="w-full h-6 rounded-full shadow-lg bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900">
                      <div className="w-full h-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-600 opacity-70" />
                    </div>
                    <div className="absolute w-8 h-8 rounded-full shadow-xl bg-gradient-to-br from-amber-900 to-amber-950 -left-4 -top-1" />
                    <div className="absolute w-8 h-8 rounded-full shadow-xl bg-gradient-to-br from-amber-900 to-amber-950 -right-4 -top-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 mb-12">
            {stats.map((stat, index) => {
              return (
                <div
                  key={index}
                  ref={(el) => (statsRefs.current[index] = el)}
                  className="p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] will-change-transform"
                >
                  <div className="inline-flex items-center justify-center mb-4 rounded-full shadow-inner w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100">
                    <stat.icon className="text-orange-600 w-7 h-7" />
                  </div>
                  <h4 className="mb-2 text-3xl font-bold text-gray-900">{stat.value}</h4>
                  <p className="font-medium text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Gallery subsection */}
          <PhotoGallery />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
