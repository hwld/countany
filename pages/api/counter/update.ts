import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
const prisma = new PrismaClient();

const updateHandler: NextApiHandler = async (req, res) => {
  const { id, value, name, startWith, amount, maxValue, minValue } = req.body;
  const counter = await prisma.counter.update({
    where: { id },
    data: {
      value,
      name,
      startWith,
      amount,
      maxValue,
      minValue,
    },
  });
  res.json(counter);
};

export default updateHandler;
