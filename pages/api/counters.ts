import { NextApiHandler } from "next";
import { getSession } from "next-auth/client";

const countersHandler: NextApiHandler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.json([]);
  }

  res.json([]);
};

export default countersHandler;
