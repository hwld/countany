import { Counter, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async (
  req: { body: { id: string } },
  res: { json: (counter: Counter) => void }
): Promise<void> => {
  const { id } = req.body;
  const counter = await prisma.counter.delete({
    where: { id },
  });
  res.json(counter);
  return;
};
