import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../prisma";
import { Counter } from "../../../types/client";

const bulkCreateHandler: NextApiHandler = async (req, res) => {
  const counters: Counter[] = req.body;

  const session = await getSession({ req });

  for (const counter of counters) {
    await prisma.counter.create({
      data: {
        id: counter.id,
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
