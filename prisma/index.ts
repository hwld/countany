import { PrismaClient, PrismaClientOptions } from "@prisma/client";

// https://github.com/prisma/prisma-client-js/issues/228
let prisma: PrismaClient<PrismaClientOptions, never>;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
