"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { Users, Heart, Globe, Award } from "lucide-react";

// import the extracted gallery subsection
import PhotoGallery from "../sub-sections/About/Photo-gallery";

const stats = [
  { icon: Users, value: "10,000+", label: "Devotees Connected" },
  { icon: Heart, value: "₹50L+", label: "Funds Raised" },
  { icon: Globe, value: "25+", label: "Cities Reached" },
  { icon: Award, value: "100+", label: "Projects Completed" },
];

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const decreeWrapperRef = useRef<HTMLDivElement | null>(null);
  const parchmentRef = useRef<HTMLDivElement | null>(null);
  const scrollContentRef = useRef<HTMLDivElement | null>(null);
  const topHandleRef = useRef<HTMLDivElement | null>(null);
  const bottomHandleRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const hasAutoOpenedRef = useRef(false);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedImagesRef = useRef(false);

  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedStatsRef = useRef(false);

  const openDecreeFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // initial hidden states
    if (decreeWrapperRef.current) {
      decreeWrapperRef.current.style.opacity = "0";
    }
    if (parchmentRef.current) {
      parchmentRef.current.style.height = "40px";
    }
    if (scrollContentRef.current) {
      scrollContentRef.current.style.opacity = "0";
      scrollContentRef.current.style.transform = "translateY(-50px)";
    }

    if (imageRefs.current.length) {
      anime.set(imageRefs.current, {
        opacity: 0,
        scale: 0.85,
        translateY: 30,
      });
    }

    if (statsRefs.current.length) {
      anime.set(statsRefs.current, {
        opacity: 0,
        translateY: 40,
        scale: 0.95,
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

      setIsOpen(true);

      anime.set(parchmentRef.current, { height: "40px", opacity: 1 });
      anime.set(scrollContentRef.current, { opacity: 0, translateY: -50 });
      anime.set([topHandleRef.current, bottomHandleRef.current], {
        rotateX: 0,
      });

      const scrollTimeline = anime.timeline({ easing: "easeOutCubic" });

      scrollTimeline
        .add({
          targets: decreeWrapperRef.current,
          opacity: [0, 1],
          duration: 300,
        })
        .add(
          {
            targets: [topHandleRef.current, bottomHandleRef.current],
            rotateX: [-5, 5],
            duration: 400,
            easing: "easeInOutSine",
          },
          200
        )
        .add(
          {
            targets: parchmentRef.current,
            height: ["40px", "500px"],
            duration: 1200,
            easing: "easeOutElastic(1, 0.6)",
          },
          400
        )
        .add(
          {
            targets: topHandleRef.current,
            rotateX: [5, 0],
            translateY: [0, -10],
            duration: 600,
          },
          800
        )
        .add(
          {
            targets: bottomHandleRef.current,
            rotateX: [5, 0],
            translateY: [0, 10],
            duration: 600,
          },
          800
        )
        .add(
          {
            targets: scrollContentRef.current,
            opacity: [0, 1],
            translateY: [-50, 0],
            duration: 800,
            easing: "easeOutQuart",
          },
          1000
        )
        .add(
          {
            targets: parchmentRef.current,
            scale: [1, 1.02, 1],
            duration: 500,
            easing: "easeInOutSine",
          },
          1600
        );
    };

    openDecreeFnRef.current = openDecree;

    // observe only the inner "about body"
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (!hasAutoOpenedRef.current) {
            hasAutoOpenedRef.current = true;
            openDecree();
          }

          if (!hasAnimatedImagesRef.current && imageRefs.current.length) {
            hasAnimatedImagesRef.current = true;
            anime({
              targets: imageRefs.current,
              opacity: [0, 1],
              scale: [0.85, 1],
              translateY: [30, 0],
              duration: 1600,
              easing: "easeOutQuad",
            });
          }

          if (!hasAnimatedStatsRef.current && statsRefs.current.length) {
            hasAnimatedStatsRef.current = true;
            anime
              .timeline({
                easing: "easeOutExpo",
              })
              .add({
                targets: statsRefs.current,
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.95, 1],
                duration: 900,
                delay: anime.stagger(120),
              })
              .add({
                targets: statsRefs.current,
                boxShadow: [
                  "0 0 0 rgba(0,0,0,0)",
                  "0 18px 40px rgba(0,0,0,0.16)",
                ],
                duration: 600,
                offset: "-=500",
              });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -15% 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleParchmentClick = () => {
    if (!isOpen && openDecreeFnRef.current) {
      openDecreeFnRef.current();
    }
  };

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-orange-50 to-amber-50"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* All animated ABOUT content wrapped in this div */}
        <div ref={sectionRef}>
          {/* Heading */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              About{" "}
              <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
                Bhakta Sammilan
              </span>
            </h2>
            <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-amber-600" />
          </div>

          {/* Main content: image collage + royal decree */}
          <div className="grid items-center gap-12 mb-16 md:grid-cols-2">
            {/* Left: Image collage */}
            <div>
              <div className="grid gap-2.5 md:h-[520px] md:grid-cols-3">
                {/* Tall main image (2 columns on md+) */}
                <div
                  className="h-[260px] md:h-full md:col-span-2"
                  ref={(el) => {
                    imageRefs.current[0] = el;
                  }}
                >
                  <img
                    src="https://images.pexels.com/photos/6646928/pexels-photo-6646928.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="Community gathering"
                    className="object-cover w-full h-full shadow-2xl rounded-2xl"
                  />
                </div>

                {/* Two stacked images in 3rd column */}
                <div className="flex flex-col h-[260px] gap-2.5 md:h-full md:col-span-1">
                  <div
                    className="flex-1"
                    ref={(el) => {
                      imageRefs.current[1] = el;
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/460680/pexels-photo-460680.jpeg?auto=compress&cs=tinysrgb&w=900"
                      alt="Temple at dusk"
                      className="object-cover w-full h-full shadow-xl rounded-2xl"
                    />
                  </div>
                  <div
                    className="flex-1"
                    ref={(el) => {
                      imageRefs.current[2] = el;
                    }}
                  >
                    <img
                      src="https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=900"
                      alt="Spiritual architecture"
                      className="object-cover w-full h-full shadow-xl rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Royal Decree Scroll */}
            <div className="relative flex justify-center">
              <div
                ref={decreeWrapperRef}
                className="relative w-full max-w-xl transition-opacity duration-300"
                style={{ opacity: 0 }}
              >
                {/* Top Handle */}
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

                {/* Parchment */}
                <div
                  ref={parchmentRef}
                  onClick={handleParchmentClick}
                  className={`relative w-full mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 ${
                    isOpen ? "cursor-default" : "cursor-pointer"
                  }`}
                  style={{
                    height: "40px",
                    borderLeft: "3px solid #d97706",
                    borderRight: "3px solid #d97706",
                    boxShadow:
                      "inset 0 0 50px rgba(217, 119, 6, 0.1), 0 25px 50px rgba(0,0,0,0.3)",
                  }}
                >
                  {/* Scrollable Content */}
                  <div
                    ref={scrollContentRef}
                    className="relative z-10 p-8 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-800 scrollbar-track-amber-200"
                    style={{
                      opacity: 0,
                      scrollbarColor: "#92400e #fef3c7",
                    }}
                  >
                    <div className="space-y-4 font-serif text-amber-800">
                      <h3 className="mb-6 text-3xl font-bold text-center text-amber-900">
                        Compassion ॐ
                      </h3>
                      <p className="text-lg leading-relaxed text-amber-900/90">
                        Bhakta Sammilan is a sacred gathering of devotees
                        committed to serving humanity through spiritual values
                        and compassionate action. Founded on the principles of
                        devotion, service, and unity, we bring together people
                        from all walks of life to make a meaningful difference
                        in our communities.
                      </p>
                      <p className="text-lg leading-relaxed text-amber-900/90">
                        Our mission is to create a harmonious society where
                        spiritual growth and social welfare go hand in hand.
                        Through various initiatives in education, healthcare,
                        community development, and spiritual upliftment, we
                        touch thousands of lives every year.
                      </p>
                      <p className="text-lg leading-relaxed text-amber-900/90">
                        Join us in this divine journey of service and
                        transformation. Together, we can create ripples of
                        positive change that echo through generations.
                      </p>
                    </div>
                  </div>

                  {/* Folded state overlay (visible only when closed) */}
                  {!isOpen && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                      <div className="px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase rounded-full bg-amber-900/10 text-amber-900">
                        Tap to open royal decree
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Handle */}
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

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                ref={(el) => {
                  statsRefs.current[index] = el;
                }}
                className="p-6 text-center transition-all duration-300 bg-white shadow-lg rounded-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] will-change-transform"
              >
                <div className="inline-flex items-center justify-center mb-4 rounded-full shadow-inner w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100">
                  <stat.icon className="text-orange-600 w-7 h-7" />
                </div>
                <h4 className="mb-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </h4>
                <p className="font-medium text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* GALLERY SUB-SECTION (extracted) */}
          
        </div>
      <PhotoGallery />
      </div>
      
    </section>
    
  );
};

export default AboutSection;
