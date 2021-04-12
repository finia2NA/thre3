import React, { Suspense, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame, useGraph, useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { defaultTexture, checkerboardTexture } from "../../model/Textures";
import { TeapotAbstract } from "model/ElementAbtract";

export const Tangible3D = () => {
  const mesh = useRef();

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

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
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
      <boxBufferGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

function Asset() {
  const scene = useLoader(OBJLoader, "teapot.obj");
  return <primitive object={scene.children[0]} />;
}

export const Teapot3D = () => {
  return (
    <Suspense fallback={<Tangible3D />}>
      <Asset />
    </Suspense>
  );
};
