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
    .hero-text-paragraph span {
      text-transform: capitalize !important;
    }
    .hero-text-paragraph-bottom .line {
      position: relative;
      display: inline-block;
    }
    .hero-text-paragraph-bottom span {
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

export default function AliasingPage() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const jerseyTextRef = useRef<HTMLParagraphElement>(null);
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
          // Ajouter du padding en bas aux lignes pour éviter que les lettres descendent (comme G) soient coupées
          lines.forEach((line) => {
            (line as HTMLElement).style.paddingBottom = '0.2em';
            (line as HTMLElement).style.overflow = 'visible';
          });
          
          const myText2 = new SplitType(Array.from(lines) as HTMLElement[], {
            types: "lines",
            lineClass: "innnerLine",
          });

          const innerLines = textRef.current!.querySelectorAll(".line .innnerLine");
          
          if (innerLines.length > 0) {
            // S'assurer que les innerLines ont aussi overflow visible
            innerLines.forEach((line) => {
              (line as HTMLElement).style.overflow = 'visible';
            });
            
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
      console.log('[AliasingPage] Menu is open, skipping animation setup');
      return;
    }
    
    console.log('[AliasingPage] Setting up animation for bottom text');
    gsap.registerPlugin(ScrollTrigger);

    const textElement = jerseyTextRef.current;
    if (!textElement) {
      console.log('[AliasingPage] Bottom text element not found');
      return;
    }
    
    let hasAnimated = false;
    let innerLines: HTMLElement[] = [];
    
    // Cacher le texte parent initialement
    gsap.set(textElement, { opacity: 0 });
    
    // Fonction pour vérifier si l'élément est visible et animer
    const checkAndAnimate = () => {
      if (hasAnimated || isMenuOpen) return;
      
      const rect = textElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.8; // 80% de la hauteur de la fenêtre
      
      // Vérifier si l'élément est entré dans le viewport
      if (rect.top < triggerPoint && rect.bottom > 0) {
        if (innerLines.length > 0) {
          console.log('[AliasingPage] Text entered viewport, animating');
          hasAnimated = true;
          gsap.set(textElement, { opacity: 1 });
          gsap.to(
            innerLines,
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
        }
      }
    };
    
    // Initialiser SplitType et préparer l'animation
    const initAnimation = () => {
      const myText = new SplitType(textElement, { types: "lines" });
      const lines = textElement.querySelectorAll(".line");
      
      if (lines.length > 0) {
        lines.forEach((line) => {
          (line as HTMLElement).style.paddingBottom = '0.2em';
          (line as HTMLElement).style.overflow = 'visible';
        });
        
        const myText2 = new SplitType(Array.from(lines) as HTMLElement[], {
          types: "lines",
          lineClass: "bottomInnerLine",
        });

        innerLines = Array.from(textElement.querySelectorAll(".line .bottomInnerLine")) as HTMLElement[];
        
        if (innerLines.length > 0) {
          innerLines.forEach((line) => {
            line.style.overflow = 'visible';
          });
          
          // Définir l'état initial
          gsap.set(innerLines, {
            y: "200%",
            opacity: 0,
            skewX: -10,
          });
          
          // Vérifier immédiatement si déjà visible
          checkAndAnimate();
          
          // Créer un ScrollTrigger avec onUpdate pour vérifier à chaque frame
          scrollTriggerRef.current = ScrollTrigger.create({
            trigger: textElement,
            start: "top 80%",
            onUpdate: (self) => {
              checkAndAnimate();
            },
            onEnter: () => {
              checkAndAnimate();
            },
            onToggle: (self) => {
              if (self.isActive) {
                checkAndAnimate();
              }
            },
          });
          
          // Écouter aussi les événements de scroll manuellement
          const handleScroll = () => {
            if (!hasAnimated) {
              checkAndAnimate();
            }
          };
          
          window.addEventListener('scroll', handleScroll, { passive: true });
          window.addEventListener('wheel', handleScroll, { passive: true });
          
          // Vérifier périodiquement (pour le smooth scroll)
          const checkInterval = setInterval(() => {
            if (!hasAnimated) {
              checkAndAnimate();
            } else {
              clearInterval(checkInterval);
            }
          }, 100);
          
          return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleScroll);
            clearInterval(checkInterval);
          };
        }
      }
    };
    
    setTimeout(initAnimation, 300);

    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [isMenuOpen]);

  // Smooth scroll avec GSAP - Version plus fiable et visible
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMenuOpen) return; // Ne pas activer le smooth scroll si le menu est ouvert

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
                src="/img/Project/Aliasing/Video pardessus 19 header.mp4"
                type="video/mp4"
              />
            </video>
            {/* Overlay noir avec opacité pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
          </div>
          <Bulge type="Light" />
          <Header color="Light" />
          <HeroLogo />

          {/* Contenu principal aligné à gauche, centré verticalement - même disposition que page d'accueil */}
          <div className="absolute inset-0 flex flex-col items-start justify-center z-10 pointer-events-none" style={{ pointerEvents: 'none' }}>
            <div className="flex-1 flex flex-col items-start justify-center text-left pl-[15%] md:pl-[20%] lg:pl-[25%] max-w-7xl relative z-10">
              {/* Logo Aliasing au-dessus du paragraphe */}
              <div ref={logoRef} className="mb-8">
                <Image
                  src="/img/Project/Aliasing/Aliasing Logo.webp"
                  alt="Aliasing Logo"
                  width={80}
                  height={80}
                  className="object-contain w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                />
              </div>

              {/* Paragraphe descriptif avec les mêmes propriétés que la page d'accueil */}
              <p 
                ref={textRef}
                className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed mb-8 lowercase hero-text-paragraph"
                style={{ overflow: 'visible', paddingBottom: '0.3em' }}
              >
                <span className="!lowercase">Aliasing</span> is a Swiss digital content creation studio delivering a full 360° creative pipeline from concept and design to 2D/3D motion, all the way to final delivery. With a strong eye for aesthetics and brand storytelling, they create high-end visuals and content for premium brands, including luxury and beyond.
              </p>

            </div>
          </div>

          {/* Date en bas à gauche - même style que NRV sur la page d'accueil */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[100] pointer-events-none">
            <p className="text-white text-[10px] md:text-xs font-light">
              Oct 1, 2025
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
              Content Production
            </p>
          </div>
        </section>

        {/* Section avec texte et vidéo */}
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
                <p className="text-white text-sm">Oct 1, 2025</p>

                {/* Catégorie */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-wider">
                    Content Production
                  </span>
                  <span className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-wider">
                    AI Generation
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-4 text-white">
                  <p className="text-base leading-relaxed">
                    As part of Aliasing&apos;s creative team for their luxury clients Pardessus19, Pignatelli, and Jean-Luc Amsler NRV Agency joined the project as their Swiss-based artistic support. For the Zurich fashion show held in November, we collaborated closely with Aliasing and Emilia Romo to bring the creative vision to life through video: handling the full editing and production workflow, while co-developing AI-generated models tailored to each brand&apos;s identity. The final visuals were designed for large-scale impact and were broadcast on two giant screens during the show, delivering an impressive, forward-thinking experience. While Aliasing led the overall art direction, we ensured every concept was translated seamlessly into a high-end, screen-ready video format.
                  </p>
                </div>

                {/* Navigation Previous/Next */}
                <div className="flex items-center justify-between pt-8 border-t border-white/10">
                  <Link
                    href="/work/sector-one"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      <Image
                        src="/img/Project/Project  2 Sector One.webp"
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
                        Sector One
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

              {/* Colonne droite - Vidéo en boucle sans contrôles */}
              <div className="w-full h-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source
                    src="/img/Project/Aliasing/Aliasing project video.mp4"
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Section Pardessus 19 */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            {/* Logo Pardessus 19 */}
            <div className="mb-12 flex justify-center">
              <Image
                src="/img/Project/Aliasing/Pardessus 19 logo.webp"
                alt="Pardessus 19 Logo"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Vidéos en boucle sans contrôles */}
            <div className="space-y-4">
              {/* Vidéo 1 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pardessus 19 1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 2 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pardessus 19 2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 3 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pardessus 19 3.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 4 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pardessus 19 4.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Section Pignatelli */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            {/* Logo Pignatelli */}
            <div className="mb-12 flex justify-center">
              <Image
                src="/img/Project/Aliasing/Pignatelli Logo.webp"
                alt="Pignatelli Logo"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Vidéos en boucle sans contrôles */}
            <div className="space-y-4">
              {/* Vidéo 1 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 2 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 3 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 3.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 4 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 4.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 5 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 5.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 6 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 6.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 7 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 7.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 8 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Pignatelli 8.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Section Jean-Luc Amsler */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            {/* Logo Jean-Luc Amsler */}
            <div className="mb-12 flex justify-center">
              <Image
                src="/img/Project/Aliasing/Jean luc amsler  logo.webp"
                alt="Jean-Luc Amsler Logo"
                width={200}
                height={100}
                className="object-contain"
              />
            </div>

            {/* Vidéos en boucle sans contrôles */}
            <div className="space-y-4">
              {/* Vidéo 1 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Jean Luc amsler 1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 2 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Jean Luc amsler 2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 3 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Jean Luc amsler 3.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 4 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Jean Luc amsler 4.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              {/* Vidéo 5 */}
              <div className="w-full">
                <div className="relative bg-[#090909] px-4 py-2 flex justify-between items-center">
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 1</p>
                  <p className="text-white text-sm font-light uppercase tracking-wider">screen 2</p>
                </div>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Double screen Jean Luc amsler 5.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Section Aftermovie */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            {/* Titre */}
            <div className="mb-8">
              <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-light uppercase tracking-wider text-center">
                Aftermovie
              </h2>
              <p className="text-white text-sm md:text-base text-center mt-3 font-light leading-relaxed max-w-2xl mx-auto">
                A behind-the-scenes look at how our visuals came to life during the Fashion show, capturing the energy and impact of the live experience.
              </p>
            </div>

            {/* Vidéo Aftermovie */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-4xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source
                    src="/img/Project/Aliasing/Video aftermovie Aliasing.mp4"
                    type="video/mp4"
                  />
                </video>
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
