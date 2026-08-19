console.log("hello world");

const playerName = "Ada";

const player = {
    id: "player-1",
    name: playerName,
    position: { x: 0, y: 0, z: 0},
    connected: true
};

let score = 0;

function addScore(targetPlayer, amount) {
    score += amount;
    return { ...targetPlayer, score }
}

const updatedPlayer = addScore(player, 10);
console.log("Alkuperäinen:", player);
console.log("Toinen:", updatedPlayer);

player.address = "Metropolia";

console.log(player.address);

const execute = (operation, value) => operation(value);
const square = (value) => value * value;
console.log("Funktio arvona: ", execute(square, 6));
console.log(player.sdjkg);

const values = [1, 2, 3, 4];
console.log("Tuplatut:", values.map((value) => value * 2));

console.log("5" == 5);
console.log("5" === 5);
