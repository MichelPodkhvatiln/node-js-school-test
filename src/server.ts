import * as http from 'http'
import { getRequestData } from "./helpers"

const db = {
    users: []
}

const server = http.createServer( async (req, res) => {
    if (req.url === '/create-user' && req.method === 'POST') {
        const rawData = await getRequestData(req)
        const data = JSON.parse(rawData)
        console.log(data)

        // @ts-ignore
        db.users.push(data)

        console.log(db)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ db }))
    }
    else if (req.url?.match(/\/user\/([\d]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[2]

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Hello 2!' }))
    }
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Route not found!' }))
    }
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
})
