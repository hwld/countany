import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

const createHandler: NextApiHandler = async (req, res) => {
  const { id, value, name, startWith, amount, maxValue, minValue } = req.body;

  const session = await getSession({ req });

  const counter = await prisma.counter.create({
    data: {
      id,
      value,
      name,
      startWith,
      amount,
      maxValue,
      minValue,
      user: { connect: { email: session?.user.email } },
    },
  });
  res.json(counter);
};

export default createHandler;
