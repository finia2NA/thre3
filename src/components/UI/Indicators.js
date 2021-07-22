import React from "react";
import CheckCircle from "@material-ui/icons/CheckCircle";
import Close from "@material-ui/icons/Close";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";
import { zip } from "util/arrays";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function CircularProgressWithLabel(props) {
  // from https://material-ui.com/components/progress/
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" {...props} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const Indicator = ({ ready: progress }) => {
  return (
    <>
      {progress === "ready" && <CheckCircle style={{ color: "green" }} />}
      {progress === "notready" && <Close style={{ color: "red" }} />}
      {progress > 0 && progress < 1 && (
        <CircularProgressWithLabel
          color="primary"
          variant="determinate"
          value={progress * 100}
        />
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
  const labeledValues = zip(props.progresses, [
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
            {labeledState[1]} {!(labeledState[0] === "ready") && <b>not</b>}{" "}
            available
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
