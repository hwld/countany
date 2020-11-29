import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../prisma";
import { Counter } from "../../../types/client";
import { validateCounter } from "../../../util/validator";
import { v4 as uuid } from "uuid";

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

  for (const counter of counters) {
    await prisma.counter.create({
      data: {
        id: uuid(),
        value: counter.value,
        name: counter.name,
        startWith: counter.startWith,
        amount: counter.amount,
        maxValue: counter.maxValue,
        minValue: counter.minValue,
        user: { connect: { email: session?.user.email } },
      },
    });
  }

  res.json({});
};

export default bulkCreateHandler;
