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

export default function SamsungPage() {
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
      console.log('[SamsungPage] Menu is open, skipping animation setup');
      return;
    }
    
    console.log('[SamsungPage] Setting up animation for bottom text');
    gsap.registerPlugin(ScrollTrigger);

    const textElement = jerseyTextRef.current;
    if (!textElement) {
      console.log('[SamsungPage] Bottom text element not found');
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
          console.log('[SamsungPage] Text entered viewport, animating');
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
            {/* Vidéo pour desktop */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hidden md:block w-full h-full object-cover pointer-events-none"
              style={{ pointerEvents: 'none' }}
            >
              <source
                src="/img/Project/Samsung/Header projet samsung.mp4"
                type="video/mp4"
              />
            </video>
            {/* Vidéo pour mobile */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="block md:hidden w-full h-full object-cover pointer-events-none"
              style={{ pointerEvents: 'none' }}
            >
              <source
                src="/img/Project/Samsung/Sasmung vertical video header.mp4"
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
              {/* Logo Samsung au-dessus du paragraphe */}
              <div ref={logoRef} className="mb-8">
                <Image
                  src="/img/Project/Samsung/Samsung x sharingbox logo 2.webp"
                  alt="Samsung Logo"
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
                <span>We</span> turned a live activation into a high-performing content library for <span className="!lowercase">samsung</span> and <span className="!lowercase">sharingbox</span>.
              </p>

            </div>
          </div>

          {/* Date en bas à gauche - même style que NRV sur la page d'accueil */}
          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-[100] pointer-events-none">
            <p className="text-white text-[10px] md:text-xs font-light">
              Jan 15, 2025
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
                <p className="text-white text-sm">Jan 15, 2025</p>

                {/* Catégorie */}
                <div className="inline-block">
                  <span className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-wider">
                    Content Production
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-4 text-white">
                  <p className="text-base leading-relaxed">
                    Sharingbox is a global leader in immersive photo and video event experiences, creating phygital activations that boost brand awareness, capture compliant data, and drive lead generation.
                  </p>
                  <p className="text-base leading-relaxed">
                    For Samsung&apos;s Brussels activation, Samsung branded the iconic &quot;The View&quot; Ferris wheel in Galaxy AI visuals and installed Sharingbox&apos;s ScanCapture in every cabin so visitors could test the latest Galaxy phones, take high-resolution photos and short videos during the ride, then redeem professional prints at on-site stations. Our agency captured the entire experience in photo and video, delivering a social-ready content library used by Samsung and Sharingbox to amplify the Galaxy launch and sustain engagement with locals and tourists.
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
                    href="#"
                    className="flex items-center gap-4 group text-right"
                  >
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider">
                        Next
                      </p>
                      <p className="text-white group-hover:text-white/80 transition-colors text-sm">
                        Enthusiast Music
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                      <Image
                        src="/img/Project/Project 4 Enthusiast Music.webp"
                        alt="Next project"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Colonne droite - Vidéo avec contrôles */}
              <div className="w-full h-full">
                <video
                  controls
                  className="w-full h-full object-cover"
                  preload="metadata"
                >
                  <source
                    src="/img/Project/Samsung/SharingBox-SamsungV3.mp4"
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Galerie photos - 3 photos côte à côte + 1 photo horizontale */}
        <section className="relative w-full bg-[#090909]">
          <div className="container mx-auto px-6vw pb-20 max-w-[1690px]">
            <div className="grid grid-cols-3 gap-2">
              {/* Première ligne - 3 photos */}
              <div className="w-full">
                <Image
                  src="/img/Project/Samsung/Samsung 4.webp"
                  alt="Samsung 4"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Samsung/Samsung 1.webp"
                  alt="Samsung 1"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-full">
                <Image
                  src="/img/Project/Samsung/Samsung 2.webp"
                  alt="Samsung 2"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Deuxième ligne - Photo horizontale qui prend toute la largeur */}
              <div className="col-span-3 w-full">
                <Image
                  src="/img/Project/Samsung/Samsung Conclusion.webp"
                  alt="Samsung Conclusion"
                  width={1200}
                  height={1600}
                  quality={100}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section texte avec background */}
        <section className="relative w-full min-h-screen bg-[#090909] overflow-hidden">
          {/* Background image qui prend tout l'écran */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/Project/Samsung/Samsung Conclusion 2.webp"
              alt="Samsung Conclusion Background"
              fill
              className="object-cover"
              quality={100}
              priority
            />
            {/* Overlay pour assurer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          <div className="container mx-auto px-6vw py-20 max-w-[1690px] relative z-10 min-h-screen flex items-center">
            <div className="pl-[15%] md:pl-[20%] lg:pl-0 max-w-[50%]">
              <p 
                ref={jerseyTextRef}
                className="text-white text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed lowercase hero-text-paragraph-bottom"
                style={{ overflow: 'visible', paddingBottom: '0.2em' }}
              >
                <span>Every</span> activation deserves a story that lives beyond the day. We capture it end-to-end and deliver assets made for social and marketing.
              </p>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer className="relative bottom-0 mt-auto py-8" />
      </main>
    </>
  );
}

