"use client";


import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import DonateSection from "@/components/sections/DonateSection";
import HowWeWorkSection from "@/components/sections/HowWeWorkSection";
import ContactSection from "@/components/sections/ContactSection";
import ScrollControls from "@/components/layout/ScrollControls";
import MeetOurteam from "@/components/sections/MeetOurteamSection"; 
export default function HomePage() {
  return (
    <div className="min-h-screen">
     
      <HeroSection />
      <AboutSection />
      <HowWeWorkSection />
      <DonateSection />
      <MeetOurteam />
      <ContactSection />
    
      <ScrollControls />
    </div>
  );
}
