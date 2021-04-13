import React, { useState } from "react";

import {
  Slider,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Button,
  Radio,
} from "@material-ui/core";

const Explorepanel = (props) => {
  const [viewMode, setView] = useState(0);
  const [compareMethod, setMethod] = useState(0);

  return (
    <div>
      <FormLabel>Mode</FormLabel>
      <RadioGroup value={viewMode}>
        <FormControlLabel
          value={0}
          control={<Radio />}
          label="View"
          onClick={() => setView(0)}
        />
        <FormControlLabel
          value={1}
          control={<Radio />}
          label="Patches"
          onClick={() => setView(1)}
        />
        <FormControlLabel
          value={4}
          control={<Radio />}
          label="Continuity"
          onClick={() => setView(4)}
        />
        <FormControlLabel
          value={2}
          control={<Radio />}
          disabled={!props.prog_available}
          label="Diff"
          onClick={() => setView(2)}
        />
        <FormControlLabel
          value={3}
          control={<Radio />}
          disabled={!props.prog_available}
          label="Unshot Radiosity"
          onClick={() => setView(3)}
        />
      </RadioGroup>

      {viewMode === 2 && (
        <>
          <FormLabel>Diff Type</FormLabel>
          <RadioGroup value={compareMethod}>
            <FormControlLabel
              value={0}
              control={<Radio />}
              disabled={!props.matrix_available}
              label="Intermethodical"
              onClick={() => setMethod(0)}
            />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="Intraprogressive"
              onClick={() => setMethod(1)}
            />
          </RadioGroup>
        </>
      )}
      {viewMode === 2 && compareMethod === 1 && (
        <>
          <FormLabel>Iterations to Compare</FormLabel>
          <Slider
            value={[10, 20]} // this is how you do ranges, needs to be connected to an actual value for change though
            min={0}
            max={props.maxProgressiveStep}
            step={1}
            valueLabelDisplay="auto"
          />
        </>
      )}
      {(viewMode === 3 || (viewMode === 2 && compareMethod === 0)) && (
        <>
          <FormLabel>Progressive Iteration</FormLabel>
          <Slider
            min={0}
            max={props.maxProgressiveStep}
            step={1}
            valueLabelDisplay="auto"
          />
        </>
      )}
      {
        viewMode === 2 && <Button variant="contained">Compare</Button> // since comparisons need new textures, I don't want the dragging of the slider to instantly trigger the comparison for performance reasons.
      }
    </div>
  );
};

export default Explorepanel;
