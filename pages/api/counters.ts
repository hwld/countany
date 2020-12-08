import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { CounterModel } from "../../models/counter";
import { UserModel } from "../../models/user";
import { Counter } from "../../types/client";
import { connect } from "../../util/mongodb";

const countersHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  const email = session?.user.email;

  if (!session) {
    return res.json([]);
  }
  if (!email) {
    return res.json([]);
  }

  await connect();

  const user = await UserModel.findOne({ email: email });
  if (!user) {
    res.statusCode = 403;
    res.end("ユーザが存在しません。");
    return;
  }

  const counters: Counter[] = (
    await CounterModel.find({ userId: user.id })
  ).map((doc) => ({
    id: doc.id,
    value: doc.value,
    name: doc.name,
    startWith: doc.startWith,
    amount: doc.amount,
    maxValue: doc.maxValue,
    minValue: doc.minValue,
  }));

  res.json(counters);
};

export default countersHandler;
