import http from "http";

export async function getRequestData (req: http.IncomingMessage): Promise<string> {
    const buffers = [];

    for await (const chunk of req) {
        buffers.push(chunk);
    }

    return  Buffer.concat(buffers).toString()
}