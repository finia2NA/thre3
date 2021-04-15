import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import { createStore } from "redux";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";
import { CubeAbstract, TeapotAbstract } from "model/ElementAbtract";
import { objToPatches } from "controller/Obj";
import testcube from "assets/testcube.obj";

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
  var objects = [new CubeAbstract([0, 0, 0])];

  objToPatches(testcube, 16, 16);

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport objects={objects} />
      </Viewdiv>

      <Controldiv>
        <Controlpanel />
      </Controldiv>
    </Maindiv>
  );
};

export default App;
