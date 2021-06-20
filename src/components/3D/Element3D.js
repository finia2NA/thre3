import React, { useMemo } from "react";

import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { TextureLoader } from "three/src/loaders/TextureLoader";

import {
  defaultTexture,
  rainbowTexture,
  checkerboardTexture,
} from "components/3D/textures";

export const LoadingBox = (props) => {
  return (
    <mesh>
      <boxBufferGeometry translate={props.position} />
    </mesh>
  );
};

// Takes an obj and a displaymode and displays it.
const Element3D = (props) => {
  var texturePath = "defaultTexture.png";
  var generated = defaultTexture(props.obj.patchRes[0], props.obj.patchRes[1]);
  var useGenerated = false;

  switch (props.displaymode) {
    case "rad":
      generated = props.obj.radMap;
      useGenerated = true;
      break;
    case "reflectance":
      texturePath = props.obj.reflectancePath;
      break;
    case "luminance":
      texturePath = props.obj.luminancePath;
      break;
    case "checkerboard":
      generated = checkerboardTexture(
        props.obj.patchRes[0],
        props.obj.patchRes[1]
      );
      useGenerated = true;
      break;
    case "rainbow":
      generated = rainbowTexture(props.obj.patchRes[0], props.obj.patchRes[1]);
      useGenerated = true;
      break;
    default:
      console.error("error while determining displaymode");
  }

  const fileTexture = useLoader(TextureLoader, texturePath);
  const generatedTexture = useMemo(() => {
    if (props.displaymode === "rad") debugger;
    const re = new THREE.CanvasTexture(generated); // TODO: use tx from props instead of just using default
    re.magFilter = THREE.NearestFilter;
    return re;
  }, [props.displaymode, generated]); // TODO: dependency array with generated?

  const texture = useGenerated ? generatedTexture : fileTexture;

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
