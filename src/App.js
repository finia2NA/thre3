import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";
import { useState } from "react";

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
  const [textureSize, setTextureSize] = useState([16, 16]);
  const [attenuationMethod, setAttenuationMethod] = useState("model3");

  // functions
  const calcPatches = () => {
    scene.calculatePatches(textureSize[0], textureSize[1]);
    const newFlags = [...readyflags];
    newFlags[0] = true;
    setReadyFlags(newFlags);
  };
  const calcFF = () => {
    scene.calculateFormFactors(
      textureSize[0],
      textureSize[1],
      attenuationMethod
    );
    const newFlags = [...readyflags];
    newFlags[0] = true;
    newFlags[1] = true;
    setReadyFlags(newFlags);
  };
  const calcRad = async () => {
    await scene.radiate(textureSize[0], textureSize[1], attenuationMethod);
    setRadTextures(scene.objects.map((o) => o.radMap));
    const newFlags = [...readyflags];
    newFlags[0] = true;
    newFlags[1] = true;
    newFlags[2] = true;
    setReadyFlags(newFlags);
  };

  // scene
  const scene = new SceneRepresentation();
  const cornell = new ObjectRepresentation(
    "robj/package/obj.obj",
    "robj/package/light.png",
    "robj/package/reflectance.png"
  );
  cornell.loadObjText();

  cornell.patchRes = [16, 16];
  scene.addObject(cornell);

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport
          scene={scene}
          displaymode={displaymode}
          radTextures={radTextures}
          setRaycaster={scene.setRC}
          setScene3={scene.setScene3}
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
        />
        <Button
          onClick={() => {
            debugger;
          }}
        >
          ちょっとまって
        </Button>{" "}
        <br />
      </Controldiv>
    </Maindiv>
  );
};

export default App;
