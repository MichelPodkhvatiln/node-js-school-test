import * as http from "http"

const todos = [
    {
        id          : '1',
        title       : 'First todo',
        description :
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus dolor sit amet orci vulputate malesuada. Lorem ipsum dolor sit.'
    },
    {
        id          : '2',
        title       : 'Second todo',
        description :
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus dolor sit amet orci vulputate malesuada. Lorem ipsum dolor sit.'
    },
    {
        id          : '3',
        title       : 'Third todo',
        description :
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum luctus dolor sit amet orci vulputate malesuada. Lorem ipsum dolor sit.'
    }
]

async function getRequestData (req: http.IncomingMessage) {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    return  Buffer.concat(buffers).toString()
}

const server = http.createServer( async (req, res) => {
    if (req.url === '/create-user' && req.method === 'POST') {
        const rawData = await getRequestData(req)
        const data = JSON.parse(rawData)
        console.log(data)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(todos))
    }
    else if (req.url?.match(/\/user\/([\d]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[2]
        const todo = todos.find((todo) => todo.id === id)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(todo))
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
