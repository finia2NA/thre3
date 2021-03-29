import React from "react";
import CheckCircle from "@material-ui/icons/CheckCircle";
// import AddCircleOutline from "@material-ui/icons/AddCircleOutline" // could use this rotated by 45 degrees (if figured out how to do that :thinking:)
import Close from "@material-ui/icons/Close";
import { LinearProgress } from "@material-ui/core";
import { applyProps } from "react-three-fiber";

const Indicator = ({ ready }) => {
  return (
    <>
      {ready ? (
        <CheckCircle style={{ color: "green" }} />
      ) : (
        <Close style={{ color: "red" }} />
      )}
    </>
  );
};

const Indicators = (props) => {
  return (
    <div>
      <div>
        <Indicator ready={props.patches_ready} />
        Patch Distribution {!props.patches_ready && <b>not</b>} available
      </div>

      <div>
        <Indicator ready={props.matrix_ready} />
        Matrix Radiosity {!props.matrix_ready && <b>not</b>} available
      </div>

      <div>
        <Indicator ready={props.prog_ready} />
        Progressive Radiosity {!props.prog_ready && <b>not</b>} available
        {props.working && (
          <div>
            Calculating Radiosity...
            <LinearProgress />
          </div>
        )}
      </div>
    </div>
  );
};

export default Indicators;
