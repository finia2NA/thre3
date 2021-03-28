import React, { useState } from "react"
import Radiositypanel from "components/UI/Radiosity"
import Displaypanel from "components/UI/Display"
import Indicators from "components/UI/Indicators"
import Exportpanel from "components/UI/Export"
import Explorepanel from "components/UI/Explore";
import Channelbox from "components/UI/Channelbox";
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

  const [Collapsingd, setCollapsingd] = useState([false, false, false, false, false, false]) // TODO: https://i.pinimg.com/originals/95/eb/33/95eb3384257ba3174cdf71341f9bc65a.jpg

  return (
    <div>
      
        <Collapsing name="Channel Box">
          <Channelbox />
        </Collapsing>

        <Collapsing name="Radiosity Controls">
          <Radiositypanel />
        </Collapsing>

        <Collapsing name="Display Controls">
          <Displaypanel />
        </Collapsing>

        <Collapsing name="Transfer Controls">
          <Exportpanel />
        </Collapsing>

      {/* <div>
        <Collapsing name = "Explore Panel">
          <Explorepanel />
        </Collapsing>
      </div> */}


      <Collapsing name="Indicators" initiallyOpened={true}>
        <Indicators matrix_ready={false} working={false} />
      </Collapsing>

    </div>
  );
}

export default Controlpanel

