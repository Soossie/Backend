import "dotenv/config";

export const config = {
    host: requireValue("HOST"),
    port: Number(process.env.PORT ?? 3000),
    database: {
        host: requireValue("DB_HOST"),
        port: Number(process.env.DB_PORT ?? 5432),
        name: requireValue("DB_NAME"),
        user: requireValue("DB_USER"),
        password: requireValue("DB_PASSWORD")
    },
    jwt: {
        secret: requireValue("JWT_SECRET"),
        expiration: process.env.JWT_EXPIRATION ?? "1h"
    },
    admin: {
        admin_password: requireValue("ADMIN_PASSWORD")
    }
};

function requireValue(name) {
    const value = process.env[name];

    if (!value) throw new Error(`Required argument missing: ${name}`);

    return value;
}
