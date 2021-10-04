import React from "react";
import Radiositypanel from "components/UI/Radiosity";
import Displaypanel from "components/UI/Display";
import Indicators from "components/UI/Indicators";
import Exportpanel from "components/UI/Export";
import Channelbox from "components/UI/Channelbox";
import styled from "styled-components";
import { Collapsing } from "components/UI/Containers";

/*
Required Settings:
- Radiosity
  - Texture Size
  - Render Method
  - Render Button
  - Progressive: Threshold

- Exploring (MOVED INTO DISPLAY SECTION)
  - Compare selector
    - Intra-Progressive
      - Iteration A, Iteration B (On one slider perhaps)
    -Inter-method
      - Progressive Iteration
  - Mode Selector
    - Normal
    - Patches
    - Diff
    - Unshot_Radiosity

- Display
  - Use Blinn-Phong Specularity
  - Use Texture Interpolation

- Indicator:
  - Progressive Model generated!
  - Matrix Model generated!
  (When both are loaded, they can be compared)
  - Progress bar

- Channelbox
- Channel Box
- Translation
- Rotation
- Scale..ation
- Blinn-Phong Specularity Constant
- ((Texture Resolution))

- Export/Import
  - Import Model
  - Export Scene
*/

const Controldiv = styled.div`
  overflow-y: scroll;
  scroll-behavior: "smooth";
  height: 95vh;
`;

const Controlpanel = (props) => {
  return (
    <Controldiv>
      {/* <Collapsing name="Channel Box">
        <Channelbox />
      </Collapsing> */}

      <Collapsing name="Radiosity Controls" initiallyOpened={true}>
        <Radiositypanel
          calcPatches={props.calcPatches}
          calcFF={props.calcFF}
          calcRad={props.calcRad}
          setTextureSize={props.setTextureSize}
        />
      </Collapsing>

      <Collapsing name="Display Controls" initiallyOpened={true}>
        <Displaypanel
          setDisplaymode={props.setDisplaymode}
          readyflags={props.progresses.map((p) => p === "ready")}
          setUseFilter={props.setUseFilter}
        />
      </Collapsing>

      {/* <Collapsing name="Transfer Controls">
        <Exportpanel />
      </Collapsing> */}

      <Collapsing name="Indicators" initiallyOpened={true}>
        <Indicators progresses={props.progresses} />
      </Collapsing>
    </Controldiv>
  );
};

export default Controlpanel;
