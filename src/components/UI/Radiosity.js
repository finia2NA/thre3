import React, { useState } from "react";
import styled from "styled-components";
import {
  Slider,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Button,
  Radio,
} from "@material-ui/core";

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const PreButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Radiositypanel = (props) => {
  const [method, setMethod] = useState(0);

  return (
    <div style={{ minWidth: "100" }}>
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
          <FormControlLabel
            value={0}
            control={<Radio />}
            label="Progressive Refinement"
            onClick={() => setMethod(0)}
          />
          {/* <FormControlLabel value={1} control={<Radio />} label="Matrix Solver" onClick={() => setMethod(1)} /> */}
        </RadioGroup>
        {method === 0 && (
          <div>
            <FormLabel>Unshot Radiosity Threshold</FormLabel>
            <Slider
              min={-10}
              max={-0.5}
              step={0.5}
              scale={(x) => -x / 10} // TODO: Figure out sensitivity
              valueLabelDisplay="auto"
            />
          </div>
        )}
        <ButtonDiv>
          <PreButtonDiv>
            <Button
              variant="contained"
              color="ternary"
              onClick={props.calcPatches}
            >
              ロ
            </Button>
            <Button variant="contained" color="ternary" onClick={props.calcFF}>
              FF
            </Button>
          </PreButtonDiv>
          <Button variant="contained" color="primary" onClick={props.calcRad}>
            下
          </Button>
        </ButtonDiv>
      </FormControl>
    </div>
  );
};

export default Radiositypanel;
