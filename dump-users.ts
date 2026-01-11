import { prisma } from "./src/lib/prisma";
import fs from "fs";

async function dumpUsers() {
  try {
    const users = await prisma.user.findMany();
    const data = users.map(u => ({ email: u.email, role: u.role, id: u.id }));
    fs.writeFileSync("user-dump.json", JSON.stringify(data, null, 2));
    console.log("Dumped users to user-dump.json");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

dumpUsers();
