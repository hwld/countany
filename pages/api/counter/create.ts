import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";

const prisma = new PrismaClient();

const createHandler: NextApiHandler = async (req, res) => {
  const { id, value, name, startWith, amount, maxValue, minValue } = req.body;
  const counter = await prisma.counter.create({
    data: {
      id,
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

export default createHandler;
