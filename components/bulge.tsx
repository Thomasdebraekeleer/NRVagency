import React from "react";

type bulgeProps = {
  type: "Dark" | "Light";
};

// Bulge is responsible for giving paralax effect when slide up and down

export function Bulge({ type }: bulgeProps) {
  return (
    <>
      {type == "Dark" ? (
        <>
          <div className="rounded__div__down darkGradient pointer-events-none">
            <div className="round__bg__down lightGradient"></div>
          </div>
          <div className="rounded__div__up darkGradient pointer-events-none">
            <div className="round__bg__up lightGradient"></div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded__div__down lightGradient pointer-events-none">
            <div className="round__bg__down darkGradient"></div>
          </div>
          <div className="rounded__div__up lightGradient pointer-events-none">
            <div className="round__bg__up darkGradient"></div>
          </div>
        </>
      )}
    </>
  );
}
