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
  scene.children[0].scale.set(0.05, 0.05, 0.05);
  return (
    <primitive object={scene.children[0]}>
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </primitive>
  );
}

export const Tangible3D = () => {
  return (
    <Suspense fallback={<LoadingBox />}>
      <Teapot />
    </Suspense>
  );
};
