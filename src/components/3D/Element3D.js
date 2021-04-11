import React, { useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame } from "react-three-fiber";

import { defaultTexture, checkerboardTexture } from "../../model/Textures";
import { TeapotAbstract } from "model/ElementAbtract";

export const Tangible3D = ({ tangerine }) => {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  const texture = useMemo(() => {
    const re = new THREE.CanvasTexture(defaultTexture());
    re.magFilter = THREE.NearestFilter;
    return re;
  }, []);

  var object;

  if (tangerine instanceof TeapotAbstract) {
  } else {
  }

  return (
    <mesh
      ref={mesh}
      // scale={tangerine.scale}
      // rotation={tangerine.rotation}
    >
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
      <boxBufferGeometry args={[1, 1, 1]} />
    </mesh>
  );
};
