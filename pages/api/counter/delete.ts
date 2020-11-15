import { PrismaClient } from "@prisma/client";
import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const prisma = new PrismaClient();

const deleteHandler: NextApiHandler = async (req, res) => {
  const { id } = req.body;

  const session = await getSession({ req });

  await prisma.user.update({
    where: { email: session?.user.email },
    data: { counters: { delete: { id } } },
  });

  // const counter = await prisma.counter.delete({
  //   where: { id },
  // });
  res.json({});
};

export default deleteHandler;
