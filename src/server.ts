import dotenv from "dotenv";

dotenv.config();

console.log("PORT", process.env.PORT);
console.log("MONGO_URL", process.env.MONGO_URL);
