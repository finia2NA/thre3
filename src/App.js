import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gridTexture, reflectanceTexture } from "components/3D/textures";

// Components
const Maindiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const Viewdiv = styled.div`
  flex: 2;
`;

const Controldiv = styled.div`
  flex: 1;
`;

// App
const App = () => {
  // state
  const [displaymode, setDisplaymode] = useState("reflectance");
  const [radTextures, setRadTextures] = useState([]);
  const [readyflags, setReadyFlags] = useState([false, false, false]);
  const [textureSize, setTextureSize] = useState([32, 32]);
  const [useFilter, setUseFilter] = useState(true);
  const [numSamples, setNumSamples] = useState(2000);

  const [sceneInitialized, setSceneInitialized] = useState(false);

  console.log("app reset");

  // functions
  const calcPatches = () => {
    scene.current.computePatches(textureSize[0], textureSize[1]);

    scene.current.objects[0].radMap = reflectanceTexture(
      scene.current.objects[0].patches,
      scene.current.objects[0].patchRes[0],
      scene.current.objects[0].patchRes[1],
      scene.current.objects[0].flipY
    );
    setRadTextures([scene.current.objects[0].radMap]);

    const newFlags = [...readyflags];
    newFlags[0] = true;
    setReadyFlags(newFlags);
  };
  const calcFF = () => {
    scene.current.computeFormFactors2(textureSize[0], textureSize[1], 1000);
    const newFlags = [...readyflags];
    newFlags[0] = true;
    newFlags[1] = true;
    setReadyFlags(newFlags);
  };
  const calcRad = async () => {
    await scene.current.computeRadiosity(
      textureSize[0],
      textureSize[1],
      numSamples
    );
    setRadTextures(scene.current.objects.map((o) => o.radMap));
    const newFlags = [...readyflags];
    newFlags[0] = true;
    newFlags[1] = true;
    newFlags[2] = true;
    setReadyFlags(newFlags);
  };

  // scene
  const scene = useRef(null);

  useEffect(() => {
    scene.current = new SceneRepresentation();

    const cornell = new ObjectRepresentation(
      "robj/package/obj.obj",
      "robj/package/light.png",
      "robj/package/reflectance.png",
      "robj/package/meta.json"
    );

    // const  cornell = new ObjectRepresentation(
    //     "testobj/package/obj.obj",
    //     "testobj/package/light.png",
    //     "testobj/package/reflectance.png"
    //     "testobj/package/meta.json",
    //      16,
    //      16
    //   );

    cornell.loadObjText();

    cornell.patchRes = textureSize;
    scene.current.addObject(cornell);

    setSceneInitialized(true);
  }, []);

  return (
    sceneInitialized && (
      <Maindiv>
        <Viewdiv>
          <Viewport
            scene={scene.current}
            displaymode={displaymode}
            radTextures={radTextures}
            setRaycaster={scene.current.setRC}
            setScene3={scene.current.setScene3}
            useFilter={useFilter}
          />
        </Viewdiv>

        <Controldiv>
          <Controlpanel
            setDisplaymode={setDisplaymode}
            calcPatches={calcPatches}
            calcFF={calcFF}
            calcRad={calcRad}
            setTextureSize={setTextureSize}
            readyflags={readyflags}
            setUseFilter={setUseFilter}
            setNumSamples={setNumSamples}
          />
          <Button
            onClick={() => {
              debugger;
            }}
          >
            ちょっとまって
          </Button>{" "}
          <Button onClick={scene.current.test}>test</Button>
          <br />
        </Controldiv>
      </Maindiv>
    )
  );
};

export default App;
