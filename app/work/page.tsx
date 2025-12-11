"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { Cursor } from "@/components/cursor";
import { Header } from "@/components/header";
import "../work.css";

type Project = {
  id: number;
  title: string;
  categories: string[];
  year: number;
  image: string;
  link: string;
};

const projectsData: Project[] = [
  {
    id: 1,
    title: "Sector One",
    categories: ["Web design", "Branding"],
    year: 2025,
    image: "/img/Project/Project  2 Sector One.webp",
    link: "/work/sector-one",
  },
  {
    id: 2,
    title: "Pardesssus 19",
    categories: ["Motion", "Création de contenu"],
    year: 2025,
    image: "/img/Project/Project 1 Pardesssus 19.webp",
    link: "#",
  },
  {
    id: 3,
    title: "Samsung",
    categories: ["Direction artistique", "Brand strategy"],
    year: 2025,
    image: "/img/Project/Project  3 Samsung.webp",
    link: "#",
  },
  {
    id: 4,
    title: "Enthusiast Music",
    categories: ["Web design", "Community management"],
    year: 2025,
    image: "/img/Project/Project 4 Enthusiast Music.webp",
    link: "#",
  },
  {
    id: 5,
    title: "Sinclair Pilates",
    categories: ["Vidéo", "Branding"],
    year: 2025,
    image: "/img/Project/Project 6 Sinclair Pilates.webp",
    link: "#",
  },
];

export default function WorkPage() {
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const highlightsRef = useRef<(HTMLDivElement | null)[]>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const primaryText = useMemo(() => "#ffffff", []);
  const secondaryText = useMemo(() => "#ffffff", []);
  const darkText = useMemo(() => "#0a0a0a", []);

  useEffect(() => {
    if (!rowsRef.current.length) return;

    // S'assurer que tous les éléments commencent avec opacity: 1 en CSS
    rowsRef.current.forEach((el) => {
      if (el) {
        gsap.set(el, { opacity: 1 });
      }
    });

    gsap.fromTo(
      rowsRef.current,
      {
        opacity: 0,
        y: 32,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, []);

  const showHighlight = (index: number) => {
    const highlight = highlightsRef.current[index];
    const row = rowsRef.current[index];
    if (!highlight || !row) return;

    const texts = row.querySelectorAll(".project-title, .project-tag, .project-year");

    gsap.to(highlight, {
      scaleY: 1,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(texts, {
      color: darkText,
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.02,
    });
  };

  const hideHighlight = (index: number) => {
    const highlight = highlightsRef.current[index];
    const row = rowsRef.current[index];
    if (!highlight || !row) return;

    const texts = row.querySelectorAll(".project-title, .project-tag, .project-year");

    gsap.to(highlight, {
      scaleY: 0,
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(texts, {
      color: (target) =>
        target instanceof HTMLElement && target.classList.contains("project-title")
          ? primaryText
          : secondaryText,
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.02,
    });
  };

  const showPreview = (project: Project, event: React.MouseEvent) => {
    const preview = previewRef.current;
    if (!preview) return;

    gsap.set(preview, {
      x: event.clientX + 24,
      y: event.clientY - 24,
      scale: 0.8,
      rotate: -2,
    });

    gsap.to(preview, {
      opacity: 1,
      scale: 1,
      rotate: 0,
      duration: 0.35,
      ease: "power3.out",
    });

    setActiveProject(project);
  };

  const movePreview = (event: React.MouseEvent) => {
    if (!previewRef.current || !activeProject) return;
    gsap.to(previewRef.current, {
      x: event.clientX + 24,
      y: event.clientY - 24,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const hidePreview = () => {
    if (!previewRef.current) return;
    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.85,
      rotate: 3,
      duration: 0.25,
      ease: "power2.out",
    });
    setActiveProject(null);
  };

  return (
    <>
      <Cursor />
      <Header color="Light" />

      <main className="work-page">
        <div className="work-wrapper">
          <div className="work-header">
            <p className="eyebrow">Sélection 2025</p>
            <h1>Projects</h1>
          </div>

          <div className="project-list">
            {projectsData.map((project, index) => (
              <Link
                key={project.id}
                href={project.link}
                className="project-row"
                onMouseEnter={(event) => {
                  showHighlight(index);
                  showPreview(project, event);
                }}
                onMouseMove={movePreview}
                onMouseLeave={() => {
                  hideHighlight(index);
                  hidePreview();
                }}
                ref={(el) => {
                  rowsRef.current[index] = el;
                }}
              >
                <div
                  className="project-highlight"
                  ref={(el) => {
                    highlightsRef.current[index] = el;
                  }}
                />

                <div className="project-content">
                  <p className="project-title">{project.title}</p>
                  <div className="project-tags">
                    {project.categories.map((cat) => (
                      <span key={cat} className="project-tag">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <span className="project-year">{project.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="floating-preview" ref={previewRef}>
          {activeProject && (
            <Image
              key={activeProject.id}
              src={activeProject.image}
              alt={activeProject.title}
              fill
              sizes="260px"
              className="floating-preview__img"
              priority
            />
          )}
        </div>
      </main>
    </>
  );
}
