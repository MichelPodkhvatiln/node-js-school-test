import { join } from 'path'
import StormDB from 'stormdb'

const engine = new StormDB.localFileEngine(join(__dirname, './db.stormdb'))
const db = new StormDB(engine)

enum DatabaseFields {
    USERS = 'users'
}

db.default({ [DatabaseFields.USERS]: [] })

export {
    db,
    DatabaseFields
}