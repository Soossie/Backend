export function echoMessage(input) {
    const message = input?.message;

    if (typeof message !== "string") {
        return {
            ok: false,
            error: {
                code: "INVALID_MESSAGE_TYPE",
                message: "Viestin pitää olla merkkijono."
            }
        };
    }

    const normalizedMessage = message.trim();

    if (normalizedMessage.length < 1 || normalizedMessage.length > 100) {
        return {
            ok: false,
            error: {
                code: "INVALID_MESSAGE_LENGTH",
                message: "Viestin pituuden pitää olla 1–100 merkkiä."
            }
        };
    }

    return {
        ok: true,
        value: {
            message: normalizedMessage,
            receivedAt: new Date().toISOString()
        }
    };
}
