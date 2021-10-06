import React, { useState } from "react";
import styled from "styled-components";
import {
  Checkbox,
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
  const [radMethod, setMethod] = useState(0);
  const [cachedRes, setCachedRes] = useState(0);

  const txSteps = [8, 16, 32, 64, 128, 192];
  const txSliderFunction = (x) => txSteps[x];
  const threshPSliderFunction = (x) => -x / 100;
  const reverseThreshPSliderFunction = (x) => -x * 100;

  return (
    <div style={{ minWidth: "100" }}>
      <FormControl>
        <FormLabel>Radiosity Method</FormLabel>
        <RadioGroup value={radMethod}>
          <FormControlLabel
            value={0}
            control={<Radio />}
            label="Progressive Refinement"
            onClick={() => setMethod(0)}
          />
          {/* <FormControlLabel value={1} control={<Radio />} label="Matrix Solver" onClick={() => setMethod(1)} /> */}
        </RadioGroup>
        <FormLabel>Texture Size</FormLabel>
        <Slider
          defaultValue={txSteps.findIndex(
            (x) => x === props.defaultTextureSize[0]
          )}
          min={0}
          max={5}
          marks
          step={1}
          scale={txSliderFunction}
          valueLabelDisplay="auto"
          onChange={(event, val) => {
            const newRes = txSliderFunction(val);
            if (newRes !== cachedRes) {
              props.setTextureSize([newRes, newRes]);
              setCachedRes(newRes);
            }
          }}
        />
        <FormLabel>Form Factor Samples</FormLabel>
        <Slider
          defaultValue={props.defaultSamples}
          min={100}
          max={5000}
          step={100}
          valueLabelDisplay="auto"
          onChange={(event, val) => {
            props.setNumSamples(val);
          }}
        />
        {radMethod === 0 && (
          <div>
            <FormLabel>Unshot Radiosity Threshold</FormLabel>
            <Slider
              defaultValue={reverseThreshPSliderFunction(props.defaultThreshP)}
              min={-100}
              max={-1}
              step={1}
              scale={threshPSliderFunction}
              valueLabelDisplay="auto"
              onChange={(event, val) => {
                const newThreshP = threshPSliderFunction(val);
                props.setThreshP(newThreshP);
              }}
            />
          </div>
        )}
        <ButtonDiv>
          <PreButtonDiv>
            {/* Uncomment below for buttons to start only patch calculation / FF calculation */}
            {/* <Button variant="contained" onClick={props.calcPatches}>
              ロ
            </Button>
            <Button variant="contained" onClick={props.calcFF}>
              FF
            </Button> */}
          </PreButtonDiv>
          <Button
            variant="contained"
            color="primary"
            onClick={props.calcRad}
            disabled={!props.radPressable}
          >
            下
          </Button>
        </ButtonDiv>
        <FormControlLabel
          label="Download Texture after Radiosity"
          control={
            <Checkbox
              onChange={(event, val) => {
                props.setDownloadTexture(val);
              }}
            />
          }
        />
      </FormControl>
    </div>
  );
};

export default Radiositypanel;
