import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const countersHandler: NextApiHandler = async (req, res) => {
  // ユーザ情報は返さない
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }

  res.json([]);
};

export default countersHandler;
