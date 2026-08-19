import net from "node:net";

const HOST = "127.0.0.1"
const PORT = 41234;

const server = net.createServer((socket) => {
    const remote = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Asiakas yhdisti: ${remote}`);

    let buffer = "";

    socket.on("data", (chunk) => {
        console.log("Raaka TCP:", JSON.stringify(chunk.toString("utf8")));
        buffer += chunk.toString("utf8");

        while (buffer.includes("\n")) {
            const newLineIndex = buffer.indexOf("\n");
            const frame = buffer.slice(0, newLineIndex);
            buffer = buffer.slice(newLineIndex + 1);

            if (frame.length === 0) continue;

            try {
                const message = JSON.parse(frame);
                console.log("Viesti:", message);
                socket.write(JSON.stringify({
                    type: "server.acknowledged",
                    receivedType: message.Type
                }));
            }
            catch (error) {
                socket.write(JSON.stringify({
                    type: "server.error",
                    message: "Virheellinen JSON"
                }));
            }
        }
    });
});

server.listen(PORT, HOST, () => {
    console.log("SERVERI KUUNTELEE");
});
