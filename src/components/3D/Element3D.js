import React, { useMemo } from "react";

import * as THREE from "three";
import { useLoader } from "react-three-fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { TextureLoader } from "three/src/loaders/TextureLoader";

import {
  defaultTexture,
  rainbowTexture,
  checkerboardTexture,
  reflectanceTexture,
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
  console.log("Element3D did something!");
  var texturePath = "defaultTexture.png";
  var generated = defaultTexture(props.obj.patchRes[0], props.obj.patchRes[1]);
  var useGenerated = false;

  switch (props.displaymode) {
    case "rad":
      generated = props.radTexture;
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
    const re = new THREE.CanvasTexture(generated);
    re.magFilter = props.useFilter ? THREE.LinearFilter : THREE.NearestFilter;
    return re;
  }, [props.displaymode, generated, props.useFilter]);

  const texture = useGenerated ? generatedTexture : fileTexture;

  texture.flipY = props.obj.flipY;

  const scene = useLoader(OBJLoader, props.obj.meshPath);
  // scene.children[0].position.set(
  //   obj.translate[0],
  //   obj.translate[1],
  //   obj.translate[2]
  // );

  // this name will be used in raytracing to see which object has been hit.
  if (scene.children[0]) scene.children[0].name = props.name;

  const re = (
    <primitive object={scene.children[0]}>
      {
        <meshBasicMaterial attach="material" transparent side={THREE.FrontSide}>
          <primitive attach="map" object={texture} />
        </meshBasicMaterial>
      }
    </primitive>
  );

  return re;
};

export default Element3D;
