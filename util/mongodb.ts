import {
  connect as mongoConnect,
  Document,
  Model,
  model as mongoModel,
} from "mongoose";

export const connect = (): Promise<typeof import("mongoose")> =>
  mongoConnect(process.env.DATABASE_URL || "", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// mongooseのmodelを直接使用すると複数回実行されてエラーが出る
// 参考: https://github.com/dherault/serverless-offline/issues/258#issuecomment-379145210
export const model = <T extends Document>(
  ...args: Parameters<typeof mongoModel>
): Model<T> => {
  try {
    // modelが存在しなければthrowする
    return mongoModel(args[0]);
  } catch {
    return mongoModel(...args);
  }
};
