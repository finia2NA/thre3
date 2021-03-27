import React from "react"
import Radiositypanel from "./UI/Radiosity"
import Renderpanel from "./UI/Render"
import Indicators from "./UI/Indicators"
import Exportpanel from "./UI/Export"
import Explorepanel from "./UI/Explore";

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
  - Import Model
  - Channel Box
    - Translation
    - Rotation
    - Scale..ation
    - Blinn-Phong Specularity Constant
    - ((Texture Resolution))

  - Exporting
    - Export Scene
*/


const Controlpanel = (props) => {

  return (
    <div>
      <Radiositypanel/>
      <Renderpanel/>
      <Indicators matrix_ready= {false} working={false}/>
      <Exportpanel/>
      <Explorepanel/>
    </div>
  );
}

export default Controlpanel