import React, { useRef, useState, useMemo, useEffect } from "react";
import styled from "styled-components";

import { createStore } from "redux";

import Viewport from "components/Viewport";
import Controlpanel from "components/ControlPanel";
import { TeapotAbstract } from "components/Model/ElementAbtract";

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
  var objects = [new TeapotAbstract()];

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
