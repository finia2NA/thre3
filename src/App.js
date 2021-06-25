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
  const calcpatches = () => {
    scene.calculatePatches(16, 16);
  };
  const calcff = () => {
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
        <Controlpanel setDisplaymode={setDisplaymode} />
        <Button
          onClick={() => {
            debugger;
          }}
        >
          ちょっとまって
        </Button>{" "}
        <br />
        <Button onClick={() => scene.calculatePatches(16, 16)}>ロ</Button>
        <Button onClick={() => scene.calculateFormFactors(16, 16)}>FF</Button>
        <Button
          onClick={async () => {
            await scene.radiate();
            // debugger;
            setRadTextures(scene.objects.map((o) => o.radMap));
            console.log("rad textures updated");
          }}
        >
          下
        </Button>
        <Button
          onClick={() => {
            setRadTextures(scene.objects.map((o) => o.radMap));
            setDisplaymode("rad");
          }}
        >
          Display
        </Button>
      </Controldiv>
    </Maindiv>
  );
};

export default App;
