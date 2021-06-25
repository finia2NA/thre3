import React from "react";
import CheckCircle from "@material-ui/icons/CheckCircle";
// import AddCircleOutline from "@material-ui/icons/AddCircleOutline" // could use this rotated by 45 degrees (if figured out how to do that :thinking:)
import Close from "@material-ui/icons/Close";
import { LinearProgress } from "@material-ui/core";
import styled from "styled-components";
import { zip } from "util/arrays";

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
  const labeledValues = zip(props.readyflags, [
    "Patches",
    "Form Factors",
    "Radiosity",
  ]);

  return (
    <>
      {labeledValues.map((labeledState, i) => (
        <Div1 key={i}>
          <Indicator ready={labeledState[0]} />
          <span>
            {labeledState[1]} {!labeledState[0] && <b>not</b>} available
          </span>
        </Div1>
      ))}

      {/* {props.working && (
        <div>
          Calculating Radiosity...
          <LinearProgress />
        </div>
      )} */}
    </>
  );
};

export default Indicators;
