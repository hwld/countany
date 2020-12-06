import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { CounterModel } from "../../../models/counter";
import { UserModel } from "../../../models/user";
import { connect } from "../../../util/mongodb";

const deleteHandler: NextApiHandler = async (req, res) => {
  const { id } = req.body;

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }

  await connect();

  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) {
    res.statusCode = 403;
    res.end("ユーザが存在しません。");
    return;
  }

  await CounterModel.deleteOne({ _id: id, userId: user.id });

  res.json({});
};

export default deleteHandler;
