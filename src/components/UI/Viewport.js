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
  useFrame((state) => controls.current.update()); // TODO: this does something every frame, maybe it could be improved by updating only when the mouse is clicked or st.
  return <orbitControls ref={controls} args={[camera, domElement]} />;
};

/**
 * The 3D Viewport that displays the scene
 * @param {*} props
 * @returns
 */
const Viewport = (props) => {
  return (
    // Settings...
    <Canvas
      gl={{ antialias: true }}
      onCreated={({ gl, raycaster, scene }) => {
        gl.setClearColor("#222222");
        // The raycaster and 3D scene are used in the raycasting function in the form factor calculation.
        // Thus, they need to get passed out of here.
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
        // Every object in the scene is displayed as an element3D, and has a uniuqe name used to identify it in the form factor calculation.
        // It is suspended in a simple loading box, which is displayed while the object is loading.
        <Suspense fallback={<LoadingBox />} key={i}>
          <Element3D
            obj={o}
            displaymode={props.displaymode}
            radTexture={props.radTextures[i]}
            key={i}
            name={"" + i}
            useFilter={props.useFilter}
            textureSize={props.textureSize}
          />
        </Suspense>
      ))}
    </Canvas>
  );
};

export default Viewport;
