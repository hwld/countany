import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
import prisma from "../../../prisma";
import { Counter } from "../../../types/client";

const updateHandler: NextApiHandler = async (req, res) => {
  const {
    id,
    value,
    name,
    startWith,
    amount,
    maxValue,
    minValue,
  }: Counter = req.body;

  const session = await getSession({ req });

  await prisma.user.update({
    where: { email: session?.user.email },
    data: {
      counters: {
        update: {
          where: { id },
          data: { value, name, startWith, amount, maxValue, minValue },
        },
      },
    },
  });

  res.json({});
};

export default updateHandler;
