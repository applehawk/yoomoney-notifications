const db = require('./db.js')
const constants = require('./constants.js')
const uuidv1 = require('uuid/v1');

var ID = function () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return Math.random().toString(36).substr(2, 9);
};

class RequestPayment {
    constructor(receiver,
                paymentTarget,
                amount,
                storeName, productName,
                successURL) {
        this.receiver = receiver
        this.paymentTarget = paymentTarget
        this.amount = amount
        this.amount_due = null
        this.transactionId = uuidv1()
        let paymentId = ID()
        this.paymentId = paymentId
        this.storeName = storeName
        this.productName = productName

        successURL.searchParams.append('paymentId', paymentId)
        this.successURL = successURL.href
    }

    storePayment(amount_due) {
        let transaction = {
            receiver: this.receiver,
            paymentTarget: this.paymentTarget,
            amount: this.amount,
            amount_due: amount_due.toFixed(2),
            paymentId: this.paymentId,
            transactionId: this.transactionId,
            storeName: this.storeName,
            productName: this.productName,
            successURL: this.successURL,
        }
        db.insertTransaction(transaction, 'request-payments')
    }
}

module.exports = {
    RequestPayment: RequestPayment,
    //check there is request-payments with paymentId
    requestPaymentWithPaymentId: function requestPaymentWithPaymentId(paymentId) {
        this.clientAccess = null
        this.database = null
        const query = { paymentId: paymentId }
        console.log(`query: ${query}`)
        return new Promise((resolve, reject) => {
            db.open().then( (client) => {
                this.clientAccess = client
                let database = client.db(constants.MONGODB_NAME)
                console.log('request-payments start')
                return database.collection('request-payments')
            }).then( (collection) => {
                return collection.findOne(query)
            }).then( (result) => {
                console.log(`Result: ${result}`)
                resolve(result)
                this.clientAccess.close()
            }).catch((err)=>{
                reject(err)
                this.clientAccess.close()
                console.log(err)
            })
        })
    }
}