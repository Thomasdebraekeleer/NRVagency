"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import SplitType from "split-type";
import Magentic from "@/components/ui/magentic";

export function HeroMinimalist() {
  const arrowRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const workLinkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation d'apparition du texte principal
    if (textRef.current) {
      // Attendre que le DOM soit prêt
      setTimeout(() => {
        const myText = new SplitType(textRef.current!, { types: "lines" });
        const lines = textRef.current!.querySelectorAll(".line");
        
        if (lines.length > 0) {
          const myText2 = new SplitType(Array.from(lines) as HTMLElement[], {
            types: "lines",
            lineClass: "innnerLine",
          });

          const innerLines = textRef.current!.querySelectorAll(".line .innnerLine");
          
          if (innerLines.length > 0) {
            gsap.from(
              Array.from(innerLines) as HTMLElement[],
              1.5,
              {
                y: "200%",
                opacity: 0,
                skewX: -10,
                paused: false,
                delay: 0.25,
                stagger: 0.12,
                ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
              },
            );
          }
        }
      }, 100);
    }

    // Animation d'apparition de Latest Work
    if (workLinkRef.current) {
      gsap.fromTo(workLinkRef.current, {
        y: 30,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.8,
        ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
      });
    }

    // Animation de la flèche pour Latest Work
    if (!arrowRef.current) return;

    const arrow = arrowRef.current;
    const workLink = arrow.closest('a');

    if (!workLink) return;

    const handleMouseEnter = () => {
      gsap.to(arrow, {
        x: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(arrow, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    workLink.addEventListener("mouseenter", handleMouseEnter);
    workLink.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      workLink.removeEventListener("mouseenter", handleMouseEnter);
      workLink.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Contenu principal aligné à gauche, centré verticalement */}
      <div className="flex-1 flex flex-col items-start justify-center text-left pl-[15%] md:pl-[20%] lg:pl-[25%] max-w-4xl relative z-10">
        {/* Paragraphe descriptif en minuscules et plus grand */}
        <p 
          ref={textRef}
          className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-8 lowercase overflow-hidden"
        >
          <span className="whitespace-nowrap">NRV<sup className="text-lg md:text-xl lg:text-2xl">®</sup> is a creative</span> agency specializing in branding, web design, and digital experiences.
        </p>

        {/* Lien Latest Work avec flèche (seul le texte souligné) */}
        <div ref={workLinkRef}>
          <Magentic
            href="/work"
            strength={50}
            className="text-white text-xl md:text-2xl lg:text-3xl font-light flex items-center gap-2"
            scrambleParams={{
              text: "Latest Work",
              chars: "-xx",
            }}
            hoverUnderline
          >
            <span className="scrambleText inline-block">Latest Work</span>
            <span ref={arrowRef} className="inline-block">→</span>
          </Magentic>
        </div>
      </div>

    </div>
  );
}

