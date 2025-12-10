"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Cursor } from "@/components/cursor";
import { Header } from "@/components/header";
import Magentic from "@/components/ui/magentic";
import "../work.css";

const projectsData = [
  {
    id: 1,
    title: "Sector One",
    image: "/img/Project/Project  2 Sector One.webp",
    link: "#", // À remplacer par le lien vers la page du projet
  },
  {
    id: 2,
    title: "Pardesssus 19",
    image: "/img/Project/Project 1 Pardesssus 19.webp",
    link: "#", // À remplacer par le lien vers la page du projet
  },
  {
    id: 3,
    title: "Samsung",
    image: "/img/Project/Project  3 Samsung.webp",
    link: "#", // À remplacer par le lien vers la page du projet
  },
  {
    id: 4,
    title: "Enthusiast Music",
    image: "/img/Project/Project 4 Enthusiast Music.webp",
    link: "#", // À remplacer par le lien vers la page du projet
  },
  {
    id: 5,
    title: "Sinclair Pilates",
    image: "/img/Project/Project 6 Sinclair Pilates.webp",
    link: "#", // À remplacer par le lien vers la page du projet
  },
];

export default function WorkPage() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.gallery-item');
      
      gsap.fromTo(items, 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.9
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out"
        }
      );
    }
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.currentTarget.querySelector('.project-image');
    const overlay = e.currentTarget.querySelector('.project-overlay');

    gsap.to(image, {
      scale: 1.05,
      duration: 0.6,
      ease: "power2.out"
    });

    gsap.to(overlay, {
      opacity: 0.3,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const image = e.currentTarget.querySelector('.project-image');
    const overlay = e.currentTarget.querySelector('.project-overlay');

    gsap.to(image, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    });

    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <>
      <Cursor />
      <Header color="Light" />
      
      <div 
        className="min-h-screen"
        style={{ backgroundColor: '#0a0e0f' }}
      >
        <div className="container mx-auto px-6 py-20">
          <div className="mb-16">
            <h1 className="text-6xl font-bold text-white mb-4">Mes Projets</h1>
            <p className="text-xl text-gray-300">Découvrez une sélection de mes réalisations</p>
          </div>

          <div 
            ref={galleryRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-start"
          >
            {projectsData.map((project) => (
              <Magentic
                key={project.id}
                href={project.link}
                strength={30}
                className="gallery-item group cursor-pointer"
              >
                <div
                  className="relative overflow-hidden transition-all duration-300"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={1200}
                    height={900}
                    className="project-image w-full h-auto transition-transform duration-600 ease-out"
                    priority={project.id === 1}
                  />
                  
                  <div 
                    className="project-overlay absolute inset-0 bg-black opacity-0 transition-opacity duration-300"
                  />
                  
                  {/* Effet de glow au hover - limité à l'image */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 z-10">
                    <h3 className="project-title text-xl font-semibold text-[#f1f1e7]">
                      {project.title}
                    </h3>
                  </div>
                </div>
              </Magentic>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
