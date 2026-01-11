import "dotenv/config";

console.log("BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
console.log("APP_URL:", process.env.APP_URL);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("BETTER_AUTH_SECRET exists:", !!process.env.BETTER_AUTH_SECRET);
