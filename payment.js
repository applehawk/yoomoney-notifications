const mongouser = process.env.MONGO_USER
const mongopass = process.env.MONGO_PASS
const mongourl = process.env.MONGO_URL
//MONGO_URL="mongodb+srv://payment-script:XBnz0KVcr6kMx15Z@mlpayment-demo.mfbib.mongodb.net/?retryWrites=true&w=majority"

const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

const url = "mongodb+srv://"+mongouser+":"+mongopass+"@"+mongourl+"/?retryWrites=true&w=majority"
//Here we handle ya-money p2p-incoming transactions
//https://yoomoney.ru/docs/wallet/using-api/notification-p2p-incoming
const mongoClient = new MongoClient(url,
    { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = 'usersdb'

const processTransaction = (transaction) => {
    console.log(url)
    mongoClient.connect((err, client )=>{
        assert.equal(null, err);
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection("payments");
        collection.insertOne(transaction, function(err, result){
            if(err){
                return console.log(err);
            }
            console.log(result.ops);
            client.close();
        });
    });
}

module.exports = function(body) {
    let transaction = {
        notification_type: body.notification_type, //notification_type: 'p2p-incoming',
        bill_id: body.bill_id, //bill_id: '',
        amount: body.amount, //amount: '404.27',
        datetime: body.datetime, //datetime: '2020-12-04T17:42:28Z',
        codepro: body.codepro, //codepro: 'false',
        sender: body.sender, //sender: '41001000040',
        operation_label: body.operation_label, //operation_label: '',
        operation_id: body.operation_id, //operation_id: 'test-notification',
        currency: body.currency, //currency: '643',
        label: body.label, //label: ''
        unaccepted: body.unaccepted,
        //HTTPS only
        lastname: body.lastname,
        firstname: body.firstname,
        fathersname: body.fathersname,
        email: body.email,
        phone: body.phone,
        city: body.city,
        street: body.street,
        building: body.building,
        suite: body.suite,
        flat: body.flat,
        zip: body.zip
    };
    return processTransaction(transaction)
}