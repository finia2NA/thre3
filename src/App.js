import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import { createStore } from "redux";

import Viewport from "components/UI/Viewport";
import Controlpanel from "components/UI/ControlPanel";
import { CubeAbstract, TeapotAbstract } from "model/ElementAbtract";
import { objToPatches } from "controller/Obj";
import testcube from "assets/testcube.obj";

import { Raycaster } from "three";

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

  // https://threejs.org/docs/#api/en/core/Raycaster
  var raycaster;

  var setraycaster = (rc) => {
    raycaster = rc;
  };

  objToPatches(testcube, 16, 16);

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport objects={objects} setraycaster={setraycaster} />
      </Viewdiv>

      <Controldiv>
        <Controlpanel />
      </Controldiv>
    </Maindiv>
  );
};

export default App;
