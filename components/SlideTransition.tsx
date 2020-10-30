import { Slide } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import React from "react";

const Component = React.forwardRef(function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const SlideTransition = Component;
