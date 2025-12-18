import React, { use, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { Header } from "./header";
import { useAppSelector } from "@/hooks/reduxHooks";
import { Footer } from "./contactSection/footer";
import Magentic from "./ui/magentic";
import { isDesktop } from "@/lib/utils";
import { link } from "fs";
import { links } from "@/data/data";

// Enregistrer CustomEase une seule fois au niveau du module
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export function HeaderNavigation() {
  const { isMenuOpen, color } = useAppSelector((state) => state.menuReducer);
  const possibleTailwindClasses = [
    "text-colorDark",
    "text-colorLight",
    "lightGradient",
    "darkGradient",
  ];

  // Créer l'ease une seule fois avec useMemo
  const ease = useMemo(() => {
    return CustomEase.create("custom", "M0,0 C0.52,0.01 0.16,1 1,1 ");
  }, []);

  const headerAnimation = useRef<gsap.core.Timeline | null>(null);
  const closeAnimation = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const flexHeight = isDesktop() ? "20vh" : "7vh";
    
    // Animation d'ouverture
    headerAnimation.current = gsap
      .timeline({ paused: true })
      .set("#headerNavigation", {
        display: "flex",
      })
      .fromTo(
        "#headerNavigation",
        {
          y: "-100%",
        },
        {
          y: "0%",
          duration: 1,
          ease,
        }
      )
      .fromTo(
        "#headerNavigation .rounded__div__up",
        {
          height: flexHeight,
        },
        {
          height: "0vh",
          duration: 1,
          ease,
        },
        "-=0.9",
      )
      .fromTo(
        ".headerAnimate",
        {
          y: "-20vh",
        },
        {
          y: "0vh",
          duration: 1,
          stagger: -0.08,
          ease,
        },
        "-=1.2",
      );

    // Animation de fermeture (remonte vers le haut)
    closeAnimation.current = gsap
      .timeline({ paused: true })
      .to("#headerNavigation", {
        y: "-100%",
        duration: 1,
        ease,
      })
      .to(
        "#headerNavigation .rounded__div__up",
        {
          height: flexHeight,
          duration: 1,
          ease,
        },
        "-=0.9",
      )
      .to(
        ".headerAnimate",
        {
          y: "-20vh",
          duration: 1,
          stagger: -0.08,
          ease,
        },
        "-=1.2",
      )
      .set("#headerNavigation", {
        display: "none",
      });

    return () => {
      headerAnimation.current?.kill();
      closeAnimation.current?.kill();
    };
  }, [ease]);

  useEffect(() => {
    console.log('[HeaderNavigation] isMenuOpen changed:', isMenuOpen);
    
    if (isMenuOpen) {
      console.log('[HeaderNavigation] Opening menu...');
      
      // Verrouiller le scroll quand le menu est ouvert
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      
      // Désactiver tous les ScrollTriggers
      const allTriggers = ScrollTrigger.getAll();
      console.log('[HeaderNavigation] Disabling', allTriggers.length, 'ScrollTriggers');
      allTriggers.forEach(trigger => trigger.disable());
      
      gsap.set("#headerNavigation", { display: "flex" });
      headerAnimation.current?.restart();
      
    } else {
      console.log('[HeaderNavigation] Closing menu...');
      
      // Réactiver le scroll IMMÉDIATEMENT quand le menu se ferme
      // (pas besoin d'attendre l'animation)
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      
      closeAnimation.current?.restart();
      
      // Réactiver les ScrollTriggers après l'animation de fermeture
      const timeoutId = setTimeout(() => {
        console.log('[HeaderNavigation] Re-enabling ScrollTriggers');
        
        // Réactiver les ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.enable());
        // Rafraîchir ScrollTrigger de manière asynchrone pour éviter les conflits
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      }, 1100); // Après la durée de l'animation (1 seconde)
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isMenuOpen]);

  const headerData = [
    {
      name: "Home",
      href: links.home,
    },

    {
      name: "Work",
      href: links.work,
    },
    {
      name: "Contact",
      href: links.email,
    },
    {
      name: "Linkedin",
      href: links.linkedin,
    },
  ];
  return (
    <>
      <div
        id="headerNavigation"
        className="fixed left-0 top-0 z-[6000] hidden h-full w-full -translate-y-full flex-col items-center justify-center p-paddingX"
      >
        <Header
          mode="cross"
          className="headerAnimate"
          color={color == "Light" ? "Dark" : "Light"}
        />
        <nav>
          <ul className="mask flex flex-col items-center justify-center px-8 py-[10vh]">
            {headerData.map((data) => (
              <li className="headerAnimate" key={data.name}>
                <Magentic
                  className={`text-[clamp(32px,_3.3vw_+_32px,_88px)] font-bold text-color${
                    color == "Light" ? "Dark" : "Light"
                  }`}
                  scrambleParams={{
                    text: data.name,
                    chars: "-xx",
                  }}
                  href={data.href}
                >
                  <span className="scrambleText">{data.name}</span>
                </Magentic>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute left-0 top-0 -z-40 flex h-full w-full flex-col ">
          <div
            className={`${
              color == "Light" ? "lightGradient" : "darkGradient"
            } h-full w-full grow `}
          ></div>
          <div className="rounded__div__up  !relative z-50">
            <div
              className={`round__bg__up ${
                color == "Light" ? "lightGradient" : "darkGradient"
              }`}
            ></div>
          </div>
        </div>
        <Footer className="headerAnimate bottom-2 z-10 w-full" />
      </div>
    </>
  );
}
