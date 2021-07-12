import Element3D, { LoadingBox } from "components/3D/Element3D";
import React, { useRef } from "react";
import { Suspense } from "react";
import { Canvas, extend, useFrame, useThree } from "react-three-fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  useFrame((state) => controls.current.update()); // TODO: this does something every frame, should probably be changed to only update when mouse moves or something
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

const Viewport = (props) => {
  return (
    <Canvas
      gl={{ antialias: true }}
      onCreated={({ gl, raycaster, scene }) => {
        gl.setClearColor("#222222");
        props.setRaycaster(raycaster);
        props.setScene3(scene);
      }}
      onChange={({ raycaster, scene }) => {
        props.setRaycaster(raycaster);
        props.setScene3(scene);
      }}
    >
      {/* Canvas Config */}
      <CameraControls />

      {/* Objects */}
      {props.scene.objects.map((o, i) => (
        <Suspense fallback={<LoadingBox />} key={i}>
          <Element3D
            obj={o}
            displaymode={props.displaymode}
            radTexture={props.radTextures[i]}
            key={i}
            name={"" + i}
          />
        </Suspense>
      ))}
    </Canvas>
  );
};

export default Viewport;
