import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: '/about/Gallery (4).jpg',
    title: 'Unite in Faith, Serve with Love',
    subtitle: 'Join us in making a difference through devotion and service',
  },
  {
  image: '/hero/bg-photo (2).jpeg',
    title: 'Empowering Communities',
    subtitle: 'Your contribution brings hope and happiness to those in need',
  },
  {
    image: '/hero/bg-photo (3).jpeg',
    title: 'Together We Grow',
    subtitle: 'Building a stronger community through faith and compassion',
  },
  {
    image: '/hero/bg-photo (4).jpeg',
    title: 'When the heart bows, blessings rise',
    subtitle: 'ॐ शान्तिः शान्तिः शान्तिः — May peace dwell within.',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToDonate = () => {
    const element = document.querySelector('#donate');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <div className="max-w-3xl">
                <h2 className="mb-4 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl md:mb-6">
                  {slide.title}
                </h2>

                <p className="mb-4 text-lg text-gray-100 sm:text-xl md:text-2xl md:mb-6">
                  {slide.subtitle}
                </p>

                {/* Animated expand / collapse content */}
                <div
                  className={`
                    overflow-hidden transition-all duration-500 ease-out
                    ${showMore ? 'max-h-48 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-2'}
                  `}
                >
                  <p className="pr-4 text-base text-gray-100 sm:text-lg md:text-xl">
                    Through regular community events, charity drives, and spiritual
                    gatherings, we aim to uplift those in need and create a space
                    where everyone feels welcomed, supported, and loved. Together,
                    your faith and generosity can transform lives.
                  </p>
                </div>

                <div className="flex flex-col gap-4 mt-6 sm:flex-row">
                  <button
                    onClick={scrollToDonate}
                    className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 transform rounded-full bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-2xl hover:scale-105"
                  >
                    
                    Make a Donation
                  </button>

                  {/* Learn More / Learn Less toggle button */}
                  <button
                    type="button"
                    onClick={toggleMore}
                    aria-expanded={showMore}
                    className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 border-2 border-white rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  >
                    {showMore ? 'Learn Less' : 'Learn More'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Previous slide button */}
      <button
        onClick={prevSlide}
        className="absolute z-30 p-3 text-white transition-all duration-300 -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next slide button */}
      <button
        onClick={nextSlide}
        className="absolute z-30 p-3 text-white transition-all duration-300 -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute z-30 flex gap-3 -translate-x-1/2 bottom-8 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
