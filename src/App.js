import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";

import { SceneRepresentation } from "model/classes";

import { Raycaster } from "three";

import { ObjectRepresentation } from "model/classes";

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
  cornell.getPatches();

  scene.addObject(cornell);

  const a = (x) => {};

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport scene={scene} displaymode="reflectance" setraycaster={a} />
      </Viewdiv>

      <Controldiv>
        <Controlpanel />
      </Controldiv>
    </Maindiv>
  );
};

export default App;
