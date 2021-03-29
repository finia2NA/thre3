import React, { useRef } from "react";

import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Box from "components/3D/Box";

extend({ OrbitControls });

const CameraControls = () => {
  // source: https://codeworkshop.dev/blog/2020-04-03-adding-orbit-controls-to-react-three-fiber/

  // Get a reference to the Three.js Camera, and the canvas html element.
  // We need these to setup the OrbitControls class.
  // https://threejs.org/docs/#examples/en/controls/OrbitControls

  const {
    camera,
    gl: { domElement },
  } = useThree();

  // Ref to the controls, so that we can update them on every frame using useFrame
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

const Viewport = () => {
  return (
    <Canvas
      onCreated={({ gl }) => {
        gl.setClearColor("darkgrey");
      }}
    >
      {/* Canvas Config */}
      <CameraControls />
      <ambientLight intensity={0.5} />

      {/* Objects */}
      <Box position={[0, 0, 0]} />
    </Canvas>
  );
};

export default Viewport;
