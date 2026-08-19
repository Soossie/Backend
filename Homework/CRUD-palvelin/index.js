import express from 'express';

const HOST = 'localhost'
const PORT = 3000

const app = express();
app.use(express.json());

const player = {
    name: 'Ruby',
    age: 20,
    health: 100,
    id: 1
}


const playerList = [player]
let counter = 1

app.post("/api/player", (req, res) => {
    const { name, age, health } = req.body
    counter++
    playerList.push({ name, age, health, id: counter })
    res.status(201).send(`Player (${name}, ${age}, ${health}) added successfully`)
})

app.get("/api/players", (req, res) => {

    res.status(200).json({players: playerList})
})

app.get("/api/player/:id", (req, res) => {
    const { id } = req.params
    const player = playerList.find(player => player.id === parseInt(id))
    if (player)
        res.status(200).json({player})
    else
        res.status(404).send(`Player not found at id ${id}`)
})

app.put("/api/player/:id", (req, res) => {
    const { id } = req.params
    const playerToReplace = playerList.find(player => player.id === parseInt(id))
    if (!playerToReplace)
        return res.status(404).json({error: `Player not found at id ${id}`})

    const newPlayer = {name: 'Replaced', age: 0, health: 0, id: playerToReplace.id}
    playerList.splice(playerList.indexOf(playerToReplace), 1, newPlayer)
    res.status(201).send(`${playerToReplace.name} replaced with ${newPlayer.name}`)
})

app.patch("/api/player/:id", (req, res) => {
    const { id } = req.params
    const { name, age, health } = req.body
    const playerToUpdate = playerList.find(player => player.id === parseInt(id))
    let oldPlayerValues = {}
    if (playerToUpdate) {
        oldPlayerValues = {...playerToUpdate}
        playerToUpdate.name = name
        playerToUpdate.age = age
        playerToUpdate.health = health

        res.status(200).send(`Player at id ${id} changed: 
        name: ${oldPlayerValues.name} -> ${playerToUpdate.name}, 
        age: ${oldPlayerValues.age} -> ${playerToUpdate.age},
        health: ${oldPlayerValues.health} -> ${playerToUpdate.health}`)
    }
    else {
        res.status(404).send(`Player not found at id ${id}`)
    }
})

app.delete("/api/player/:id", (req, res) => {
    const { id } = req.params
    const playerToDelete = playerList.find(player => player.id === parseInt(id))
    const deletedPlayer = {...playerToDelete}
    if (playerList.length !== 0) {
        playerList.splice(playerList.indexOf(playerToDelete), 1)
        res.status(200).send(`${deletedPlayer.name} deleted successfully.`)
    }
    else {
        res.status(404).send('Player list is empty,')
    }
})

app.listen(PORT, HOST, () => {
    console.log("Server is listening")
})