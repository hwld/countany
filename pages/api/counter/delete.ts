import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const deleteHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }

  res.json({});
};

export default deleteHandler;
