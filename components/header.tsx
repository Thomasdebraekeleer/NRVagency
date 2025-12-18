import React from "react";
import Magentic from "./ui/magentic";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { toggleMenu } from "@/redux/states/menuSlice";
import { cn } from "@/lib/utils";
import "@/app/header.css";

type HeaderProps = {
  color: "Dark" | "Light";
  className?: string;
  mode?: "hamburger" | "cross";
};

export function Header({ color, className, mode = "hamburger" }: HeaderProps) {

  const dispatch = useAppDispatch();
  const { isMenuOpen } = useAppSelector((state) => state.menuReducer);
  return (
    <header className={cn("nav__container anime", className)} style={{ pointerEvents: 'auto', zIndex: 9999 }}>
      <nav className="nav__bar " style={{ pointerEvents: 'auto' }}>
        <div className="absolute top-6 md:top-8 right-6 md:right-8 z-[9999]" style={{ pointerEvents: 'auto' }}>
          <Magentic
            strength={50}
            className={`mask nav__item h-8 w-12 cursor-pointer items-center text-color${color} before:bg-color${color} pointer-events-auto`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('[Header] Menu button clicked, mode:', mode, 'current state:', isMenuOpen);
              if (mode === "cross") {
                console.log('[Header] Closing menu');
                dispatch(toggleMenu({ isMenuOpen: false }));
              } else {
                console.log('[Header] Opening menu with color:', color);
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
