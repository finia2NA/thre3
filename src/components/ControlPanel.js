import React, { useState } from "react"
import Radiositypanel from "components/UI/Radiosity"
import Renderpanel from "components/UI/Render"
import Indicators from "components/UI/Indicators"
import Exportpanel from "components/UI/Export"
import Explorepanel from "components/UI/Explore";
import Channelbox from "components/UI/Channelbox";
import { Collapse } from "react-collapse"
import { Button } from "@material-ui/core"
import {LightContainer, Collapsing} from "components/UI/Containers"

/*
Required Settings:
- Radiosity
  - Texture Size
  - Render Method
  - Render Button
  - Progressive: Threshold

- Exploring
  - Compare selector
    - Intra-Progressive
      - Iteration A, Iteration B (On one slider perhaps)
    -Inter-method
      - Progressive Iteration
  - Mode Selector
    - Normal
    - Diff
    - Unshot_Radiosity

- Rendering
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


const Controlpanel = (props) => {

  const [collapsed, setCollapsed] = useState([false, false, false, false, false, false]) // TODO: https://i.pinimg.com/originals/95/eb/33/95eb3384257ba3174cdf71341f9bc65a.jpg

  return (
    <div>
      <div>
        <Button variant="text">test</Button>
        <Collapse isOpened={collapsed[0]}>
          <Radiositypanel />
        </Collapse>
      </div>
      <div>
        1
        <Collapse isOpened={collapsed[1]}>
          <Renderpanel />
        </Collapse>
      </div>
      <div>
        3
        <Collapse isOpened={collapsed[3]}>
          <Exportpanel />
        </Collapse>
      </div>
      <div>
        4
        <Collapse isOpened={collapsed[4]}>
          <Explorepanel />
        </Collapse>
      </div>
      <div>
        5
        <Collapse isOpened={collapsed[5]}>
          <Channelbox />
        </Collapse>
      </div>

      <Collapsing name="dieter" initiallyOpened={true}>
        <Indicators matrix_ready={false} working={false} />
      </Collapsing>

    </div>
  );
}

export default Controlpanel

