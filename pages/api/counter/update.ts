import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { Counter, CounterModel } from "../../../models/counter";
import { UserModel } from "../../../models/user";
import { connect } from "../../../util/mongodb";
import { validateCounter } from "../../../util/validator";

const updateHandler: NextApiHandler = async (req, res) => {
  const counter: Counter = req.body;
  const session = await getSession({ req });
  const email = session?.user.email;

  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }
  if (!email) {
    res.statusCode = 403;
    res.end("メールアドレスが存在しません。");
    return;
  }

  if (!validateCounter(counter)) {
    res.statusCode = 403;
    res.end("カウンターの値の関係が正しくありません。");
    return;
  }

  await connect();

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    res.statusCode = 403;
    res.end("ユーザが存在しません。");
    return;
  }

  await CounterModel.updateOne(
    { userId: user.id, _id: counter.id },
    {
      value: counter.value,
      name: counter.name,
      startWith: counter.startWith,
      amount: counter.amount,
      maxValue: counter.maxValue,
      minValue: counter.minValue,
    }
  );

  res.json({});
};

export default updateHandler;
