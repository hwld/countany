import { Schema, Model, Document } from "mongoose";
import { model } from "../util/mongodb";

// 変更可能なフィールド
export type CounterFields = {
  name: string;
  startWith: number;
  amount: number; //変化量
  maxValue: number;
  minValue: number;
};

type _Counter = {
  value: number;

  // フロントエンドで作成し、リストの中で要素を識別するために使用する
  // idはサーバサイドで定義するのでフロントエンド側で作成した時点で使用することができないためこれを使用する
  listKey: string;
} & CounterFields;

// フロントエンド用の型定義
export type Counter = _Counter & { id: string };

// サーバサイド用の型定義
export type CounterModelObj = _Counter & {
  userId: string;
};

type ICounter = Document & CounterModelObj;

const CounterSchema = new Schema({
  value: { type: Number },
  listKey: { type: String },
  name: { type: String },
  startWith: { type: Number },
  amount: { type: Number },
  maxValue: { type: Number },
  minValue: { type: Number },
  userId: { type: String },
});

export const CounterModel: Model<ICounter> = model("Counter", CounterSchema);
