import React, { useEffect, useRef, forwardRef } from "react";

export const Checkerboard = forwardRef((props, ref) => {
  // when the canvas has mounted, draw
  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");

    // Draw the checkerboard
    for (var col = 0; col < props.width; col++) {
      for (var row = 0; row < props.width; row++) {
        context.fillStyle = (col + row) % 2 === 0 ? "black" : "white";
        context.fillRect(col, row, 1, 1);
      }
    }
  }, [props.width, props.height]);

  return (
    <>
      <canvas width={props.width} height={props.height} ref={ref} {...props} />
    </>
  );
});
