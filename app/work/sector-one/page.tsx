"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import SplitType from "split-type";
import { Cursor } from "@/components/cursor";
import { Header } from "@/components/header";
import { HeaderNavigation } from "@/components/headerNavigation";
import { HeroLogo } from "@/components/heroSection/heroLogo";
import { Bulge } from "@/components/bulge";
import { Footer } from "@/components/contactSection/footer";
import { useAppSelector } from "@/hooks/reduxHooks";

// Style global pour le surlignage jaune
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .hero-text-paragraph .line {
      position: relative;
      display: inline-block;
    }
    .hero-text-paragraph .line::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0.15em;
      width: 0;
      height: 0.4em;
      background-color: #ffe600;
      transition: width 0.3s ease;
      z-index: -1;
    }
    .hero-text-paragraph:hover .line::before {
      width: 100%;
    }
    .hero-text-paragraph span {
      text-transform: capitalize !important;
    }
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
  `;
  document.head.appendChild(style);
}

export default function SectorOnePage() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const jerseyTextRef = useRef<HTMLParagraphElement>(null);
  const [currentJersey, setCurrentJersey] = React.useState<'black' | 'white'>('black');
  const { isMenuOpen } = useAppSelector((state) => state.menuReducer);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const smoothScrollRef = useRef<{ current: number; target: number; ease: number } | null>(null);

  // Animation d'apparition du logo
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          delay: 0.25,
          ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
        }
      );
    }
  }, []);

  // Animation d'apparition du texte avec SplitType
  useEffect(() => {
    if (textRef.current) {
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
  }, []);

  // Animation d'apparition du texte jersey avec SplitType au scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMenuOpen) {
      console.log('[SectorOnePage] Menu is open, skipping ScrollTrigger creation');
      return; // Ne pas créer le ScrollTrigger si le menu est ouvert
    }
    
    console.log('[SectorOnePage] Creating ScrollTrigger for jersey text');
    gsap.registerPlugin(ScrollTrigger);

    const textElement = jerseyTextRef.current;
    if (!textElement) {
      console.log('[SectorOnePage] Text element not found');
      return;
    }
    
    // Préparer SplitType immédiatement mais cacher les lignes
    const myText = new SplitType(textElement, { types: "lines" });
    const lines = textElement.querySelectorAll(".line");
    
    if (lines.length > 0) {
      const myText2 = new SplitType(Array.from(lines) as HTMLElement[], {
        types: "lines",
        lineClass: "innnerLine",
      });

      const innerLines = textElement.querySelectorAll(".line .innnerLine");
      
      if (innerLines.length > 0) {
        // Définir l'état initial des lignes (cachées)
        gsap.set(Array.from(innerLines) as HTMLElement[], {
          y: "200%",
          opacity: 0,
          skewX: -10,
        });
        
        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: textElement,
          start: "top 80%",
          onEnter: () => {
            console.log('[SectorOnePage] ScrollTrigger onEnter triggered, isMenuOpen:', isMenuOpen);
            // Vérifier à nouveau si le menu est ouvert avant d'animer
            if (isMenuOpen) {
              console.log('[SectorOnePage] Menu is open, skipping animation');
              return;
            }
            console.log('[SectorOnePage] Animating text');
            // Animer l'apparition directement
            gsap.to(
              Array.from(innerLines) as HTMLElement[],
              {
                y: "0%",
                opacity: 1,
                skewX: 0,
                duration: 1.5,
                delay: 0.25,
                stagger: 0.12,
                ease: CustomEase.create("custom", "M0,0,C0.5,0,0,1,1,1"),
              },
            );
          },
          once: true,
        });
        console.log('[SectorOnePage] ScrollTrigger created successfully');
      }
    }

    return () => {
      console.log('[SectorOnePage] Cleaning up ScrollTrigger');
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [isMenuOpen]);

  // Switch automatique entre les jerseys
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJersey((prev) => (prev === 'black' ? 'white' : 'black'));
    }, 2000); // Change toutes les 2 secondes

    return () => clearInterval(interval);
  }, []);

  // Smooth scroll avec GSAP - Version plus fiable et visible
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMenuOpen) return; // Ne pas activer le smooth scroll si le menu est ouvert
    
    // Désactiver le smooth scroll sur mobile (scroll natif)
    const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return; // Scroll natif sur mobile

    gsap.registerPlugin(ScrollTrigger);
    
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;
    let scrollTween: gsap.core.Tween | null = null;
    let rafId: number | null = null;

    const updateScroll = () => {
      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
        window.scrollTo(0, currentScroll);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        return;
      }

      // Interpolation fluide avec easing
      currentScroll += (targetScroll - currentScroll) * 0.1;
      window.scrollTo(0, currentScroll);
      
      rafId = requestAnimationFrame(updateScroll);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY;
      targetScroll += delta;
      
      // Limiter la position cible
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      // Démarrer l'animation si pas déjà en cours
      if (!rafId) {
        rafId = requestAnimationFrame(updateScroll);
      }
    };

    // Pour le touch, on laisse le scroll natif mais on ajoute un smooth à la fin
    let touchStartY = 0;
    let touchStartScroll = 0;
    let touchVelocity = 0;
    let touchLastY = 0;
    let touchLastTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartScroll = window.scrollY;
      touchLastY = touchStartY;
      touchLastTime = performance.now();
      touchVelocity = 0;
      currentScroll = touchStartScroll;
      targetScroll = touchStartScroll;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const currentTime = performance.now();
      const deltaY = touchLastY - currentY;
      const deltaTime = currentTime - touchLastTime;
      
      if (deltaTime > 0) {
        touchVelocity = (deltaY / deltaTime) * 16;
      }
      
      // Scroll direct pendant le touch
      const newScroll = touchStartScroll + (touchStartY - currentY);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const clampedScroll = Math.max(0, Math.min(newScroll, maxScroll));
      
      window.scrollTo(0, clampedScroll);
      currentScroll = clampedScroll;
      targetScroll = clampedScroll;
      
      touchLastY = currentY;
      touchLastTime = currentTime;
    };

    const onTouchEnd = () => {
      // Appliquer le momentum avec GSAP
      if (Math.abs(touchVelocity) > 0.5) {
        const momentum = touchVelocity * 200;
        targetScroll = currentScroll + momentum;
        
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        
        // Animer vers la position finale avec GSAP
        if (scrollTween) {
          scrollTween.kill();
        }
        
        scrollTween = gsap.to({ value: currentScroll }, {
          value: targetScroll,
          duration: 1,
          ease: "power2.out",
          onUpdate: function() {
            window.scrollTo(0, this.targets()[0].value);
            currentScroll = this.targets()[0].value;
          },
          onComplete: () => {
            targetScroll = currentScroll;
          }
        });
      }
    };

    // Écouter les événements
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (scrollTween) {
        scrollTween.kill();
      }
    };
  }, [isMenuOpen]);

  return (
    <>
      <Cursor />
      <HeaderNavigation />

      <main className="min-h-screen bg-[#090909] relative flex flex-col">
        {/* Hero Section avec vidéo */}
        <section className="section section__1 darkGradient first relative z-0 text-colorLight" style={{ isolation: 'isolate' }}>
          {/* Vidéo en plein écran sans bords arrondis */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
              style={{ pointerEvents: 'none' }}
            >
              <source
                src="/img/Project/Poject Sector One/HEADER VIDEO.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <Bulge type="Light" />
          <Header color="Light" />
          <HeroLogo />

          {/* Contenu principal aligné à gauche, centré verticalement - même disposition que page d'accueil */}
          <div className="absolute inset-0 flex flex-col items-start justify-center z-10 pointer-events-none" style={{ pointerEvents: 'none' }}>
            <div className="flex-1 flex flex-col items-start justify-center text-left pl-[15%] md:pl-[20%] lg:pl-[25%] max-w-7xl relative z-10">
              {/* Logo Sector One au-dessus du paragraphe */}
              <div ref={logoRef} className="mb-8">
                <Image
                  src="/img/Project/Poject Sector One/Sector One logo.webp"
                  alt="Sector One Logo"
                  width={80}
                  height={80}
                  className="object-contain w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                />
              </div>

              {/* Paragraphe descriptif avec les mêmes propriétés que la page d'accueil */}
              <p 
                ref={textRef}
                className="text-white text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-8 lowercase overflow-hidden hero-text-paragraph"
              >
                <span className="!lowercase">sector one</span> is the leading esports organization in Belgium, <span>with</span> a strong presence across the French-speaking competitive scene. <span>with</span> multiple titles and appearances in high-profile leagues, <span className="!lowercase">sector one</span> is the leader of esports in the Benelux.
              </p>

            </div>
          </div>

          {/* Date en bas à gauche - même style que NRV sur la page d'accueil */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[100] pointer-events-none">
            <p className="text-white text-[10px] md:text-xs font-light">
              Sep 24, 2024
            </p>
          </div>

          {/* Icône de souris animée centrée en bas */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-8 z-[100] pointer-events-none">
            <div className="scroll-indicator">
              <div className="mouse">
                <div className="mouse-wheel"></div>
              </div>
            </div>
          </div>

          {/* Catégorie en bas à droite - même style que Agency sur la page d'accueil */}
          <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-[100] pointer-events-none">
            <p className="text-white text-[10px] md:text-xs font-light">
              Branding
            </p>
          </div>
        </section>

        {/* Section avec texte et photo */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw py-20 max-w-[1690px]">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16 items-start">
              {/* Colonne gauche - Texte */}
              <div className="space-y-8 h-full">
                {/* Back to Projects */}
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors uppercase text-sm tracking-wider"
                >
                  <span>←</span>
                  <span>BACK TO PROJECTS</span>
                </Link>

                {/* Date */}
                <p className="text-white text-sm">Sep 24, 2024</p>

                {/* Catégorie */}
                <div className="inline-block">
                  <span className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-wider">
                    Branding
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-4 text-white">
                  <p className="text-base leading-relaxed">
                    As the agency behind their full rebranding and marketing strategy, we led the creative direction across every touchpoint. We redesigned the entire visual identity from team jerseys and merchandise to social media branding ensuring a cohesive and impactful look and feel. We also produced a wide range of high-performing content: player and roster announcements, match-day visuals, behind-the-scenes photography, snack content for social media, and playful YouTube videos that brought fans closer to their favorite players. This comprehensive content strategy not only amplified SectorOne&apos;s visibility and community engagement but also helped solidify their position as a powerhouse in the Belgian and European esports ecosystem.
                  </p>
                </div>

                {/* Navigation Previous/Next */}
                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <Link
                    href="#"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      <Image
                        src="/img/Project/Project 1 Pardesssus 19.webp"
                        alt="Previous project"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        Previous
                      </p>
                      <p className="text-white group-hover:text-white/80 transition-colors text-sm">
                        Pardesssus 19
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/work/samsung"
                    className="flex items-center gap-4 group text-right"
                  >
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        Next
                      </p>
                      <p className="text-white group-hover:text-white/80 transition-colors text-sm">
                        Samsung
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      <Image
                        src="/img/Project/Project  3 Samsung.webp"
                        alt="Next project"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Colonne droite - Photo */}
              <div className="w-full h-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One image behind the scene.webp"
                  alt="Sector One behind the scene"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section vidéo */}
        <section className="relative w-full bg-[#090909]">
          <div className="w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            >
              <source
                src="/img/Project/Poject Sector One/Jersey video.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </section>

        {/* Section texte et jerseys */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pt-8 pb-20 max-w-[1690px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Colonne gauche - Texte */}
              <div className="pl-[15%] md:pl-[20%] lg:pl-0">
                <p 
                  ref={jerseyTextRef}
                  className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed lowercase overflow-hidden hero-text-paragraph"
                >
                  <span>We</span> handled the design and creation of Sector One&apos;s jerseys and merchandise, from concept to print, ensuring every piece reflects their brand identity.
                </p>
              </div>

              {/* Colonne droite - Photos qui alternent */}
              <div className="relative w-full flex justify-center items-center">
                <div className="relative w-3/4 aspect-square">
                  <Image
                    src="/img/Project/Poject Sector One/Jersey Black.webp"
                    alt="Jersey Black"
                    width={1200}
                    height={1200}
                    quality={100}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      currentJersey === 'black' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Image
                    src="/img/Project/Poject Sector One/Jersey White.webp"
                    alt="Jersey White"
                    width={1200}
                    height={1200}
                    quality={100}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                      currentJersey === 'white' ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Galerie photos en damier */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            <div className="grid grid-cols-3 gap-2">
              {/* Première ligne - 3 photos */}
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch 2.webp"
                  alt="Sector One merch 2"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch 4.webp"
                  alt="Sector One merch 4"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch.webp"
                  alt="Sector One merch"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Deuxième ligne - 2 photos qui prennent toute la largeur */}
              <div className="col-span-3 grid grid-cols-2 gap-2">
                <div className="w-full">
                  <Image
                    src="/img/Project/Poject Sector One/Sector One merch 11.webp"
                    alt="Sector One merch 11"
                    width={1200}
                    height={1600}
                    quality={100}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="w-full">
                  <Image
                    src="/img/Project/Poject Sector One/Sector One merch 10.webp"
                    alt="Sector One merch 10"
                    width={1200}
                    height={1600}
                    quality={100}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              {/* Troisième ligne - 3 photos */}
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch 12.webp"
                  alt="Sector One merch 12"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch5.webp"
                  alt="Sector One merch 5"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Poject Sector One/Sector One merch6.webp"
                  alt="Sector One merch 6"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer className="relative bottom-0 mt-auto py-8" />
      </main>
    </>
  );
}

