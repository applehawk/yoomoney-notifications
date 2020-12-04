require('dotenv').config()

const mongouser = process.env.MONGO_USER
const mongopass = process.env.MONGO_PASS
const mongourl = process.env.MONGO_URL

module.exports = {
    MONGODB_URI: `mongodb+srv://${mongouser}:${mongopass}@${mongourl}/?retryWrites=true&w=majority`,
    MONGODB_NAME: `usersdb`
}