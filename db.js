const constants = require('./constants.js')
const MongoClient = require("mongodb").MongoClient
const assert = require('assert')

function insertTransaction(object){
    this.clientAccess = null
    this.database = null
    open()
        .then((client)=>{
            this.clientAccess = client
            this.database = client.db(constants.MONGODB_NAME)
            return this.database.collection('incoming-transactions')
        })
        .then((transactions_collection)=>{
            console.log('Write transaction...')
            return transactions_collection.insertOne(object)
        })
        .then((result)=>{
            console.log('Connection finished')
            this.clientAccess.close();
        })
        .catch((err)=>{
            console.error(err)
        })
}

function open() {
    // Connection URL. This is where your mongodb server is running.
    let url = constants.MONGODB_URI;
    console.log(url)
    return new Promise((resolve, reject) => {
        return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
            .then((client)=>{
                console.log('Successfull connection')
                resolve(client)
            })
            .catch((err)=>{
                console.log(`Failed connection with ${err}`)
                reject(err)
            })
    })
}

function close (db) {
    //Close connection
    if(db){
        db.close();
    }
}

module.exports = {
    insertTransaction: insertTransaction,
    open: open,
    close: close,
}