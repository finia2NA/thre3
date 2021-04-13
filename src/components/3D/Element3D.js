import React, { Suspense, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame, useGraph, useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { defaultTexture, checkerboardTexture } from "model/Textures";

export const LoadingBox = (props) => {
  return (
    <mesh>
      <boxBufferGeometry />
    </mesh>
  );
};

export const Cube = (props) => {
  const scene = useLoader(OBJLoader, "testcube.obj");
  return (
    <primitive object={scene.children[0]}>
      {props.texture && (
        <meshBasicMaterial
          attach="material"
          transparent
          side={THREE.DoubleSide}
        >
          <primitive attach="map" object={props.texture} />
        </meshBasicMaterial>
      )}
    </primitive>
  );
};

export const Teapot = (props) => {
  const scene = useLoader(OBJLoader, "teapot.obj");
  scene.children[0].scale.set(0.05, 0.05, 0.05);
  return (
    <primitive object={scene.children[0]}>
      {props.texture && (
        <meshBasicMaterial
          attach="material"
          transparent
          side={THREE.DoubleSide}
        >
          <primitive attach="map" object={props.texture} />
        </meshBasicMaterial>
      )}
    </primitive>
  );
};

export const Tangible3D = (props) => {
  // load texture
  const texture = useMemo(() => {
    const re = new THREE.CanvasTexture(defaultTexture()); // TODO: use tx from props instead of just using default
    re.magFilter = THREE.NearestFilter;
    return re;
  }, []);
  // TODO: maybe move the creation of the material here too

  var re = <LoadingBox />;

  switch (props.abstract.name) {
    case "TeapotAbstract":
      console.log("loading a teapot!");
      re = <Teapot texture={texture} />;
      break;

    case "CubeAbstract":
      console.log("loading a cube!");
      re = <Cube texture={texture} />;
      break;

    default:
      break;
  }

  return <Suspense fallback={<LoadingBox />}>{re}</Suspense>;
};
