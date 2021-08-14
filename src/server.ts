import * as http from "http"

const server = http.createServer()

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
})
