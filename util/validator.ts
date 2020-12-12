import { Counter } from "../models/counter";

export const validateCounter = (counter: Counter): boolean => {
  return (
    counter.minValue <= counter.startWith &&
    counter.startWith <= counter.maxValue &&
    counter.minValue <= counter.maxValue
  );
};
