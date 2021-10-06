import { Checkbox, FormControlLabel } from "@material-ui/core";
import React from "react";
import Explorepanel from "./Explore";

const Displaypanel = (props) => {
  return (
    <div>
      <div>
        Display <br />
        {/* <FormControlLabel
          label="Use Phong Specularity"
          control={<Checkbox />}
        /> */}
        <FormControlLabel
          label="Use Texel Interpolation"
          control={
            <Checkbox
              onChange={(event, val) => {
                props.setUseFilter(val);
              }}
            />
          }
        />
      </div>

      <div
        style={{
          marginTop: "5px",
          border: "0px",
          borderTop: "1px",
          borderStyle: "dashed",
        }}
      >
        Explore
        <br />
        <Explorepanel
          setDisplaymode={props.setDisplaymode}
          readyflags={props.readyflags}
        />
      </div>
    </div>
  );
};

export default Displaypanel;
