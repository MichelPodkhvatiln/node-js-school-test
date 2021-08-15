import http from 'http'
import util, {log} from 'util'
import { join } from 'path'
import multiparty from 'multiparty'

import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'
import { v4 as uuidv4 } from 'uuid'

type CreateUserFields = {
    firstName?: string[],
    lastName?: string[],
    email?: string[],
}

type CreateUserFiles = {
    profilePhoto?: UploadedFileType[],
}

type UploadedFileType = {
    fieldName: string,
    originalFilename: string,
    path: string,
    headers: Record<string, string>,
    size: number
}

const EMPTY_STRING = ''

const server = http.createServer( async (req, res) => {
    if (req.url === '/create-user' && req.method === 'POST') {
        const form = new multiparty.Form({
            // autoFiles: true,
            // uploadDir: join(__dirname, './storage')
        })

        form.parse(req, (
            err,
            fields: CreateUserFields | undefined,
            files: CreateUserFiles | undefined
        ) => {
            const profilePhoto = files?.profilePhoto
            if (!profilePhoto) {
                res.writeHead(403, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Missing required field: profilePhoto!' }))
                return
            }

            const isImageFile = profilePhoto[0].headers['content-type'].match(/image/i)
            if (!isImageFile) {
                res.writeHead(403, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: 'Invalid file type! Allow only image files.' }))
                return
            }

            const profileInfo = {
                firstName: fields?.firstName || [EMPTY_STRING],
                lastName: fields?.lastName || [EMPTY_STRING],
                email: fields?.email || [EMPTY_STRING],
            }

            const validationStatuses: Record<string, boolean> = {
                firstName: !isEmpty(profileInfo.firstName[0]),
                lastName: !isEmpty(profileInfo.lastName[0]),
                email: isEmail(profileInfo.email[0]),
            }

            if(Object.values(validationStatuses).includes(false)){
                const errorFields: string[] = []

                for(const field in validationStatuses){
                    if(validationStatuses[field]) continue

                    errorFields.push(field)
                }

                res.writeHead(403, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ message: `Missing required field(s): ${errorFields}!` }))
                return
            }

            const userId = uuidv4()
            const userProfilePhotoLink = `/storage/${userId}_${profilePhoto[0].originalFilename}`
            const userProfilePhotoPath = join(__dirname, userProfilePhotoLink)

            // gm(profilePhoto[0].path)
            //     .resize(200, 200, '^')
            //     .gravity('Center')
            //     .crop(200, 200)
            //     .write(userProfilePhotoPath, (err) => {
            //         if(err) {
            //             console.log(err)
            //
            //             res.writeHead(500, { 'Content-Type': 'application/json' })
            //             res.end(JSON.stringify({ message: 'Saving image error!' }))
            //             return
            //         }
            //
            //         const userProfileInfo = {
            //             id: userId,
            //             firstName: profileInfo.firstName[0],
            //             lastName: profileInfo.lastName[0],
            //             email: profileInfo.email[0],
            //         }
            //
            //         res.writeHead(200, { 'content-type': 'text/plain' })
            //         res.end(JSON.stringify({ message: `Success! New user ID: ${userId}` }))
            //     })

            res.writeHead(200, { 'content-type': 'text/plain' })
            res.end(JSON.stringify({ message: `Success! New user ID: ${userId}` }))
        })
        return
    }

    if (req.url?.match(/\/user\/([\d]+)/) && req.method === 'GET') {
        const id = req.url.split('/')[2]

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Hello 2!' }))
        return
    }


    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Route not found!' }))
})

const PORT = process.env.PORT || 5005

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`)
})
