import React, { Suspense, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame, useGraph, useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { defaultTexture, checkerboardTexture } from "model/Textures";

export const LoadingBox = (props) => {
  return (
    <mesh>
      <boxBufferGeometry translate={props.position} />
    </mesh>
  );
};

export const Cube = (props) => {
  const scene = useLoader(OBJLoader, "testcube.obj");
  scene.children[0].position.set(
    props.position[0],
    props.position[1],
    props.position[2]
  );
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
  scene.children[0].position.set(
    props.position[0],
    props.position[1],
    props.position[2]
  );
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
      re = <Teapot {...props.abstract} texture={texture} />;
      break;

    case "CubeAbstract":
      console.log("loading a cube!");
      re = <Cube {...props.abstract} texture={texture} />;
      break;

    default:
      break;
  }

  return <Suspense fallback={<LoadingBox />}>{re}</Suspense>;
};
