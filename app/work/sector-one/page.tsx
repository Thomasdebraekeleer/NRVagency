"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cursor } from "@/components/cursor";
import { Header } from "@/components/header";
import { HeaderNavigation } from "@/components/headerNavigation";

// Style global pour forcer le background sur le pin-spacer
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .pin-spacer {
      background-color: #090909 !important;
    }
    [data-pinned] {
      background-color: #090909 !important;
    }
  `;
  document.head.appendChild(style);
}

// Enregistrer le plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const projectImages = [
  "Sector one team announcement 3.webp",
  "Sector one team announcement 2.webp",
  "Sector one team announcement 1.webp",
  "Sector One merch kiraaa 3.webp",
  "Sector One merch kiraaa 1.webp",
  "Sector One merch kiraaa.webp",
  "Sector One merch 11.webp",
  "Sector One merch 9.webp",
  "Sector One merch 8.webp",
  "Sector One merch7.webp",
  "Sector One merch6.webp",
  "Sector One merch5.webp",
  "Sector One merch 4.webp",
  "Sector One merch 3.webp",
  "Sector One merch 2.webp",
  "Sector One merch.webp",
];

export default function SectorOnePage() {
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollSectionRef.current || !imagesContainerRef.current) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return; // Désactiver sur mobile

    const section = scrollSectionRef.current;
    const imagesContainer = imagesContainerRef.current;
    const images = imagesContainer.querySelectorAll(".project-image");

    if (images.length === 0) return;

    // DEBUG : Log pour vérifier le nombre d'images
    console.log("Nombre d'images:", images.length);

    // Calculer les dimensions
    const viewportHeight = window.innerHeight;
    const imageHeight = viewportHeight * 0.9;
    const gap = 24;
    const totalHeight = images.length * (imageHeight + gap) - gap;
    // CORRECTION : Le scrollDistance doit être la différence entre la hauteur totale et la hauteur visible
    // On veut scroller de (nombre d'images - 1) fois la hauteur d'une image + gap
    const scrollDistance = (images.length - 1) * (imageHeight + gap);

    console.log("scrollDistance calculé:", scrollDistance);
    console.log("totalHeight:", totalHeight);

    // Définir les dimensions
    gsap.set(imagesContainer, {
      height: totalHeight,
    });

    gsap.set(images, {
      height: imageHeight,
    });

    // FORCER le background AVANT le pinning
    // IMPORTANT : Ne pas appliquer de transform sur la section elle-même
    gsap.set(section, {
      backgroundColor: "#090909",
      position: "relative",
      zIndex: 10,
      // S'assurer qu'aucun transform n'est appliqué à la section
      clearProps: "transform",
    });

    // Fonction pour forcer le background sur tous les éléments créés par ScrollTrigger
    const forceBackground = () => {
      section.style.setProperty("background-color", "#090909", "important");
      // Forcer le background sur le pin-spacer créé par ScrollTrigger
      const pinSpacers = document.querySelectorAll(".pin-spacer");
      pinSpacers.forEach((spacer) => {
        (spacer as HTMLElement).style.setProperty("background-color", "#090909", "important");
      });
      // Forcer aussi sur le wrapper créé par ScrollTrigger
      const pinnedElement = section.querySelector("[data-pinned]");
      if (pinnedElement) {
        (pinnedElement as HTMLElement).style.setProperty("background-color", "#090909", "important");
      }
    };

    // Créer le ScrollTrigger
    // IMPORTANT : Utiliser pinSpacing: false pour éviter les transforms sur la section
    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      markers: true, // ACTIVÉ POUR DEBUG
      anticipatePin: 1,
      // Empêcher ScrollTrigger d'appliquer des transforms à la section
      invalidateOnRefresh: true,
      // Callbacks pour maintenir le background visible et empêcher les transforms
      onUpdate: () => {
        forceBackground();
        // S'assurer qu'aucun transform n'est appliqué à la section
        gsap.set(section, { clearProps: "transform" });
      },
      onEnter: () => {
        forceBackground();
        gsap.set(section, { 
          clearProps: "transform",
          visibility: "visible",
          opacity: 1
        });
      },
      onLeave: () => {
        forceBackground();
        gsap.set(section, { clearProps: "transform" });
      },
      onEnterBack: () => {
        forceBackground();
        gsap.set(section, { 
          clearProps: "transform",
          visibility: "visible",
          opacity: 1
        });
      },
      onLeaveBack: () => {
        forceBackground();
        gsap.set(section, { clearProps: "transform" });
      },
    });

    // ANIMATION : UNIQUEMENT le conteneur d'images
    // Utiliser yPercent pour un calcul plus fiable
    const animation = gsap.to(imagesContainer, {
      y: -scrollDistance, // Translation verticale uniquement du conteneur d'images
      ease: "none",
      scrollTrigger: scrollTrigger,
    });

    // Observer les changements du DOM pour forcer le background sur les nouveaux éléments
    const observer = new MutationObserver(() => {
      forceBackground();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
      forceBackground();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      scrollTrigger.kill();
      animation.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Cursor />
      <HeaderNavigation />
      <Header color="Light" />

      <main className="min-h-screen bg-[#090909]">
        {/* Hero Section avec vidéo */}
        <section className="relative w-full h-screen overflow-hidden">
          {/* Vidéo en plein écran avec coins arrondis */}
          <div className="absolute inset-4 rounded-[24px] overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="/img/Project/Poject Sector One/HEADER VIDEO.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          {/* Contenu centré */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            {/* Titre */}
            <div className="text-center mb-8">
              <h1 className="text-6xl md:text-8xl font-bold text-white uppercase tracking-wider mb-2">
                Sector One
              </h1>
              <p className="text-xl md:text-2xl text-white/80 uppercase tracking-wider">
                Branding
              </p>
            </div>

            {/* Logos avec X */}
            <div className="flex items-center gap-6">
              <Image
                src="/img/Project/Poject Sector One/LOGO NRV.webp"
                alt="NRV Logo"
                width={100}
                height={100}
                className="object-contain w-[100px] h-[100px]"
              />
              <span className="text-white text-2xl font-light">×</span>
              <Image
                src="/img/Project/Poject Sector One/Sector One logo.webp"
                alt="Sector One Logo"
                width={100}
                height={100}
                className="object-contain w-[100px] h-[100px]"
              />
            </div>
          </div>

          {/* Date en bas à gauche */}
          <div className="absolute bottom-8 left-8 z-10 pointer-events-none">
            <p className="text-white text-sm md:text-base">
              Sep 24, 2025
            </p>
          </div>

          {/* Catégorie en bas à droite */}
          <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
            <p className="text-white text-sm md:text-base uppercase tracking-wider">
              Branding
            </p>
          </div>
        </section>

        {/* Section avec texte et photos scrollables */}
        <section
          ref={scrollSectionRef}
          className="relative w-full bg-[#090909]"
          style={{ minHeight: "200vh" }} // Hauteur suffisante pour le scroll
        >
          <div className="container mx-auto px-6vw py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-16">
              {/* Partie gauche - Texte (40%) - RESTE FIXE */}
              <div className="lg:sticky lg:top-20 lg:h-fit space-y-8 z-10">
                    {/* Back to Projects */}
                    <Link
                      href="/work"
                      className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors uppercase text-sm tracking-wider"
                    >
                      <span>←</span>
                      <span>BACK TO PROJECTS</span>
                    </Link>

                    {/* Date */}
                    <p className="text-white text-sm">Sep 24, 2025</p>

                    {/* Catégorie */}
                    <div className="inline-block">
                      <span className="px-4 py-2 bg-[#1a1a1a] text-white rounded-full text-sm uppercase tracking-wider">
                        Branding
                      </span>
                    </div>

                    {/* Description */}
                    <div className="space-y-4 text-white">
                      <p className="text-base leading-relaxed">
                        Sector One est une marque qui fusionne l&apos;innovation
                        technologique avec l&apos;excellence du design. Notre
                        mission était de créer une identité visuelle qui reflète
                        leur vision futuriste tout en restant accessible et
                        humaine.
                      </p>
                      <p className="text-base leading-relaxed">
                        À travers un système de branding cohérent, nous avons
                        développé une identité qui transcende les frontières entre
                        le digital et le physique, créant une expérience de marque
                        immersive et mémorable.
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
                        href="#"
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

              {/* Partie droite - Photos scrollables verticalement (60%) - CET ÉLÉMENT EST ANIMÉ */}
              <div className="lg:block hidden relative z-10">
                <div className="relative h-screen overflow-hidden">
                  {/* C'EST CE CONTENEUR QUI SERA ANIMÉ PAR GSAP */}
                  <div
                    ref={imagesContainerRef}
                    className="flex flex-col gap-6 project-images-track"
                    style={{ 
                      width: "100%",
                      // Debug : décommenter pour voir quel élément bouge
                      // border: "2px solid red"
                    }}
                  >
                    {projectImages.map((image, index) => (
                      <div
                        key={index}
                        className="project-image flex-shrink-0 w-full"
                      >
                        <div className="w-full rounded-[24px] overflow-hidden">
                          <Image
                            src={`/img/Project/Poject Sector One/${image}`}
                            alt={`Sector One project ${index + 1}`}
                            width={800}
                            height={1200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Version mobile - Photos empilées */}
              <div className="lg:hidden space-y-6">
                {projectImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-full rounded-[24px] overflow-hidden"
                  >
                    <Image
                      src={`/img/Project/Poject Sector One/${image}`}
                      alt={`Sector One project ${index + 1}`}
                      width={800}
                      height={1200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

