// components/GlassySphere.tsx
"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/** Sphère "glace/RGB" fixe au centre, qui réagit DOUCEMENT à la souris (tilt/parallax), sans changer de position */
export default function GlassySphere() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { size } = useThree();
  const isMobile = size.width < 480;

  // Segments plus bas sur mobile pour la perf, taille réduite
  const sphereArgs = useMemo<[number, number, number]>(() => {
    return isMobile ? [0.7, 64, 64] : [0.8, 128, 128];
  }, [isMobile]);

  // Mémoire du tilt courant
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Gestion souris avec limites pour éviter que la sphère soit coupée
  useFrame(({ mouse, clock }) => {
    const m = meshRef.current;
    if (!m) return;

    // Mouvement plus prononcé de la sphère selon la souris
    const targetTiltX = THREE.MathUtils.clamp(mouse.y * 0.8, -0.8, 0.8);
    const targetTiltY = THREE.MathUtils.clamp(mouse.x * 1.0, -1.0, 1.0);

    // Lerp vers la cible pour un mouvement fluide
    tilt.x = THREE.MathUtils.lerp(tilt.x, targetTiltX, 0.08);
    tilt.y = THREE.MathUtils.lerp(tilt.y, targetTiltY, 0.08);
    setTilt({ ...tilt });

    // Appliquer rotation + micro oscillation idle pour le "vivant"
    m.rotation.x = tilt.x + Math.sin(clock.elapsedTime * 0.6) * 0.02;
    m.rotation.y = tilt.y + Math.cos(clock.elapsedTime * 0.5) * 0.02;
    
    // Translation très limitée pour créer une zone de sécurité
    // La sphère ne doit JAMAIS sortir de l'écran visible
    const maxOffsetX = 0.6; // Zone de sécurité horizontale
    const maxOffsetY = 0.5; // Zone de sécurité verticale
    
    const targetX = THREE.MathUtils.clamp(mouse.x * maxOffsetX, -maxOffsetX, maxOffsetX);
    const targetY = THREE.MathUtils.clamp(mouse.y * maxOffsetY, -maxOffsetY, maxOffsetY);
    
    m.position.x = THREE.MathUtils.lerp(m.position.x, targetX, 0.05);
    m.position.y = THREE.MathUtils.lerp(m.position.y, targetY, 0.05);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={sphereArgs} />
      {/* Matériau glassmorphism avec transparence maximale */}
      <MeshTransmissionMaterial
        transmission={0.8}
        opacity={0.15}
        ior={1.5}
        thickness={0.6}
        roughness={0.02}
        chromaticAberration={0.25}
        anisotropicBlur={0.3}
        distortion={0.1}
        distortionScale={0.5}
        temporalDistortion={0.15}
        clearcoat={1}
        clearcoatRoughness={0.02}
        envMapIntensity={0.8}
        samples={20}
        resolution={1024}
        attenuationColor="#ffffff"
        attenuationDistance={2.0}
        backside={true}
        backsideThickness={0.4}
      />
    </mesh>
  );
}
