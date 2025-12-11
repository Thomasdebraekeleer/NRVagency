import React, { useRef } from "react";
import dynamic from "next/dynamic";

import { HeroWrapper } from "@/components/heroSection/heroWrapper";
import { Header } from "@/components/header";
import { Bulge } from "@/components/bulge";
// import { ImageSequence } from "@/components/heroSection/imageSequence";

const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });

export function HeroSection({}) {
  const sectionRef = useRef(null);
  return (
    <section
      ref={sectionRef}
      className="section section__1 darkGradient first relative z-0 px-paddingX text-colorLight"
    >
      <Bulge type="Light" />
      <Header color="Light" />
      <HeroWrapper />
      {/* Sphère 3D remplaçant la séquence d'images - au premier plan */}
      {/* Cache la sphère en version mobile pour laisser le menu cliquable */}
      <div className="pointer-events-none contrast-110 absolute left-0 top-0 z-[6000] hidden h-full w-full items-center justify-center md:flex">
        <div className="relative" style={{ transform: 'translateX(50px)' }}>
          <HeroCanvas />
        </div>
      </div>
    </section>
  );
}
