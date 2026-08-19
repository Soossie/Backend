import net from "node:net";

const socket = net.createConnection({
    host: "127.0.0.1",
    port: 41234
}, () => {
    console.log("Yhdistetty")
    socket.write('{"type":"player.join.requested","playerId":"player-1"}\n');
});

let buffer = "";

socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    while (buffer.includes("\n")) {
        const newLineIndex = buffer.indexOf("\n");
        const frame = buffer.slice(0, newLineIndex);
        buffer = buffer.slice(newLineIndex + 1);

        if (frame.length > 0)
            console.log("Vastaus:", JSON.parse(frame));
    }
});
