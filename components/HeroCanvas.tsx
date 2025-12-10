// components/HeroCanvas.tsx
"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import GlassySphere from "./GlassySphere";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";

function ToneAndClear() {
  const { gl } = useThree();
  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.setClearColor(0x000000, 0); // alpha: transparent → on voit le fond du site
  }, [gl]);
  return null;
}

function CustomEnvironment() {
  const texture = useTexture("/img/Background hero.webp");
  
  useEffect(() => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      // Ajustements pour réduire le voile blanc
      texture.flipY = false;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }, [texture]);

  return (
    <Environment map={texture} background={false} />
  );
}

function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const { mouse } = useThree();

  useFrame(() => {
    if (lightRef.current) {
      // La lumière suit la souris avec des limites pour éviter qu'elle sorte du champ
      const maxLightDistance = 4; // Limite la distance de la lumière pour rester dans la zone de sécurité
      lightRef.current.position.x = THREE.MathUtils.clamp(mouse.x * maxLightDistance, -maxLightDistance, maxLightDistance);
      lightRef.current.position.y = THREE.MathUtils.clamp(mouse.y * maxLightDistance, -maxLightDistance, maxLightDistance);
      lightRef.current.position.z = 5;
      
      // Changement de couleur selon la position de la souris
      const hue = (mouse.x + mouse.y + 2) * 0.5;
      lightRef.current.color.setHSL(hue, 0.8, 0.8);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={2}
      distance={20}
      decay={2}
      castShadow={false}
    />
  );
}

export default function HeroCanvas() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 480;
  const bloom = useMemo(
    () => ({
      intensity: isMobile ? 0.25 : 0.4,
      luminanceThreshold: 0.7,
      luminanceSmoothing: 0.3,
      radius: isMobile ? 0.6 : 0.8,
    }),
    [isMobile]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
      style={{ 
        width: '1800px', 
        height: '1800px',
        transform: 'scale(0.65)',
        transformOrigin: 'center'
      }}
      className="md:scale-[0.8] lg:scale-[1]"
      // eventSource pour de bons events sur App Router
      eventSource={typeof window !== "undefined" ? (document.getElementById("__next") as HTMLElement) : undefined}
    >
      <ToneAndClear />
      <Suspense fallback={null}>
        {/* Éclairage pour la transparence */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.0} />
        <pointLight position={[-5, -5, 5]} intensity={0.6} color="#ffffff" />
        
        {/* Lumière qui suit la souris */}
        <MouseLight />
        
        {/* La sphère reste au CENTRE ; le "mouse-follow" est un tilt/rotation subtil */}
        <GlassySphere />

        {/* Environnement avec l'image Background hero */}
        <CustomEnvironment />

        {/* PostFX très légers pour un rendu premium (optionnels) */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={bloom.intensity}
            luminanceThreshold={bloom.luminanceThreshold}
            luminanceSmoothing={bloom.luminanceSmoothing}
            radius={bloom.radius}
          />
          <ChromaticAberration offset={isMobile ? [0, 0] : [0.0012, 0]} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
