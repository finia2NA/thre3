import React, { useMemo, useRef, useState } from "react";

import * as THREE from "three";
import { useFrame } from "react-three-fiber";

import { defaultTexture, checkerboardTexture } from "../Data/Textures";

const Box = (props) => {
  const mesh = useRef();

  const [active, setActive] = useState(false);

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
      {...props}
      ref={mesh}
      scale={active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
      onClick={(e) => setActive(!active)}
    >
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshBasicMaterial attach="material" transparent side={THREE.DoubleSide}>
        <primitive attach="map" object={texture} />
      </meshBasicMaterial>
    </mesh>
  );
};

export default Box;
