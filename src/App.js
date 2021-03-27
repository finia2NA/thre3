import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import * as THREE from "three";
import { BoxBufferGeometry } from "three";
import five from "./assets/five.png";

const Box = (props) => {
  const mesh = useRef();

  const [active, setActive] = useState(false);

  useFrame(() => {
    mesh.current.rotation.x = mesh.current.rotation.y += 0.01;
  });

  const texture = useMemo(() => new THREE.TextureLoader().load(five), []);
  
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
}

const App = () => {
  const [pos, setpos] = useState(1);

  // TODO: make this work
  // useEffect(()=> setInterval(
  //   () => setpos(pos+10), 1000
  // )

  const [twoofThem, enable2] = useState(false);
  

  return (
    <div>
      <button onClick={() => {
        enable2(!twoofThem);
      }}>
        do something!
      </button>
      <Canvas
        camera={{fov: 75, position: [pos,0,0]}}
        onCreated={({ gl }) => gl.setClearColor('darkgrey')}
        >
        <ambientLight intensity={0.5} />
        {twoofThem&&
        <Box position={[-1.2, 0, 0]} />}
      </Canvas>
    </div>
  );
}

export default App;