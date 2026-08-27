import "dotenv/config";

export const config = {
    host: requireValue("HOST"),
    port: Number(process.env.PORT ?? 3000),
    ssl: {
        keyPath: process.env.SSL_KEY_PATH,
        certPath: process.env.SSL_CERT_PATH
    },
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
    refreshToken: {
        secret: requireValue("REFRESH_TOKEN_SECRET"),
        expiration: process.env.REFRESH_TOKEN_EXPIRATION ?? "30d"
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
