import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import { Counter } from "../../../types/client";
import { validateCounter } from "../../../util/validator";

const bulkCreateHandler: NextApiHandler = async (req, res) => {
  const counters: Counter[] = req.body;

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }

  counters.forEach((counter) => {
    if (!validateCounter(counter)) {
      res.statusCode = 403;
      res.end("カウンターの値の関係が正しくありません。");
      return;
    }
  });

  res.json({});
};

export default bulkCreateHandler;
