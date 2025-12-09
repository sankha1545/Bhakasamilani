"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Target,
  Users,
  TrendingUp,
  Award,
  BookOpen,
  Heart,
  Home,
  Stethoscope,
} from "lucide-react";
import EventsSection from "../sub-sections/HowWeWork/EventsSection";

const steps = [
  {
    icon: Target,
    title: "Identify Needs",
    description:
      "We research and identify communities and causes that need our support the most.",
  },
  {
    icon: Users,
    title: "Community Engagement",
    description:
      "We connect with local communities to understand their specific requirements.",
  },
  {
    icon: TrendingUp,
    title: "Strategic Planning",
    description:
      "Our team develops comprehensive action plans with clear goals and timelines.",
  },
  {
    icon: Award,
    title: "Implementation",
    description:
      "We execute projects with dedication, transparency, and regular monitoring.",
  },
];

const causes = [
  {
    icon: BookOpen,
    title: "Education",
    description:
      "Providing quality education and resources to underprivileged children.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    description:
      "Organizing medical camps and providing healthcare support to those in need.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Home,
    title: "Shelter",
    description: "Building homes and providing shelter for homeless families.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Heart,
    title: "Community Service",
    description:
      "Supporting various community development and welfare programs.",
    color: "from-red-500 to-pink-500",
  },
];

export default function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );

  // Start animation once when section first enters view
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
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

    return () => observer.disconnect();
  }, [hasStarted]);

  // Sequentially reveal steps with fade/scale animation
  useEffect(() => {
    if (!hasStarted) return;
    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(() => resolve(), ms);
      });

    const run = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (cancelled) break;
        await sleep(i === 0 ? 0 : 450); // delay between steps
        setVisibleSteps((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [hasStarted]);

  return (
    <section
      id="how-we-work"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-orange-50 to-amber-50"
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
            How We{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
              Work
            </span>
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-orange-600 to-amber-600" />
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Our systematic approach ensures every donation creates maximum
            impact
          </p>
        </div>

        {/* STEPS – Zigzag hill with dotted connectors */}
        <div className="mb-20">
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical dashed spine (desktop) */}
            <div className="absolute inset-y-6 left-1/2 hidden w-px -translate-x-1/2 border-l-2 border-dashed border-orange-300/70 lg:block" />

            <div className="space-y-12">
              {steps.map((step, index) => {
                const isVisible = visibleSteps[index];
                const isLeft = index % 2 === 0;
                const Icon = step.icon;

                const card = (
                  <div
                    className={`relative max-w-md ${
                      isVisible
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-6 scale-95"
                    } transition-all duration-700 ease-out`}
                    style={{
                      transitionDelay: `${index * 140}ms`,
                    }}
                  >
                    {/* Connector from spine to card (desktop) */}
                    {isLeft ? (
                      <span className="hidden lg:block absolute top-1/2 -right-12 w-10 border-t border-dashed border-orange-300/80" />
                    ) : (
                      <span className="hidden lg:block absolute top-1/2 -left-12 w-10 border-t border-dashed border-orange-300/80" />
                    )}

                    {/* 3D-ish rounded block */}
                    <div className="relative p-6 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 shadow-[0_18px_45px_rgba(194,65,12,0.25)] border border-orange-100/70">
                      {/* Soft highlight layer */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-orange-100/40 opacity-80 pointer-events-none" />

                      <div className="relative flex items-start gap-4">
                        {/* Circular icon with 3D feel */}
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-600 via-amber-500 to-orange-400 shadow-[0_12px_28px_rgba(180,83,9,0.8)]">
                          <Icon className="w-8 h-8 text-white" />
                          <div className="absolute inset-[4px] rounded-full border border-white/20" />
                          <div className="absolute -bottom-3 left-4 right-4 h-3 rounded-full opacity-50 blur-md bg-orange-500/40" />
                        </div>

                        <div>
                          {/* Step number badge (mobile) */}
                          <div className="inline-flex items-center justify-center mb-2 text-sm font-semibold text-orange-700 rounded-full lg:hidden bg-orange-100 px-3 py-1">
                            Step {index + 1}
                          </div>

                          <h3 className="mb-2 text-xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                          <p className="leading-relaxed text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );

                // Center node for desktop (number + glow)
                const CenterNode = (
                  <div className="relative items-center justify-center hidden lg:flex">
                    <div className="relative flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-orange-500/15 blur-xl" />
                      <div className="absolute flex items-center justify-center w-10 h-10 text-sm font-semibold text-white rounded-full shadow-[0_8px_20px_rgba(194,65,12,0.85)] bg-gradient-to-br from-orange-500 to-amber-500">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={index}
                    className={`relative grid items-center gap-6 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] ${
                      // small up/down offset to give a "hill" / wave feeling
                      index % 2 === 1 ? "lg:translate-y-4" : "lg:-translate-y-2"
                    }`}
                  >
                    {isLeft ? (
                      <>
                        {card}
                        {CenterNode}
                        <div className="hidden lg:block" />
                      </>
                    ) : (
                      <>
                        <div className="hidden lg:block" />
                        {CenterNode}
                        {card}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-16">
          <h3 className="mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl">
            Our Focus Areas
          </h3>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {causes.map((cause, index) => (
              <div
                key={index}
                className="p-8 transition-all duration-300 bg-white border border-gray-100 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${cause.color} rounded-xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <cause.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="mb-3 text-xl font-bold text-gray-900">
                  {cause.title}
                </h4>
                <p className="leading-relaxed text-gray-600">
                  {cause.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency section */}
        <div className="p-8 text-center text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl md:p-12">
          <h3 className="mb-4 text-3xl font-bold md:text-4xl">
            Transparency &amp; Accountability
          </h3>
          <p className="max-w-3xl mx-auto mb-8 text-xl opacity-95">
            We maintain complete transparency in our operations. Regular reports
            and updates ensure you know exactly how your contributions are
            making a difference.
          </p>
          <div className="grid max-w-4xl gap-8 mx-auto md:grid-cols-3">
            <div>
              <h4 className="mb-2 text-4xl font-bold">100%</h4>
              <p className="text-lg opacity-90">Fund Utilization</p>
            </div>
            <div>
              <h4 className="mb-2 text-4xl font-bold">Monthly</h4>
              <p className="text-lg opacity-90">Progress Reports</p>
            </div>
            <div>
              <h4 className="mb-2 text-4xl font-bold">Verified</h4>
              <p className="text-lg opacity-90">Impact Assessment</p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <EventsSection />
        </div>
      </div>
    </section>
  );
}
