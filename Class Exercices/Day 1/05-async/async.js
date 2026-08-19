import { readFile } from "node:fs/promises";

async function loadConfig() {
    const text = await readFile(new URL("./demo.txt", import.meta.url), "utf8");
    return { source: "demo.txt", value: text.trim() }
}

console.log("1.");
const config = await loadConfig();
console.log("2. Tulos:", config);
console.log("3.");
