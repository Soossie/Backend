import express from "express";
import { config } from "./config.js";
import { authRouter } from "./routes/authRoutes.js";
import { profileRouter } from "./routes/profileRoutes.js";

const HOST = config.host;
const PORT = config.port;

const app = express();

app.use(express.json()); // Default limit: 100kB

app.use("/api/auth", authRouter);

app.use("/api/profiles", profileRouter);

console.log(`Server is starting on port ${PORT}...`);
console.log(`Environment variables:`, process.env);
console.log(`Config:`, config);

app.listen(PORT, HOST, () => {
    console.log(`HTTP-Palvelin: https://${HOST}:${PORT}`);
});