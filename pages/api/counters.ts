/* eslint-disable @typescript-eslint/ban-types */
import { Counter, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (
  req: {},
  res: { json: (counters: Counter[]) => void }
): Promise<void> => {
  const counters = await prisma.counter.findMany({});
  res.json(counters);
};
