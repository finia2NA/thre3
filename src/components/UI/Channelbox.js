import {
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
} from "@material-ui/core";
import React from "react";

const Channelbox = (props) => {
  return (
    <div>
      <FormControl>
        <FormLabel>Translate</FormLabel>
        <FormControlLabel control={<TextField type="number" />} label="x" />
        <FormControlLabel control={<TextField type="number" />} label="y" />
        <FormControlLabel control={<TextField type="number" />} label="z" />

        <FormLabel>Rotate</FormLabel>
        <FormControlLabel control={<TextField type="number" />} label="x" />
        <FormControlLabel control={<TextField type="number" />} label="y" />
        <FormControlLabel control={<TextField type="number" />} label="z" />

        <FormLabel>Scale</FormLabel>
        <FormControlLabel control={<TextField type="number" />} label="x" />
        <FormControlLabel control={<TextField type="number" />} label="y" />
        <FormControlLabel control={<TextField type="number" />} label="z" />

        <FormLabel>Specularity</FormLabel>
        <TextField type="number" />
      </FormControl>
    </div>
  );
};

export default Channelbox;
