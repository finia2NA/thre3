import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "react-three-fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import Box from "components/Box";
import Controlpanel from "components/ControlPanel";

extend({ OrbitControls });

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexBasis: "row",
        padding: "10px",
      }}
    >
      <div style={{ display: "flex", flex: 4 }}>
        <Canvas
          camera={{ fov: 75, position: [1, 0, 0] }}
          onCreated={({ gl }) => {
            gl.setClearColor("darkgrey");
          }}
        >
          <ambientLight intensity={0.5} />
          <Box position={[-1.2, 0, 0]} />
        </Canvas>
      </div>
      <div style={{ display: "flex", flex: 3 }}></div>
      <Controlpanel />
    </div>
  );
};

export default App;
