import { Counter, PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";

const prisma = new PrismaClient();

const deleteHandler: NextApiHandler = async (req, res) => {
  const { id } = req.body;
  const counter = await prisma.counter.delete({
    where: { id },
  });
  res.json(counter);
};

export default deleteHandler;
