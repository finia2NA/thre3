import React, { } from "react"
import { Checkbox, FormControlLabel } from "@material-ui/core"
import Explorepanel from "./Explore"

const Displaypanel = () => {


  return (
    <div>
      <div>
        Display <br />
        <FormControlLabel label="Use Phong Specularity" control={<Checkbox />} />
        <FormControlLabel label="Use Texel Interpolation" control={<Checkbox />} />
      </div>

      <div style={{ marginTop: "5px", border: "0px", borderTop: "1px", borderStyle: "dashed" }}>
        Explore<br />
        <Explorepanel />
      </div>
    </div>
  );
}

export default Displaypanel