export type Counter = {
  // まだサーバ側で生成されていないカウンターはidが""になる。
  id: string;
  value: number;
  name: string;
  startWith: number;
  amount: number;
  maxValue: number;
  minValue: number;
};
