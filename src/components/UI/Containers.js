import { Button } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Collapse } from "react-collapse"


const LightContainer = styled.div`
border-top: 1px solid grey;
`;

const Collapsing = (props) => {

  const [open, setOpen] = useState(props.initiallyOpened)
  // const [open, setOpen] = useState(true)

  return (
    <LightContainer>
      <Button onClick={() => setOpen(!open)}>{props.name}</Button>
      <Collapse isOpened={open}>
        {props.children}
      </Collapse>

    </LightContainer>
  );
}

export { LightContainer, Collapsing };