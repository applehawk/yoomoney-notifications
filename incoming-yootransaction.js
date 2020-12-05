//Here we handle ya-money p2p-incoming transactions
//https://yoomoney.ru/docs/wallet/using-api/notification-p2p-incoming
const db = require('./db.js')
const constants = require('./constants.js')
const RequestPayment = require('./request-payment')

const processIncomeTransaction = (transaction) => {
    db.insertTransaction(transaction, 'incoming-transactions')
}

const transactionWithTransactionId = (transactionId) => {
    //check there is request-payments with paymentId
    let clientAccess = null;
    let database = null;
    let query = { transactionId: transactionId };
    return new Promise((resolve, reject) => {
        db.open().then( (client) => {
            clientAccess = client
            database = client.db(constants.MONGODB_NAME)
            return database.collection('incoming-transactions')
        }).then( (collection) => {
            return collection.findOne(query)
        }).then( (result) => {
            console.log(`Result: ${result}`)
            resolve(result)
            clientAccess.close()
        }).catch((err)=>{
            clientAccess.close()
            console.log(err)
            reject(err)
        })
    })
}

module.exports = {
    transactionWithTransactionId: transactionWithTransactionId,
    processIncomeTransaction: function(body, transactionId) {
        let incoming_transaction = {
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
            zip: body.zip,
            transactionId: transactionId, //custom field
        };
        return processIncomeTransaction(incoming_transaction)
    }
}