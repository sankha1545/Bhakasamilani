"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────

const galleryImages = [
  {
    src: "/about/Gallery (1).jpg",
    alt: "Devotees gathered in prayer",
  },
  {
    src: "/about/Gallery (2).jpg",
    alt: "Joyful smile of a devotee",
  },
  {
    src: "/about/Gallery (3).jpg",
    alt: "Hands joined in gratitude",
  },
  {
    src: "/about/Gallery (4).jpg",
    alt: "Community seva in the streets",
  },
  {
    src: "/about/Gallery (5).jpg",
    alt: "Golden temple at dusk",
  },
  {
    src: "/about/Gallery (6).jpg",
    alt: "Sacred architecture under the sky",
  },
  {
    src: "/about/Gallery (7).jpg",
    alt: "Lights and devotion in ceremony",
  },
  {
    src: "/about/Gallery (8).jpg",
    alt: "Festival crowd celebrating together",
  },
];

// Duplicate for seamless infinite loop
const loopImages = [...galleryImages, ...galleryImages, ...galleryImages];

// ─────────────────────────────────────────
// CARD COMPONENT
// ─────────────────────────────────────────

const GalleryCard = ({
  data,
  index,
  x,
  itemWidth,
}: {
  data: { src: string; alt: string };
  index: number;
  x: any;
  itemWidth: number;
}) => {
  const centerX = useTransform(x, (val) => {
    const cardCenter = index * itemWidth + val;
    return cardCenter;
  });

  const scale = useTransform(centerX, (c) => {
    const distance = Math.abs(c);
    const t = Math.min(distance / 600, 1);
    return 1.15 - t * 0.35;
  });

  const opacity = useTransform(centerX, (c) => {
    const distance = Math.abs(c);
    const t = Math.min(distance / 600, 1);
    return 1 - t * 0.6;
  });

  const y = useTransform(scale, (s) => -12 * (s - 1));
  const zIndex = useTransform(scale, (s) => s * 100);

  return (
    <motion.div
      className="relative 
                 w-[260px] sm:w-[320px] md:w-[420px] lg:w-[480px] 
                 h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] 
                 flex-shrink-0"
      style={{ scale, opacity, y, zIndex }}
    >
      <div
        className="w-full h-full overflow-hidden rounded-3xl shadow-2xl"
        style={{
          border: "8px solid #f59e0b",
          background: "#fff7e6",
        }}
      >
        <motion.img
          src={data.src}
          alt={data.alt}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
        />
        <div className="absolute bottom-3 left-5 right-5 text-xs text-amber-50/95 drop-shadow-md">
          {data.alt}
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────
// MAIN GALLERY
// ─────────────────────────────────────────

export default function PhotoGallery() {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [itemWidth, setItemWidth] = useState(520); // logical width: card + gap
  const [loopLength, setLoopLength] = useState(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Responsive item width
  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemWidth(300); // mobile
      } else if (width < 1024) {
        setItemWidth(380); // tablet
      } else {
        setItemWidth(520); // desktop
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Recalc loop length on width change
  useEffect(() => {
    setLoopLength(loopImages.length * itemWidth);
  }, [itemWidth]);

  // Infinite wrapping
  useEffect(() => {
    if (!loopLength) return;

    const segment = loopLength / 3; // one base copy

    // Start in the middle strip so user can drag both ways
    if (x.get() === 0) {
      x.set(-segment);
    }

    const unsubscribe = x.onChange((latest) => {
      if (latest <= -2 * segment) {
        x.set(latest + segment);
      } else if (latest >= 0) {
        x.set(latest - segment);
      }
    });

    return () => unsubscribe();
  }, [loopLength, x]);

  // ─────────────────────────────────────
  // AUTOPLAY (auto-scroll) with pause on hover/drag
  // ─────────────────────────────────────
  useEffect(() => {
    if (!loopLength) return;

    const SPEED = 1; // pixels per frame (~36px/sec at 60fps)
    let frameId: number;

    const animate = () => {
      if (!isHovered && !isDragging) {
        const current = x.get();
        x.set(current - SPEED);
      }
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [loopLength, isHovered, isDragging, x]);

  return (
    <section
      id="gallery"
      className="relative py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-10 border-t border-amber-200"
    >
      {/* Heading */}
      <div className="text-center px-4 sm:px-6 lg:px-10 mb-8 sm:mb-10">
        <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-amber-700">
          Gallery
        </p>
        <h3 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Photo{" "}
          <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
            Journey
          </span>
        </h3>
        <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm text-amber-900/80">
          Drag the carousel — each landscape memory pops in the center,
          bows toward you, and loops forever.
        </p>
      </div>

      {/* DRAGGABLE INFINITE CAROUSEL WITH AUTOPLAY */}
      <div className="relative overflow-hidden py-8 sm:py-10">
        <motion.div
          ref={containerRef}
          className="flex gap-6 sm:gap-8 md:gap-10 cursor-grab active:cursor-grabbing px-6 sm:px-10"
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          style={{ x }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          {loopImages.map((img, i) => (
            <GalleryCard
              key={i}
              data={img}
              index={i}
              x={x}
              itemWidth={itemWidth}
            />
          ))}
        </motion.div>
      </div>

      <p className="text-center text-[10px] sm:text-xs text-amber-900/70 mt-2 sm:mt-4">
        It glides on its own — drag ↔ any time to take control.
      </p>
    </section>
  );
}
