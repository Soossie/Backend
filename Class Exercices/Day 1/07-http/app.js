import express from "express";
import { echoMessage } from "./echo-message.js";

const HOST = "127.0.0.1";
const PORT = 3000;

// Luodaan uusi Express-applikaatio
const app = express();

// Käytetään Expressin omaa JSON-middlewarea
// Varmistaa Content-Type: application/json
// Varmistaa että req.body on JSON
app.use(express.json({ limit: "10kb" }))

// GET /health
app.get("/health", (request, response) => {
    response.status(200).json({
        data: {
            status: "ok",
            uptimeSeconds: Math.round(process.uptime())
        }
    });
});

// POST /api/echo
app.post("/api/echo", (request, response) => {
    const result = echoMessage(request.body);

    if (!result.ok) {
        response.status(400).json({ error: result.error });
        return;
    }

    response.status(200).json({ data: result.value });
});

// Laitetaan palvelin kuuntelemaan
const server = app.listen(PORT, HOST, () => {
        console.log(`Express-palvelin: http://${HOST}:${PORT}`);
    }
);
