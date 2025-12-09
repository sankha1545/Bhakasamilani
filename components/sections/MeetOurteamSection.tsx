"use client";

import React, { useEffect, useRef, useState } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

/* -------------------------------------------
 TEAM MEMBERS DATA 
--------------------------------------------*/
type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sankha Subhra Das",
    role: "President",
    bio: "Sankha leads with compassion and vision, ensuring that every project is aligned with our core values and community-driven outcomes.",
    image:
      "https://images.pexels.com/photos/164631/pexels-photo-164631.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 2,
    name: "Akash Das",
    role: "Community Outreach Head",
    bio: "Akash works closely with communities, understanding and addressing grassroots needs with empathy and precision.",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Youth Coordinator",
    bio: "Rahul inspires youth participation through meaningful volunteering initiatives that strengthen cultural and humanitarian bonds.",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 4,
    name: "Sachin Sen",
    role: "Program Director",
    bio: "Sachin designs and oversees event execution, ensuring every program is well-organized, impactful, and aligned with our mission.",
    image:
      "https://images.pexels.com/photos/2837009/pexels-photo-2837009.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

/* -------------------------------------------
 TESTIMONIALS DATA 
--------------------------------------------*/
const testimonials = [
  {
    name: "Arjun Sharma",
    role: "Volunteer",
    comment:
      "A heartfelt organization! I’ve grown spiritually while helping others. Truly inspiring.",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Aishi Dutta",
    role: "Donor",
    comment:
      "Their transparency and dedication motivated me to become a regular donor.",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Avijit Dey",
    role: "Community Member",
    comment:
      "Their services helped my village greatly. Very grateful for their kindness.",
    image:
      "https://images.pexels.com/photos/1889787/pexels-photo-1889787.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Gopal dey",
    role: "Volunteer",
    comment: "Beautiful experience every time I join the seva activities.",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Nikhil Mehta",
    role: "Supporter",
    comment: "The sincerity and intent with which they work is unmatched.",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Dipam ghosh",
    role: "Program Partner",
    comment: "Amazing coordination and execution. Loved working with them.",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Anindya Mukherjee",
    role: "Participant",
    comment: "Their events are uplifting and very well organized.",
    image:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "Shreya Menon",
    role: "Volunteer",
    comment:
      "I learned so much about service and compassion while working with them.",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

/* -------------------------------------------
 3D Testimonial Card component (PORTRAIT)
--------------------------------------------*/
type TestimonialCardProps = {
  data: (typeof testimonials)[number];
  index: number;
  x: MotionValue<number>;
  maxX: number;
  count: number;
};

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  data,
  index,
  x,
  maxX,
  count,
}) => {
  const safeMax = maxX || 1;

  // Base rotation & depth from scroll
  const baseRotate = useTransform(x, [0, -safeMax], [10, -10]);
  const baseZ = useTransform(x, [0, -safeMax], [0, 80]);

  // Offset per card for layered 3D effect
  const middle = (count - 1) / 2;
  const offset = index - middle;

  const rotateY = useTransform(baseRotate, (v) => v + offset * 5);
  const scale = useTransform(baseZ, (z) => 1 + z / 500);

  return (
    <motion.div
      className="flex flex-col items-center justify-between 
                 min-w-[260px] sm:min-w-[280px] md:min-w-[300px] 
                 h-[360px] sm:h-[400px] md:h-[430px] 
                 bg-white/95 rounded-3xl shadow-2xl px-5 py-6 sm:px-6 sm:py-7 
                 border-[10px] border-amber-400/90 
                 backdrop-blur-sm"
      style={{
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      {/* Avatar in ring */}
      <div className="flex flex-col items-center gap-3 mb-3 sm:mb-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full ring-4 ring-amber-500/90 bg-amber-50 shadow-md flex items-center justify-center overflow-hidden">
          <img
            src={data.image}
            alt={data.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-center">
          <h4 className="text-base font-bold text-gray-900 sm:text-lg">
            {data.name}
          </h4>
          <p className="text-xs font-semibold tracking-wide text-orange-600 uppercase sm:text-sm">
            {data.role}
          </p>
        </div>
      </div>

      {/* Comment */}
      <p className="flex-1 text-sm leading-relaxed text-center text-gray-700 sm:text-base">
        “{data.comment}”
      </p>
    </motion.div>
  );
};

/* -------------------------------------------
 MAIN SECTION
--------------------------------------------*/
const MeetOurTeamSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember>(
    teamMembers[0]
  );

  // Fade in team section on scroll
  useEffect(() => {
    if (typeof window === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setHasAnimatedIn(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  /* --------- 3D PARALLAX HORIZONTAL TESTIMONIAL SCROLLER --------- */
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [maxX, setMaxX] = useState(0);

  // Measure the row width for horizontal travel
  useEffect(() => {
    const measure = () => {
      if (!scrollRef.current || !innerRef.current) return;
      const viewportWidth = scrollRef.current.offsetWidth;
      const totalWidth = innerRef.current.scrollWidth;
      setMaxX(Math.max(0, totalWidth - viewportWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Scroll progress tied to the testimonial section
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"], // when top hits bottom → 0, bottom hits top → 1
  });

  // Map vertical scroll to horizontal translation, from 0 to -maxX
  const rawX = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const x = useSpring(rawX, { stiffness: 100, damping: 24, mass: 0.9 });

  // Parallax background moves slower than cards
  const bgX = useTransform(x, [0, -Math.max(maxX, 1)], [0, 60]);

  return (
    <section
      id="team"
      ref={sectionRef}
      className="py-16 bg-gradient-to-br from-orange-50 to-amber-50 sm:py-20 lg:py-24"
    >
      <div className="px-4 mx-auto max-w-6xl sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Meet Our{" "}
            <span className="text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
              Organizers
            </span>
          </h2>
          <div className="w-20 h-1 mx-auto mb-4 bg-gradient-to-r from-orange-600 to-amber-600 sm:w-24" />
          <p className="max-w-2xl mx-auto text-sm text-gray-600 sm:text-base">
            A dedicated team of organizers, working together to serve the
            community with devotion and care.
          </p>
        </div>

        {/* TEAM GRID */}
        <div
          className={`grid gap-10 md:gap-12 md:grid-cols-[1fr_1.4fr] items-start transition-all duration-700 ${
            hasAnimatedIn
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          {/* Left: Portrait main photo */}
          <div className="flex justify-center md:justify-start">
            <div className="relative p-3 bg-white shadow-2xl rounded-3xl sm:p-4">
              <div className="overflow-hidden bg-gray-100 rounded-2xl shadow-lg w-[240px] h-[320px] xs:w-[260px] xs:h-[340px] sm:w-[280px] sm:h-[380px] md:w-[320px] md:h-[440px] lg:w-[340px] lg:h-[480px] max-w-full">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="object-cover object-top w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Right: Info + thumbnails */}
          <div className="space-y-8">
            <div className="pb-6 border-b border-amber-200/70">
              <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                {selectedMember.name}
              </h3>
              <p className="mt-1 text-xs font-semibold tracking-wide text-orange-600 uppercase sm:text-sm">
                {selectedMember.role}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base md:text-lg">
                {selectedMember.bio}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <button
                    key={i}
                    aria-label="Social link"
                    className="inline-flex items-center justify-center w-9 h-9 text-white transition-colors rounded-md shadow-md sm:w-10 sm:h-10 bg-amber-500/90 hover:bg-amber-600"
                    type="button"
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase sm:text-sm">
                Core Team
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {teamMembers.map((member) => {
                  const isActive = member.id === selectedMember.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => setSelectedMember(member)}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 ${
                        isActive
                          ? "border-orange-500 shadow-xl scale-[1.03]"
                          : "border-transparent shadow-md hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="object-cover w-full h-28 sm:h-32 md:h-36"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:opacity-100" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS 3D PARALLAX SECTION (PORTRAIT SLIDES) */}
        <div className="mt-20 sm:mt-24 lg:mt-28">
          <h3 className="mb-8 text-2xl font-bold text-center text-gray-900 sm:text-3xl md:text-4xl">
            Testimonials
          </h3>

          {/* Tall area to allow scroll-based horizontal animation.
              Vertical scroll is "converted" into horizontal slide motion
              until all cards are shown. */}
          <div
            ref={scrollRef}
            className="relative min-h-[160vh] sm:min-h-[180vh] lg:min-h-[200vh]"
          >
            {/* Sticky viewport: stays fixed while we scroll horizontally */}
            <div className="sticky top-24 sm:top-28 lg:top-32 overflow-hidden">
              {/* 3D parallax background */}
              <motion.div
                style={{ x: bgX }}
                className="absolute inset-0 pointer-events-none -z-10"
              >
                <div className="absolute w-48 h-48 rounded-full -left-16 top-4 bg-gradient-to-br from-orange-200 via-amber-300 to-amber-500 blur-3xl opacity-70 sm:w-64 sm:h-64 sm:-left-24" />
                <div className="absolute bottom-0 right-0 rounded-full w-64 h-64 bg-gradient-to-br from-rose-200 via-orange-200 to-yellow-300 blur-3xl opacity-60 sm:w-80 sm:h-80" />
                <div className="absolute inset-y-10 left-1/3 w-32 bg-gradient-to-b from-amber-300/40 to-transparent blur-2xl opacity-60 sm:w-40" />
              </motion.div>

              {/* Horizontal cards row (PORTRAIT SLIDES) */}
              <motion.div
                ref={innerRef}
                style={{ x }}
                className="relative flex gap-5 px-3 py-5 sm:px-4 sm:gap-6 md:gap-8"
              >
                {testimonials.map((t, index) => (
                  <TestimonialCard
                    key={t.name + index}
                    data={t}
                    index={index}
                    x={x}
                    maxX={maxX}
                    count={testimonials.length}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <p className="mt-4 text-xs text-center text-gray-600 sm:text-sm">
            Scroll slowly to read each story — once the last slide passes, the
            page continues below.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MeetOurTeamSection;
