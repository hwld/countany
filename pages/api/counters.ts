/* eslint-disable @typescript-eslint/ban-types */
import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
const prisma = new PrismaClient();

const countersHandler: NextApiHandler = async (req, res) => {
  const counters = await prisma.counter.findMany({});
  res.json(counters);
};

export default countersHandler;
