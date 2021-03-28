import React, { useState } from "react"

import {
  Slider,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Button,
  Radio
} from "@material-ui/core"

const Radiositypanel = () => {

  const [method, setMethod] = useState(0); // TODO: make the value here the default value in the radiogroup




  return (
    <div style={{ minWidth: '100' }}>
      <FormControl>
        <FormLabel>Texture Size</FormLabel>
        <Slider
          min={4}
          max={12}
          marks
          step={1}
          scale={(x) => 2 ** x}
          valueLabelDisplay="auto"
        />
        <FormLabel>Render Method</FormLabel>
        <RadioGroup value={method}>
          <FormControlLabel value={0} control={<Radio />} label="Progressive Refinement" onClick={() => setMethod(0)} />
          <FormControlLabel value={1} control={<Radio />} label="Matrix Solver" onClick={() => setMethod(1)} />
        </RadioGroup>
        {method === 0 &&
          <div>
            <FormLabel>Unshot Radiosity Threshold</FormLabel>
            <Slider
              min={-10}
              max={-0.5}
              step={0.5}
              scale={(x) => -x / 10}// TODO: Figure out sensitivity
              valueLabelDisplay="auto"
            />
          </div>
        }
        <Button variant="contained" color="primary">Calculate Radiosity</Button>
      </FormControl>
    </div>
  );
}

export default Radiositypanel