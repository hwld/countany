import { Schema, Model, Document } from "mongoose";
import { model } from "../util/mongodb";

export type CounterObj = {
  value: number;
  name: string;
  startWith: number;
  amount: number;
  maxValue: number;
  minValue: number;
  userId: string;
};

type ICounter = Document & CounterObj;

const CounterSchema: Schema = new Schema({
  value: { type: Number },
  name: { type: String },
  startWith: { type: Number },
  amount: { type: Number },
  maxValue: { type: Number },
  minValue: { type: Number },
  userId: { type: String },
});

export const CounterModel: Model<ICounter> = model("Counter", CounterSchema);
