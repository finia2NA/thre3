import React, { useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame } from "react-three-fiber";

import { defaultTexture, checkerboardTexture } from "../Model/Textures";

export const Tangible3D = ({ tangerine }) => {
  const mesh = useRef();

  const texture = useMemo(() => {
    const re = new THREE.CanvasTexture(defaultTexture());
    re.magFilter = THREE.NearestFilter;
    return re;
  }, []);

  return (
    <mesh
      ref={mesh}
      // scale={tangerine.scale}
      // rotation={tangerine.rotation}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};
