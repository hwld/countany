/* eslint-disable @typescript-eslint/ban-types */
import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";
const prisma = new PrismaClient();

const countersHandler: NextApiHandler = async (req, res) => {
  // ユーザ情報は返さない
  const session = await getSession({ req });

  if (!session) {
    res.json([]);
    return;
  }

  const counters = await prisma.counter.findMany({
    where: { user: { email: session?.user.email } },
    select: {
      id: true,
      value: true,
      name: true,
      startWith: true,
      amount: true,
      maxValue: true,
      minValue: true,
    },
  });

  res.json(counters);
};

export default countersHandler;
