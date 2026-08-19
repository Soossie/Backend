import { readFile } from "node:fs";

console.log("1. Alku");

readFile(new URL("./demo.txt", import.meta.url), "utf8", (error, data) => {
    if (error) {
        console.error("Tiedoston lukeminen epäonnistui");
    }

    console.log("3. Takaisinkutsu");
});

console.log("2. Ohjelman synkroninen loppu");
