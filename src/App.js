import React, { useRef, useState, useMemo, useEffect } from "react";

import styled from "styled-components";

import Viewport from "components/Viewport";
import Controlpanel from "components/ControlPanel";

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

const App = () => {
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
