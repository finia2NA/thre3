import React from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import SceneRepresentation from "model/scene";

import { Vector3 } from "three";

import ObjectRepresentation from "model/object";
import { Button } from "@material-ui/core";

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
  const scene = new SceneRepresentation();

  const cornell = new ObjectRepresentation(
    "robj/package/obj.obj",
    "robj/package/light.png",
    "robj/package/reflectance.png"
  );

  cornell.loadObjText();

  cornell.patchRes = [16, 16];
  console.log("start");
  cornell.getPatches();
  console.log("end");

  scene.addObject(cornell);

  const printrc = () => {
    // debugger;
    console.log(scene.raycast(new Vector3(-2, 0, 0), new Vector3(1, 0, 0)));
  };

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport
          scene={scene}
          displaymode="reflectance"
          setRaycaster={scene.setRC}
          setScene3={scene.setScene3}
        />
      </Viewdiv>

      <Controldiv>
        <Controlpanel />
        <Button onClick={printrc}>hi</Button>
      </Controldiv>
    </Maindiv>
  );
};

export default App;
