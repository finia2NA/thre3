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

/**
 * A small box that can be displyed as a stand-in for a 3D object that is being loaded.
 * @param {*} props
 * @returns
 */
export const LoadingBox = (props) => {
  return (
    <mesh>
      <boxBufferGeometry translate={props.position} />
    </mesh>
  );
};

/** 
 * The 3-dimensional representation of a graphics object.
 * 
 * @param {*} props.displaymode the texture that should be displayed on the surface of the object
 * @param {*} props.texturesize the size of generated textures to be displayed
 * @param {*} props.obj the object to be displayed
 * @param {*} props.useFilter wether a smoothing filter should be applied to the textures
 * @param {*} props.radTexture the radiosity texture of the object
 * @param {*} props.name the identifier of the object
 * @param {*} props.reflectancePath the path of the reflectance texture of the object
 * @param {*} props.luminancePath the path of the luminance texture of the object

 */
const Element3D = (props) => {
  console.log("Element3D rendering...");

  // set texture
  var texturePath = "defaultTexture.png";
  var generated = defaultTexture(props.textureSize[0], props.textureSize[1]);
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
        props.textureSize[0],
        props.textureSize[1]
      );
      useGenerated = true;
      break;
    case "rainbow":
      generated = rainbowTexture(props.textureSize[0], props.textureSize[1]);
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
  }, [generated, props.useFilter]);

  const texture = useGenerated ? generatedTexture : fileTexture;

  texture.flipY = props.obj.flipY;

  // load object
  const scene = useLoader(OBJLoader, props.obj.meshPath);
  // scene.children[0].position.set(
  //   obj.translate[0],
  //   obj.translate[1],
  //   obj.translate[2]
  // );

  // set name, which will be used in raytracing to see which object has been hit.
  if (scene.children[0]) scene.children[0].name = props.name;

  // finally, build the object and return it
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
