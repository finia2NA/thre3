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

  const txSliderFunction = (x) => [8, 16, 32, 64, 128, 192][x];

  return (
    <div style={{ minWidth: "100" }}>
      <FormControl>
        <FormLabel>Texture Size</FormLabel>
        <Slider
          min={0}
          max={5}
          marks
          step={1}
          scale={txSliderFunction}
          valueLabelDisplay="auto"
          onChange={(event, val) => {
            const newRes = txSliderFunction(val);
            props.setTextureSize([newRes, newRes]);
          }}
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
              min={-100}
              max={-1}
              step={1}
              scale={(x) => -x / 100}
              valueLabelDisplay="auto"
            />
          </div>
        )}
        <ButtonDiv>
          <PreButtonDiv>
            {/* <Button variant="contained" onClick={props.calcPatches}>
              ロ
            </Button>
            <Button variant="contained" onClick={props.calcFF}>
              FF
            </Button> */}
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
