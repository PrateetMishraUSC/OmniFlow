import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const createClient = () => {
  const url = process.env.DATABASE_URL ?? "";

  if (url.startsWith("prisma+postgres://")) {
    // Accelerate path — @prisma/extension-accelerate must be installed at runtime
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { withAccelerate } = require("@prisma/extension-accelerate");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPostgres } = require("@prisma/adapter-prisma-postgres");
    const adapter = new PrismaPostgres({ url });
    return new PrismaClient({ adapter }).$extends(withAccelerate());
  }

  const pool = new Pool({ connectionString: url });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof createClient> | undefined;
}

const prisma = globalThis.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
