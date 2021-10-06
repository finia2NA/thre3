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
      {/* Uncomment below to start implementation of a channel box, through wich objects can be moved, rotated and scaled */}
      {/* <Collapsing name="Channel Box">
        <Channelbox />
      </Collapsing> */}

      <Collapsing name="Radiosity Controls" initiallyOpened={true}>
        <Radiositypanel
          calcPatches={props.calcPatches}
          calcFF={props.calcFF}
          calcRad={props.calcRad}
          setNumSamples={props.setNumSamples}
          setTextureSize={props.setTextureSize}
          setThreshP={props.setThreshP}
          defaultTextureSize={props.defaultTextureSize}
          defaultThreshP={props.defaultThreshP}
          defaultSamples={props.defaultSamples}
        />
      </Collapsing>

      <Collapsing name="Display Controls" initiallyOpened={true}>
        <Displaypanel
          setDisplaymode={props.setDisplaymode}
          readyflags={props.progresses.map((p) => p === "ready")}
          setUseFilter={props.setUseFilter}
        />
      </Collapsing>

      {/* Uncomment below to start implementation of Transfer Panel, through which objects can be imported */}
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
