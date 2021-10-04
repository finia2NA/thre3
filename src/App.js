import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import {
  gridTexture,
  reflectanceTexture,
  unshotDensityTexture,
} from "components/3D/textures";

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
  // parameters
  const [textureSize, setTextureSize] = useState([128, 128]);
  const [numSamples, setNumSamples] = useState(3000);
  const threshP = 0.01;

  // state
  const [displaymode, setDisplaymode] = useState("reflectance");
  const [radTextures, setRadTextures] = useState([]);
  const [progresses, setAllProgresses] = useState([
    "notready",
    "notready",
    "notready",
  ]);

  const [useFilter, setUseFilter] = useState(false);
  const [sceneInitialized, setSceneInitialized] = useState(false);

  console.log("app reset");

  const getPerformance = () => {
    ["patches", "ffs", "radiosity", "tx"].map((name) => {
      performance
        .getEntriesByName(name)
        .map((entry) =>
          console.log(name, (entry.duration / 1000).toFixed(2) + "s")
        );
    });
  };

  const setProgress = (index, value) => {
    const newProgresses = [...progresses];
    newProgresses[index] = value;
    setAllProgresses(newProgresses);
  };

  // functions
  const calcPatches = () => {
    scene.current.computePatches();

    scene.current.objects[0].radMap = reflectanceTexture(
      // scene.current.objects[0].radMap = unshotDensityTexture(
      scene.current.objects[0].patches,
      scene.current.objects[0].patchRes[0],
      scene.current.objects[0].patchRes[1],
      scene.current.objects[0].flipY
    );
    setRadTextures([scene.current.objects[0].radMap]);

    setProgress(0, "ready");
  };

  const calcFF = () => {
    scene.current.computeFormFactors2(textureSize[0], textureSize[1], 1000);

    setAllProgresses(["ready", "ready", "notready"]);
  };

  const calcRad = async () => {
    await scene.current.computeRadiosity(
      textureSize[0],
      textureSize[1],
      numSamples,
      threshP
    );
    setRadTextures(
      scene.current.objects.map((o) => o.radMap),
      (value) => setProgress(2, value)
    );

    setAllProgresses(["ready", "ready", "ready"]);
  };

  // scene
  const scene = useRef(null);

  useEffect(() => {
    scene.current = new SceneRepresentation();

    const cornell = new ObjectRepresentation(
      "r4/r4.obj",
      "robj3/light.png",
      "r4/reflectance.png",
      "r4/meta.json"
    );

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
            progresses={progresses}
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
          <Button onClick={() => getPerformance()}>Log Performance</Button>
          <br />
        </Controldiv>
      </Maindiv>
    )
  );
};

export default App;
