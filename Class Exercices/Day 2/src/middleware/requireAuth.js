import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function requireAuth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer "))
        return res.status(401).json({ error: "Missing access token" });

    const token = authorization.substring("Bearer ".length);

    try {
        const payload = jwt.verify(token, config.jwt.secret, { algorithms: ["HS256"] });

        if (typeof(payload) === "string" || !payload.sub)
            return res.status(401).json({ error: "Invalid access token" });

        req.userId = payload.sub;
        next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired access token" });
    }
};
