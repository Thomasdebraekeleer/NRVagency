"use client";

import React, { useRef, useEffect } from "react";

import { HeroWrapper } from "@/components/heroSection/heroWrapper";
import { Header } from "@/components/header";
import { Bulge } from "@/components/bulge";
import { HeroLogo } from "@/components/heroSection/heroLogo";
// import { ImageSequence } from "@/components/heroSection/imageSequence";

export function HeroSection({}) {
  const sectionRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // S'assurer que la vidéo joue toujours
    const playVideo = () => {
      if (video && video.paused) {
        video.play().catch(() => {
          // Ignorer les erreurs de lecture automatique
        });
      }
    };

    // Observer pour maintenir la vidéo en lecture
    let observer: IntersectionObserver | null = null;
    
    if (sectionRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              playVideo();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(sectionRef.current);
    }

    // Utiliser requestAnimationFrame pour vérifier périodiquement
    let animationFrameId: number;
    const checkVideo = () => {
      playVideo();
      animationFrameId = requestAnimationFrame(checkVideo);
    };
    animationFrameId = requestAnimationFrame(checkVideo);

    // Lecture initiale
    playVideo();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section section__1 darkGradient first relative z-0 px-paddingX text-colorLight"
    >
      {/* Vidéo en arrière-plan */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
      >
        <source
          src="/img/Homepage/HEADER VIDEO homepage.mp4"
          type="video/mp4"
        />
      </video>
      <Bulge type="Light" />
      <Header color="Light" />
      <HeroLogo />
      <HeroWrapper />
      {/* NRV en bas à gauche de l'écran */}
      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[100] pointer-events-none">
        <p className="text-white text-[10px] md:text-xs font-light">NRV</p>
      </div>
      {/* Icône de souris animée centrée en bas */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-8 z-[100] pointer-events-none">
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="mouse-wheel"></div>
          </div>
        </div>
      </div>
      {/* Agency en bas à droite de l'écran */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-[100] pointer-events-none">
        <p className="text-white text-[10px] md:text-xs font-light">Agency</p>
      </div>
      <style jsx>{`
        .scroll-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mouse {
          width: 24px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 12px;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8px;
        }
        .mouse-wheel {
          width: 4px;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 2px;
          animation: scroll-wheel 2s infinite;
        }
        @keyframes scroll-wheel {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(12px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
