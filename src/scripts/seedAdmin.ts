import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin1234";
    const adminName = process.env.ADMIN_NAME || "Admin";
    // return console.log(adminEmail, adminPassword, adminName);
    console.log("🔍 Checking if admin already exists...");
    const existingUser = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingUser) {
      console.log(
        `✅ Admin already exists with email and updated! : ${adminEmail}`
      );
    }

    let user: {
      name: string;
      email: string;
      role?: UserRole.ADMIN;
      emailVerified: boolean;
      id?: string;
    } = {
      name: adminName,
      email: adminEmail,
      emailVerified: false,
      role: UserRole.ADMIN,
    };

    if (existingUser) {
      const { user: loggedUser } = await auth.api.signInEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
        },
      });
      user = {
        name: loggedUser.name,
        email: loggedUser.email,
        emailVerified: loggedUser.emailVerified,
      };
    } else {
      const result = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      if (!result) {
        throw new Error(
          "Sign up failed: No result returned from Better Auth API"
        );
      }
      user = {
        name: result.user.name,
        email: result.user.email,
        emailVerified: result.user.emailVerified,
        id: result.user.id,
      };
      prisma.user.create({
        data: {
          role: user.role as UserRole.ADMIN,
          emailVerified: user.emailVerified,
          name: user.name,
          email: user.email,
          id: user.id as string,
        },
      });
    }

    console.log(`⏳ Creating admin user (${adminEmail})...`);

    console.log("✨ User created, promoting to ADMIN and verifying email...");

    await prisma.user.update({
      where: { email: user.email },
      data: {
        role: user.role as UserRole.ADMIN,
        emailVerified: user.emailVerified,
      },
    });

    console.log("\n✅ Admin seeded successfully!");
    console.log("------------------------------------------");

    console.log(`Email:    ${user.email}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     ${UserRole.ADMIN}`);
    console.log("------------------------------------------");
    console.log("You can now log in with these credentials.");
  } catch (error: any) {
    console.error("\n❌ Error seeding admin:", error);

    // Better Auth might return structured errors
    if (error.body && error.body.message) {
      console.error(error.body.message);
    } else {
      console.error(error.message || error);
    }

    if (
      error.message?.includes("transporter.sendMail") ||
      error.message?.includes("ECONNREFUSED")
    ) {
      console.log(
        "\nNOTE: The user may have been created but verification email failed to send."
      );
      console.log("Check if your SMTP settings in .env are correct.");
    }
  } finally {
    // Ensure the Prisma connection is closed
    await prisma.$disconnect();
  }
}

// Execute the seed function
seedAdmin()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("Fatal error during seeding:", err);
    process.exit(1);
  });

//   {
//   redirect: false,
//   token: 'THQTxOwALV6l8lwhmirj3KdbCociQ69r',
//   url: undefined,
//   user: {
//     name: ' Imran Hossain1',
//     email: 'imran7751@gmail.com',
//     emailVerified: false,
//     image: null,
//     createdAt: 2026-01-10T17:12:32.885Z,
//     updatedAt: 2026-01-10T17:12:32.885Z,
//     role: 'admin',
//     phone: null,
//     status: 'active',
//     id: 'Mr9wAnoAgCHP0CKB2BMvx1pi9aevWa3f'
//   }
// }
