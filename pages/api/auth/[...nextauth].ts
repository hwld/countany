import { NextApiHandler } from "next";
import NextAuth, { InitOptions } from "next-auth";
import Providers from "next-auth/providers";

const options: InitOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  database: process.env.DATABASE_URL || "",
};

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);

export default authHandler;
