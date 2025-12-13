"use client";

import dynamic from "next/dynamic";
import HeroSectionServer from "./HeroSection.server.temp";


/* Client-only slider logic */
const HeroSectionClient = dynamic(
  () => import("./HeroSection.client"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <div className="relative">
      {/* Server-rendered LCP content */}
      <HeroSectionServer />

      {/* Client-only interactivity */}
      <HeroSectionClient />
    </div>
  );
}
