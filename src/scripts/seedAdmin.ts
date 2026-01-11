import "dotenv/config";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

let user: {
  name: string;
  email: string;
  password: string;
  role?: UserRole.ADMIN;
  emailVerified: boolean;
  id?: string;
} = {
  email: process.env.ADMIN_EMAIL || "admin@gmail.com",
  password: process.env.ADMIN_PASSWORD || "admin1234",
  name: process.env.ADMIN_NAME || "Admin",
  emailVerified: false,
  role: UserRole.ADMIN,
};

async function seedAdmin() {
  await prisma.$connect();
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      const { user: loggedUser } = await auth.api.signInEmail({
        body: {
          email: user.email,
          password: user.password,
        },
      });
      const { email } = await prisma.user.update({
        where: { email: loggedUser.email },
        data: {
          email: loggedUser.email,
          name: loggedUser.name,
        },
      });

      console.log(`Admin updated with email ${email}`);
    } else {
      const { user: loggedUser } = await auth.api.signUpEmail({
        body: {
          email: user.email,
          password: user.password,
          name: user.name,
        },
      });

      const { email } = await prisma.user.create({
        data: {
          email: loggedUser.email,
          name: loggedUser.name,
          id: loggedUser.id,
        },
      });

      console.log(`New Admin created with email ${email}`);
    }
  } catch (err) {
    console.log(err);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
