import React, {} from "react"
import {Checkbox, FormControlLabel} from "@material-ui/core"

const Renderpanel = () => {


  return(
    <div>
      <FormControlLabel label="Use Phong Specularity" control={<Checkbox/>}/>
      <FormControlLabel label="Use Texel Interpolation" control={<Checkbox/>}/>
    </div>
  );
}

export default Renderpanel