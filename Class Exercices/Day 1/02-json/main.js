const command = {
    type: "player.move.requested",
    requestId: "request-123",
    payload: {
        playerId: "player-1",
        dicrection: { x: 1, y: 0 }
    }
};

console.log("JS olio:", command);
const json = JSON.stringify(command, null, 2);
console.log("JSON-teksti:", json);
console.log("Object tyyppi:", typeof(command));
console.log("Tyyppi:", typeof(json));
const parsedCommand = JSON.parse(json);
console.log("Parsed:", parsedCommand);
console.log("ParsedType:", typeof parsedCommand);

try {
    JSON.parse("{ invalid json }");
}
catch (error) {
    console.log(error);
}
finally {
    
}
