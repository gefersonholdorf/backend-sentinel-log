import { faker } from "@faker-js/faker";
import { apisTable, clientsTable } from "./schemas/schema";

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

async function seedApis() {
  const apisData = Array.from({ length: 50 }).map(() => ({
    name: faker.internet.domainWord(),
    description: faker.lorem.sentence(),
    clientId: faker.number.int({ min: 5, max: 10 }),
    token: faker.string.uuid(),
    expiresIn: faker.date.future({ years: 1 }),
    urlCallbackStatus: faker.internet.url(),
    isActive: faker.datatype.boolean(),
  }));

  try {
    await dbSeed.insert(apisTable).values(apisData);
    console.log("✅ 50 APIs criadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar APIs:", error);
  }
}

// seedClients()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });

seedApis()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
  });

