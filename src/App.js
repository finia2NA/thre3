import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";
import { useState, useRef, useEffect } from "react";

// Default Parameters
const defaultTXSize = [64, 64];
const defaultSamples = 3000;
const defaultThreshP = 0.01;
const defaultDownloadTexture = false;

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
  console.log("starting app render...");

  // RAD parameter states which can be modified in the panel
  const [textureSize, setTextureSize] = useState(defaultTXSize);
  const [numSamples, setNumSamples] = useState(defaultSamples);
  const [threshP, setThreshP] = useState(defaultThreshP);
  const [downloadTexture, setDownloadTexture] = useState(
    defaultDownloadTexture
  );

  // other internal state
  const [displaymode, setDisplaymode] = useState("reflectance");
  const [radTextures, setRadTextures] = useState([]);
  const [progresses, setAllProgresses] = useState([
    "notready",
    "notready",
    "notready",
  ]);
  const [useFilter, setUseFilter] = useState(false);
  const [sceneInitialized, setSceneInitialized] = useState(false);
  const [oneshot, setoneshot] = useState(true);

  // functions used internally and passed down to panels and methods...
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

  /**
   * calculate patches
   */
  const calcPatches = () => {
    setoneshot(false);

    scene.current.computePatches(textureSize);

    // this code makes it so the *reflectivity* of the patches is displayed
    // in place of the radiosity after executing this first step.
    // can be usefull in testing, but should not be in production, thus commented out

    // scene.current.objects[0].radMap = reflectanceTexture(
    //   // scene.current.objects[0].radMap = unshotDensityTexture(
    //   scene.current.objects[0].patches,
    //   scene.current.objects[0].patchRes[0],
    //   scene.current.objects[0].patchRes[1],
    //   scene.current.objects[0].flipY
    // );
    // setRadTextures([scene.current.objects[0].radMap]);

    setProgress(0, "ready");
  };

  /**
   * calculate patches + form factors
   */
  const calcFF = () => {
    setoneshot(false);
    scene.current.computeFormFactors2(
      textureSize[0],
      textureSize[1],
      numSamples
    );

    setAllProgresses(["ready", "ready", "notready"]);
  };

  /**
   * calculate radiosity and prerequisites
   */
  const calcRad = async () => {
    setoneshot(false);

    await scene.current.computeRadiosity(
      textureSize[0],
      textureSize[1],
      numSamples,
      threshP,
      downloadTexture
    );
    setRadTextures(
      scene.current.objects.map((o) => o.radMap),
      (value) => setProgress(2, value)
    );

    setAllProgresses(["ready", "ready", "ready"]);
  };

  // initialize scene
  const scene = useRef(null);

  useEffect(() => {
    scene.current = new SceneRepresentation();

    const cornell = new ObjectRepresentation(
      "r4/r4.obj",
      "r4/light.png",
      "r4/reflectance.png",
      "r4/meta.json"
    );

    cornell.loadObjText();

    cornell.patchRes = textureSize;
    scene.current.addObject(cornell);

    setSceneInitialized(true);
  }, []);

  // The app. it consists of the viewport and the control panel, along with some testing buttons below
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
            textureSize={textureSize}
          />
        </Viewdiv>

        <Controldiv>
          <Controlpanel
            calcPatches={calcPatches}
            calcFF={calcFF}
            calcRad={calcRad}
            progresses={progresses}
            defaultTextureSize={defaultTXSize}
            defaultThreshP={defaultThreshP}
            defaultSamples={defaultSamples}
            defaultDownloadTexture={defaultDownloadTexture}
            setDownloadTexture={setDownloadTexture}
            setDisplaymode={setDisplaymode}
            setTextureSize={setTextureSize}
            setUseFilter={setUseFilter}
            setNumSamples={setNumSamples}
            setThreshP={setThreshP}
            radPressable={oneshot}
          />
          <Button
            onClick={() => {
              debugger;
            }}
          >
            Debugger
          </Button>{" "}
          <Button onClick={() => getPerformance()}>Log Performance</Button>
          <br />
        </Controldiv>
      </Maindiv>
    )
  );
};

export default App;
