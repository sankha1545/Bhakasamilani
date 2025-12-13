import Image from "next/image";

const slides = [
  {
    image: "/about/Gallery (4).jpg",
    title: "Unite in Faith, Serve with Love",
    subtitle: "Join us in making a difference through devotion and service",
  },
  
];

export default function HeroSectionServer() {
  return (
    <section id="home" className="relative w-full h-screen overflow-hidden">
      {/* LCP IMAGE */}
      <Image
        src={slides[0].image}
        alt={slides[0].title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      <div className="absolute inset-0 z-20 flex items-center">
        <div className="w-full px-4 mx-auto max-w-7xl">
          <div className="max-w-3xl text-white">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              {slides[0].title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl">
              {slides[0].subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
