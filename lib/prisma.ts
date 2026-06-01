import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const createClient = () => {
  const url = process.env.DATABASE_URL ?? "";

  if (!url) {
    throw new Error("DATABASE_URL is required to initialize Prisma");
  }

  if (url.startsWith("prisma+postgres://")) {
    // Accelerate path — packages are optional and resolved at runtime only.
    // eval('require') prevents Turbopack from statically tracing these imports.
    // eslint-disable-next-line no-eval
    const runtimeRequire = eval("require");
    const { withAccelerate } = runtimeRequire("@prisma/extension-accelerate");
    const { PrismaPostgres } = runtimeRequire("@prisma/adapter-prisma-postgres");
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
