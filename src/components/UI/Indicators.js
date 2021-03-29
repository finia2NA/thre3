import React from "react";
import CheckCircle from "@material-ui/icons/CheckCircle";
// import AddCircleOutline from "@material-ui/icons/AddCircleOutline" // could use this rotated by 45 degrees (if figured out how to do that :thinking:)
import Close from "@material-ui/icons/Close";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";

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

const Div1 = styled.div`
  display: flex;
  align-items: center;
  margin: 2px 0px 2px;
`;

const Indicators = (props) => {
  return (
    <>
      <Div1>
        <Indicator ready={props.patches_ready} />
        <span>
          Patch Distribution {!props.patches_ready && <b>not</b>} available
        </span>
      </Div1>

      <Div1>
        <Indicator ready={props.matrix_ready} />
        <span>
          Matrix Radiosity {!props.matrix_ready && <b>not</b>} available
        </span>
      </Div1>

      <Div1>
        <Indicator ready={props.prog_ready} />
        <span>
          Progressive Radiosity {!props.prog_ready && <b>not</b>} available
        </span>
      </Div1>
      {props.working && (
        <div>
          Calculating Radiosity...
          <LinearProgress />
        </div>
      )}
    </>
  );
};

export default Indicators;
