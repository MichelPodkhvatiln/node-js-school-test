import http from 'http'
import { join } from 'path'
import StormDB from 'stormdb'
import { getRequestData } from "./helpers"

const engine = new StormDB.localFileEngine(join(__dirname, './db/db.stormdb'))
const db = new StormDB(engine)

db.default({ users: [] })

const server = http.createServer( async (req, res) => {
    if (req.url === '/create-user' && req.method === 'POST') {
        const rawData = await getRequestData(req)
        const data = JSON.parse(rawData)

        db.get('users').push(data)
        db.save()

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ db: db.get('users').value() }))
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

const PORT = process.env.PORT || 3030

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
})
