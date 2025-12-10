"use client";
import { Main } from "@/components/main";
import { Cursor } from "@/components/cursor";
import FullpageProvider from "@/components/fullpageProvider";
import { HeaderNavigation } from "@/components/headerNavigation";
import IntroReveal from "@/components/IntroReveal";

import "./index.css";

export default function HomePage({}) {
  const introImages = [
    "/img/Diapo/DIAPO 1.webp",
    "/img/Diapo/DIAPO 2.webp",
    "/img/Diapo/DIAPO 3.webp",
    "/img/Diapo/DIAPO 4.webp",
    "/img/Diapo/DIAPO 5.webp",
  ];

  return (
    <>
      <IntroReveal images={introImages} />
      <Cursor />
      <HeaderNavigation />
      <FullpageProvider>
        <Main />
      </FullpageProvider>
    </>
  );
}
