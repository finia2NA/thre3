import React from "react";

import { Canvas } from "react-three-fiber";

import Box from "components/3D/Box";

// extend({ OrbitControls });

const Viewport = () => {
  return (
    <Canvas
      camera={{ fov: 75, position: [1, 0, 0] }}
      onCreated={({ gl }) => {
        gl.setClearColor("darkgrey");
      }}
    >
      <ambientLight intensity={0.5} />
      <Box position={[-1.2, 0, 0]} />
    </Canvas>
  );
};

export default Viewport;
