import { Counter, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async (
  req: { body: Counter },
  res: { json: (counter: Counter) => void }
): Promise<void> => {
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
