import { Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection/HeroSection";
import ClientSections from "@/components/layout/ClientSections";

/* -------------------------------------------
 SEO METADATA (SERVER)
--------------------------------------------*/
export const metadata = {
  title: "Temple Trust | Serving with Devotion and Community",
  description:
    "A community-driven temple trust dedicated to devotion, service, charity, and cultural upliftment.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* LCP ELEMENT — SERVER RENDERED */}
      <HeroSection />

      {/* Heavy client-only sections */}
      <Suspense fallback={null}>
        <ClientSections />
      </Suspense>
    </main>
  );
}
