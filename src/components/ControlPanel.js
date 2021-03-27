import React from "react"
import Card from "./Card"
import Slider from "@material-ui/core/Slider"
import Typography from "@material-ui/core/Typography"
import Radiositypanel from "./UI/Radiosity"

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

- RT-Effects
  - Use Blinn-Phong Specularity

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


const ControlPanel = (props) => {

  return (
    <div>
      <Radiositypanel/>
        
    </div>
  );
}

export default ControlPanel