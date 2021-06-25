import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";
import { useState } from "react";

// Redux

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

  // functions
  const calcPatches = () => {
    scene.calculatePatches(16, 16);
  };
  const calcFF = () => {
    scene.calculateFormFactors(16, 16);
  };
  const calcRad = async () => {
    await scene.radiate();
    // debugger;
    setRadTextures(scene.objects.map((o) => o.radMap));
    console.log("rad textures updated");
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
