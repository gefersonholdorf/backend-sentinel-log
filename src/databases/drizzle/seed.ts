import { faker } from "@faker-js/faker";
import { clientsTable } from "./schemas/schema";

import { drizzle } from "drizzle-orm/mysql2"
import { env } from "../../env";

export const dbSeed = drizzle(env.DATABASE_URL);


async function seedClients() {
  const clientData = Array.from({ length: 30 }).map(() => ({
    name: faker.company.name(),
    description: faker.company.buzzPhrase(),
  }));

  try {
    await dbSeed.insert(clientsTable).values(clientData);
    console.log("✅ 30 clientes criados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar clientes:", error);
  }
}

seedClients()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
