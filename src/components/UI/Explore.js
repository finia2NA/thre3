import React, { useState } from "react";

import {
  Slider,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Button,
  Radio,
} from "@material-ui/core";

const Explorepanel = (props) => {
  const [viewMode, setViewMode] = useState(0);
  const [compareMethod, setMethod] = useState(0);

  const setView = (x) => {
    setViewMode(x);
    switch (x) {
      case 0:
        props.setDisplaymode("reflectance");
        break;
      case 1:
        props.setDisplaymode("luminance");
        break;
      case 2:
        props.setDisplaymode("checkerboard");
        break;
      case 3:
        props.setDisplaymode("rainbow");
        break;
      case 4:
        props.setDisplaymode("rad");
        break;
      default:
        console.error("invalid view set in Explore Panel");
    }
  };

  return (
    <div>
      <FormLabel>Mode</FormLabel>
      <RadioGroup value={viewMode}>
        <FormControlLabel
          value={0}
          control={<Radio />}
          label="Reflectance"
          onClick={() => setView(0)}
        />
        <FormControlLabel
          value={1}
          control={<Radio />}
          label="Luminance"
          onClick={() => setView(1)}
        />
        <FormControlLabel
          value={2}
          control={<Radio />}
          label="Checkerboard"
          onClick={() => setView(2)}
        />
        <FormControlLabel
          value={3}
          control={<Radio />}
          label="Rainbow"
          onClick={() => setView(3)}
        />
        <FormControlLabel
          value={4}
          control={<Radio />}
          disabled={!props.readyflags[2]}
          label="Radiosity"
          onClick={() => {
            if (props.readyflags[2]) setView(4);
            else
              alert("please calculate radiosity before trying to display it.");
          }}
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
