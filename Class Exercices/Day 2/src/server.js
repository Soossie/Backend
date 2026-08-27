import express from "express"
import cookieparser from "cookie-parser"
import https from "https"
import { config } from "./config.js"
import { authRouter } from "./routes/authRoutes.js"
import { profileRouter } from "./routes/profileRoutes.js"
import fs from "node:fs"

const HOST = config.host
const PORT = config.port

const app = express()

const options = {
    key: fs.readFileSync(config.ssl.keyPath),
    cert: fs.readFileSync(config.ssl.certPath)
}

app.use(express.json()) // Default limit: 100kB
app.use(cookieparser()) // Parse the refresh token from browser cookies

app.use("/api/auth", authRouter)
app.use("/api/profiles", profileRouter)

console.log(`Server is starting on port ${PORT}...`)

const server = https.createServer(options, app)

server.listen(PORT, HOST, () => {
    console.log(`HTTPS-Palvelin: https://${HOST}:${PORT}`)
})