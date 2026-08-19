import { readFile } from "node:fs/promises";

console.log("1.");
const promise = readFile(new URL("./demo.txt", import.meta.url), "utf8");
console.log("2. Ennen tulosta:", promise)

promise.then((data) => console.log("4. Fulfilled", data))
    .catch((error) => console.log(error));

console.log("3.");
