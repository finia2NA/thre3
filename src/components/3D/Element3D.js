import React, { Suspense, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame, useGraph, useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { defaultTexture, checkerboardTexture } from "../../model/Textures";
import { TeapotAbstract } from "model/ElementAbtract";
import { Vector3 } from "three";

export const LoadingBox = () => {
  return (
    <mesh>
      <boxBufferGeometry />
    </mesh>
  );
};

function Teapot() {
  const texture = useMemo(() => {
    const re = new THREE.CanvasTexture(defaultTexture());
    re.magFilter = THREE.NearestFilter;
    return re;
  }, []);

  const scene = useLoader(OBJLoader, "teapot.obj");
  scene.children[0].scale.set(0.2, 0.2, 0.2);
  return <primitive object={scene.children[0]} />;
}

export const Tangible3D = () => {
  return (
    <Suspense fallback={<LoadingBox />}>
      <Teapot />
    </Suspense>
  );
};
