import React, {useState} from "react";

import {
  Slider,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Button,
  Radio
} from "@material-ui/core"

const Explorepanel = (props) => {

  const [method, setMethod] = useState(0)

  return (
    <div>
      <b>Explore</b> <br/>
      <FormLabel>Comparison Type</FormLabel>
      <RadioGroup value={method}>
        <FormControlLabel value={0} control={<Radio />} label="Intermethodical" onClick={() => setMethod(0)} />
        <FormControlLabel value={1} control={<Radio />} label="Intraprogressive" onClick={() => setMethod(1)} />
      </RadioGroup>
    </div>


  );
}

export default Explorepanel
