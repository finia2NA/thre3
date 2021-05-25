import React, { Suspense, useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { defaultTexture, checkerboardTexture } from "model/Textures";

export const LoadingBox = (props) => {
  return (
    <mesh>
      <boxBufferGeometry translate={props.position} />
    </mesh>
  );
};

// Takes an ObjTXBundle and displays it.
const Element3D = (props) => {
  const texture = useMemo(() => {
    const re = new THREE.CanvasTexture(defaultTexture()); // TODO: use tx from props instead of just using default
    re.magFilter = THREE.NearestFilter;
    return re;
  }, []);

  console.log(props.obj);

  const scene = useLoader(OBJLoader, props.obj.meshPath);
  // scene.children[0].position.set(
  //   obj.translate[0],
  //   obj.translate[1],
  //   obj.translate[2]
  // );

  const re = (
    <primitive object={scene.children[0]}>
      {
        <meshBasicMaterial
          attach="material"
          transparent
          side={THREE.DoubleSide}
        >
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
      }
    </primitive>
  );

  return re;
};

export default Element3D;
