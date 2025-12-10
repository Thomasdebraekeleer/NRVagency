"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

type IntroRevealProps = {
  images: string[];
  speedMs?: number;
  swipeDuration?: number;
};

export default function IntroReveal({ 
  images, 
  speedMs = 120, 
  swipeDuration = 0.65 
}: IntroRevealProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const [done, setDone] = useState(false);
  const [isPreloading, setIsPreloading] = useState(true);

  // S'assurer qu'on a exactement 5 images
  const imgs = useMemo(() => {
    if (images.length !== 5) {
      console.warn(`IntroReveal attend exactement 5 images, reçu ${images.length}. Utilisation des 5 premières.`);
    }
    return images.slice(0, 5);
  }, [images]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!imgs.length || done) return;

    // Vérifier si l'intro a déjà été vue dans cette session
    const introSeen = sessionStorage.getItem('introSeen');
    if (introSeen === '1') {
      setDone(true);
      return;
    }

    // Vérifier les préférences de mouvement réduit
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Verrouiller le scroll et bloquer l'interaction
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevHtmlPointerEvents = html.style.pointerEvents;
    const prevBodyPointerEvents = body.style.pointerEvents;
    
    // Désactiver fullpage temporairement
    const fullpageContainer = document.querySelector('#fullpage');
    const prevFullpageStyle = fullpageContainer ? fullpageContainer.getAttribute('style') : null;
    
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.pointerEvents = "none";
    body.style.pointerEvents = "none";
    
    if (fullpageContainer) {
      fullpageContainer.setAttribute('style', 'pointer-events: none !important;');
    }

    let tl: gsap.core.Timeline | null = null;
    let cancelled = false;

    // Précharger toutes les images
    const preload = Promise.all(
      imgs.map(src => 
        new Promise<void>(resolve => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continuer même si une image échoue
          img.src = src;
        })
      )
    );

    preload.then(() => {
      if (cancelled) return;
      
      setIsPreloading(false);
      
      // Si mouvement réduit, masquer immédiatement
      if (reduceMotion) {
        setDone(true);
        sessionStorage.setItem('introSeen', '1');
        return;
      }

      // Créer la timeline GSAP
      const hold = Math.max(40, speedMs); // Limite de sécurité
      tl = gsap.timeline({ 
        defaults: { ease: "none" },
        onComplete: () => {
          setDone(true);
          sessionStorage.setItem('introSeen', '1');
        }
      });

      // Masquer toutes les images initialement
      imgRefs.current.forEach(el => {
        if (el) gsap.set(el, { autoAlpha: 0 });
      });

      // Séquence rapide des images 0 à 4
      const timeline = tl;
      if (!timeline) return;
      imgs.forEach((_, i) => {
        const imgRef = imgRefs.current[i];
        if (imgRef) {
          timeline.set(imgRef, { autoAlpha: 1 });
          if (i < imgs.length - 1) {
            timeline.set(imgRef, { autoAlpha: 0 }, `+=${hold/1000}`);
          }
        }
      });

      // Après la dernière image, faire glisser l'overlay vers le haut
      tl.to(overlayRef.current, { 
        yPercent: -100, 
        duration: swipeDuration, 
        ease: "power3.inOut" 
      }, `+=${hold/1000}`);
    });

    return () => {
      cancelled = true;
      tl?.kill();
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      html.style.pointerEvents = prevHtmlPointerEvents;
      body.style.pointerEvents = prevBodyPointerEvents;
      
      // Restaurer fullpage
      if (fullpageContainer) {
        if (prevFullpageStyle) {
          fullpageContainer.setAttribute('style', prevFullpageStyle);
        } else {
          fullpageContainer.removeAttribute('style');
        }
      }
    };
  }, [imgs, speedMs, swipeDuration, done]);

  useEffect(() => {
    if (done) {
      // Nettoyer le verrouillage du scroll et pointer events quand terminé
      const html = document.documentElement;
      const body = document.body;
      const fullpageContainer = document.querySelector('#fullpage');
      
      html.style.overflow = "";
      body.style.overflow = "";
      html.style.pointerEvents = "";
      body.style.pointerEvents = "";
      
      // Restaurer fullpage
      if (fullpageContainer) {
        fullpageContainer.removeAttribute('style');
      }
    }
  }, [done]);

  if (done) return null;

  return (
    <div 
      ref={overlayRef} 
      role="dialog" 
      aria-modal="true" 
      aria-label="Intro" 
      className="fixed inset-0 z-[99999] bg-black will-change-transform"
    >
      <div className="relative w-full h-full">
        {imgs.map((src, i) => (
          <Image
            key={i}
            ref={(el) => { 
              if (el) imgRefs.current[i] = el; 
            }}
            src={src}
            alt=""
            fill
            priority
            className="object-cover select-none pointer-events-none"
            sizes="100vw"
            draggable={false}
          />
        ))}
        
        {/* Indicateur de chargement simple */}
        {isPreloading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
