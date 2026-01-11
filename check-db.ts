import { prisma } from "./src/lib/prisma";

async function check() {
  try {
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.session.count();
    console.log(`Users: ${userCount}`);
    console.log(`Sessions: ${sessionCount}`);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany({ take: 5 });
      console.log("Sample Users:", users.map(u => ({ id: u.id, email: u.email, role: u.role })));
    }
  } catch (error) {
    console.error("Database check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
