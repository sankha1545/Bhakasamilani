"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/about/Gallery (4).jpg",
    title: "Unite in Faith, Serve with Love",
    subtitle: "Join us in making a difference through devotion and service",
  },
  {
    image: "/hero/bg-photo (2).jpeg",
    title: "Empowering Communities",
    subtitle: "Your contribution brings hope and happiness to those in need",
  },
  {
    image: "/hero/bg-photo (3).jpeg",
    title: "Together We Grow",
    subtitle: "Building a stronger community through faith and compassion",
  },
  {
    image: "/hero/bg-photo (4).jpeg",
    title: "When the heart bows, blessings rise",
    subtitle: "ॐ शान्तिः शान्तिः शान्तिः — May peace dwell within.",
  },
];

export default function HeroSectionClient() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const id = setInterval(
      () => setCurrentSlide((i) => (i + 1) % slides.length),
      5000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <button
        aria-label="Previous slide"
        onClick={() =>
          setCurrentSlide((i) => (i - 1 + slides.length) % slides.length)
        }
        className="absolute z-30 left-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full"
      >
        <ChevronLeft />
      </button>

      <button
        aria-label="Next slide"
        onClick={() =>
          setCurrentSlide((i) => (i + 1) % slides.length)
        }
        className="absolute z-30 right-4 top-1/2 -translate-y-1/2 bg-white/20 p-3 rounded-full"
      >
        <ChevronRight />
      </button>

      <div className="absolute z-30 bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-3 rounded-full transition-all ${
              i === currentSlide ? "bg-white w-8" : "bg-white/50 w-3"
            }`}
          />
        ))}
      </div>
    </>
  );
}
