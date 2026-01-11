import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_FROM!,
    pass: process.env.APP_PASSWORD!,
  },
});

export const auth = betterAuth({
  baseURL: `${process.env.BETTER_AUTH_URL}/api/auth`,
  secret: process.env.BETTER_AUTH_SECRET || "a_very_long_fallback_secret_for_development_purposes_only_32_characters",

  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: true,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log({ user, url, token });
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}&email=${user.email}`;
        const info = await transporter.sendMail({
          from: '"Prisma Blog" <prisma-blog@ph.com>',
          to: user.email!,
          subject: "Please verify your email ✔",
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 0">
          <table
            width="100%"
            max-width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background-color: #ffffff;
              border-radius: 8px;
              padding: 32px;
            "
          >
            <!-- Logo / Title -->
            <tr>
              <td align="center" style="padding-bottom: 20px">
                <h2 style="margin: 0; color: #111827">
                  Prisma Blog
                </h2>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td style="color: #374151; font-size: 16px; line-height: 1.6">
                <p>Hi <strong>${user.name}</strong>,</p>

                <p>
                  Thanks for signing up! Please confirm your email address by
                  clicking the button below.
                </p>
              </td>
            </tr>

            <!-- Button -->
            <tr>
              <td align="center" style="padding: 24px 0">
                <a
                  href="${verificationUrl}"
                  style="
                    background-color: #4f46e5;
                    color: #ffffff;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 16px;
                    display: inline-block;
                  "
                >
                  Verify Email
                </a>
              </td>
            </tr>

            <!-- Fallback Link -->
            <tr>
              <td style="color: #6b7280; font-size: 14px">
                <p>
                  If the button doesn’t work, copy and paste this link into your
                  browser:
                </p>
                <p style="word-break: break-all">
                  <a
                    href="${verificationUrl}"
                    style="color: #4f46e5"
                  >
                    ${url}
                  </a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding-top: 32px;
                  font-size: 12px;
                  color: #9ca3af;
                  text-align: center;
                "
              >
                <p>
                  If you didn’t create an account, you can safely ignore this
                  email.
                </p>
                <p>© 2026 Prisma Blog. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`, // HTML version of the message
        });

        console.log("Message sent:", info.messageId);
      } catch (error) {
        console.error("Error sending verification email:", error);
        throw error;
      }
    },
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    useSecureCookies: false,
  },
});
