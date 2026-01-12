import "dotenv/config";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
import { auth } from "../lib/auth";

async function seedAdmin() {
  try {
    console.log("🚀 Admin seeding started...");

    const adminData = {
      name: "Admin X d Shaheb",
      email: "admxdin@admin.com",
      password: "admin1234",
      role: UserRole.ADMIN,
      emailVerified: true,
    };

    // check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    console.log("🔍 Checking if admin exists...");

    if (existingUser) {
      console.log("⚠️ Admin already exists. Skipping seed.");
      return;
    }

    // create user using auth api
    await auth.api.signUpEmail({
      body: {
        email: adminData.email,
        password: adminData.password,
        name: adminData.name,
      },
    });

    console.log("✅ Admin account created via auth");

    // update role & email verification
    const updatedUser = await prisma.user.update({
      where: {
        email: adminData.email,
      },
      data: {
        role: adminData.role,
        emailVerified: adminData.emailVerified,
      },
    });

    console.log("🎯 Admin role & email verified successfully");
    console.log("👤 Seeded Admin:", updatedUser);
  } catch (error) {
    console.error("❌ Error while seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
