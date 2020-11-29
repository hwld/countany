import { NextApiHandler } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import prisma from "../../../prisma";

const options: InitOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
