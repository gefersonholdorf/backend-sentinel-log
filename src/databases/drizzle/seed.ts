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

async function seedLogs() {
  const API_URL = "http://127.0.0.1:3335/api/v1/logs";

  const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6NiwiYXBpSWQiOjMxLCJpYXQiOjE3NjcxMDM5MDZ9.vnQXRDIZ-jwOS_sPAckeUEQWVMs3b8n67MWfHBgCfB4";

  const messages = [
    "Configuração Alterada",
    "Usuário Criado",
    "Permissão Atualizada",
    "Registro Excluído",
    "Acesso Negado",
    "Login Realizado",
  ];

  const components = [
    "Configuração",
    "Usuários",
    "Permissões",
    "Sistema",
    "Autenticação",
  ];

  const actions = ["create", "update", "delete", "read"];
  const users = ["Admin", "Teste", "Sistema", "Auditoria", "Root"];

  const randomItem = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const randomIP = () =>
    `${faker.number.int({ min: 1, max: 255 })}.${faker.number.int({
      min: 0,
      max: 255,
    })}.${faker.number.int({ min: 0, max: 255 })}.${faker.number.int({
      min: 0,
      max: 255,
    })}`;

  for (let i = 1; i <= 18; i++) {
    const payload = {
      message: randomItem(messages),
      ip: randomIP(),
      component: randomItem(components),
      action: randomItem(actions),
      affectedRecordID: faker.number.int({ min: 1, max: 1000 }).toString(),
      user: randomItem(users),
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro no log ${i}: ${await response.text()}`);
    }

    console.log(`✔️ Log ${i}/50 enviado`);
  }
}

async function main() {
  try {
    // await seedClients();
    // await seedApis();
    await seedLogs();
    console.log("🎯 Seed finalizado com sucesso");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

main();

