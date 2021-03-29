import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import { createStore } from "redux";

import Viewport from "components/Viewport";
import Controlpanel from "components/ControlPanel";

import { Checkerboard } from "components/3D/Textures";

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
  // create the ref to the canvas element
  const canvasRef = useRef(null);

  const draw = () => {
    console.log(canvasRef.current.toDataURL());
  };

  return (
    <Maindiv>
      <Viewdiv>
        <Viewport />
      </Viewdiv>

      <Controldiv>
        <Controlpanel />
      </Controldiv>
    </Maindiv>
  );
};

export default App;
