import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../prisma";
import { Counter } from "../../../types/client";
import { validateCounter } from "../../../util/validator";

const updateHandler: NextApiHandler = async (req, res) => {
  const counter: Counter = req.body;
  console.log(counter);

  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    res.end("セッションが存在しません。");
    return;
  }

  if (!validateCounter(counter)) {
    res.statusCode = 403;
    res.end("カウンターの値の関係が正しくありません。");
    return;
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      counters: {
        update: {
          where: { id: counter.id },
          data: {
            value: counter.value,
            name: counter.name,
            startWith: counter.startWith,
            amount: counter.amount,
            maxValue: counter.maxValue,
            minValue: counter.minValue,
          },
        },
      },
    },
  });

  res.json({});
};

export default updateHandler;
