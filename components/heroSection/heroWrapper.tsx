import React from "react";
import { HeroMinimalist } from "./heroMinimalist";

export function HeroWrapper({}) {
  return (
    <main className="section1__wrapper relative max-w-maxWidth grow flex items-center justify-center">
      <div className="myImage"></div>
      <HeroMinimalist />
    </main>
  );
}
