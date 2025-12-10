import React, { use, useEffect, useRef, useState } from "react";
import Magentic from "./ui/magentic";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import Logo from "@/public/svg/Logo.svg";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { toggleMenu } from "@/redux/states/menuSlice";
import { cn } from "@/lib/utils";
import { links } from "@/data/data";
import "@/app/header.css";

const ease = CustomEase.create("custom", "M0,0 C0.52,0.01 0.16,1 1,1 ");

type HeaderProps = {
  color: "Dark" | "Light";
  className?: string;
  mode?: "hamburger" | "cross";
};

export function Header({ color, className, mode = "hamburger" }: HeaderProps) {
  const possibleTailwindClasses = [
    "bg-colorDark",
    "bg-colorLight",
    "text-colorDark",
    "text-colorLight",
    "before:bg-colorDark",
    "before:bg-colorLight",
  ];

  const logoAnimationTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    logoAnimationTl.current = gsap.timeline({ paused: true }).fromTo(
      `.logo__rotate`,
      {
        rotate: 0,
        transformOrigin: "center",
      },
      {
        rotate: -360,
        transformOrigin: "center",
        duration: 0.6,
        ease: ease,
      },
    );

    return () => {
      logoAnimationTl.current?.kill();
    };
  }, []);

  const dispatch = useAppDispatch();
  return (
    <header className={cn("nav__container anime px-paddingX", className)}>
      <nav className="nav__bar ">
        <div className="max-w-maxWidth">
          <Magentic
            href={links.home}
            strength={50}
            className={`nav__item text-xl font-bold text-color${color} before:bg-color${color}`}
            onMouseEnter={() => {
              console.log("hello");
              logoAnimationTl.current?.play();
            }}
            onMouseLeave={() => {
              logoAnimationTl.current?.reverse();
            }}
          >
            <div className="mask logo__anim flex items-center justify-center font-semibold gap-3">
              <div className="logo__rotate">
                <svg
                  className="w-[40px] h-[40px]"
                  viewBox="0 0 471.56 516.8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.08,105.74v64.19l100.94,54.62c25.26,13.67,55.66,15.4,81.7,3.28,13.65-6.35,27.24-16.84,38.02-33.88,10.68-16.88,15.78-36.69,15.6-56.66l-1.26-137.29h-52.78l-.33,139.01c-.03,11.55-4,22.89-11.79,31.41-7.03,7.69-17.62,13.99-32.78,11.23-4.99-.91-9.74-2.85-14.15-5.37L25.08,105.74Z"
                    fill="currentColor"
                  />
                  <path
                    d="M471.56,154.5l-55.24-32.7-98.42,59.03c-24.63,14.77-41.6,40.06-44.44,68.64-1.49,14.98.61,32.02,9.79,49.98,9.09,17.79,23.53,32.27,40.81,42.29l118.79,68.85,26.88-45.42-119.46-71.1c-9.92-5.91-17.66-15.1-21.02-26.15-3.03-9.97-3.06-22.28,7.04-33.93,3.33-3.83,7.42-6.93,11.83-9.44l123.44-70.07Z"
                    fill="currentColor"
                  />
                  <path
                    d="M207.26,516.8l55.97-31.43-1.79-114.75c-.45-28.72-13.83-56.07-37.14-72.84-12.22-8.79-28.02-15.51-48.16-16.57-19.94-1.05-39.72,4.2-57.04,14.14L0,363.66l25.84,46.02,121.37-67.77c10.08-5.63,21.92-7.72,33.16-5.09,10.15,2.37,20.82,8.51,25.84,23.09,1.65,4.8,2.28,9.89,2.24,14.97l-1.2,141.94Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className={`text-3xl font-bold ${mode === "cross" ? "text-colorDark" : "text-white"}`}>NRV</span>
            </div>
          </Magentic>
          <Magentic
            strength={50}
            className={`mask nav__item h-8 w-8 cursor-pointer items-center text-color${color} before:bg-color${color}`}
            onClick={() => {
              if (mode === "cross") {
                dispatch(toggleMenu({ isMenuOpen: false }));
              } else {
                dispatch(toggleMenu({ isMenuOpen: true, color: color }));
              }
            }}
          >
            <div
              className={cn(
                "flex h-[0.9rem] w-full flex-col justify-between ",
                {
                  "scale-[.90] justify-center": mode === "cross",
                },
              )}
            >
              <div
                className={cn(`h-[0.15rem] w-full bg-color${color}`, {
                  "absolute rotate-45": mode === "cross",
                })}
              ></div>
              <div
                className={cn(`h-[0.15rem] w-full bg-color${color}`, {
                  "absolute -rotate-45": mode === "cross",
                })}
              ></div>
            </div>
          </Magentic>
        </div>
      </nav>
    </header>
  );
}
