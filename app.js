require('dotenv').config()

const yooMoneySecure = process.env.YOOMONEY_SECURE
const fs = require('fs')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const yamoney_http = require('./yamoney-http-notifications')
const incomingTransactions = require('./incoming-yootransaction')
const yooPayment = require('./request-yoopayment')
var RequestPayment = require('./request-payment')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/yamoney', yamoney_http(yooMoneySecure, function(err, body) {
    console.log(body)
    if (body.test_notification === 'true' || body.operation_id === 'test-notification') {
        console.log("This is test notification")
    } else {
        console.log("This is real payment")
        let paymentId = yooPayment.parsePaymentId(body.label)
        RequestPayment.requestPaymentWithPaymentId(paymentId).then( (requestPayment) => {
            let transactionId = requestPayment.transactionId
            incomingTransactions.processIncomeTransaction(body, transactionId);
        })
    }
    console.log(body); // here will be body of the notification

}));

app.get('/payment/success', (req,res) => {
    // Retrieve the tag from our URL path
    var paymentIdStr = req.query.paymentId
    //check on regex
    var matchResult = paymentIdStr.match(/[a-zA-Z0-9]{6,}/)
    if (matchResult === null || matchResult === undefined) {
        res.status(200).send('This is failed paymentId')
        res.close()
        return
    }
    let paymentId = matchResult[0]
    console.log(`Found PaymentID: ${paymentId}`)

    var requestPayment = null
    var transactionPayment = null
    RequestPayment.requestPaymentWithPaymentId(paymentId).then( (requestPaymentWithId) => {
        console.log(requestPayment)
        requestPayment = requestPaymentWithId
        let requestPaymentStr = requestPayment.toString()
        console.log(`Found request-payment: ${requestPaymentStr}`)
        let transactionId = requestPaymentWithId.transactionId
        return incomingTransactions.transactionWithTransactionId(transactionId)
    }).then( (transactionPaymentWithId) => {
        transactionPayment = transactionPaymentWithId
        console.log(`transactionPayment: ${transactionPayment}`)
        return new Promise((resolve, reject) => {
            if (transactionPayment.transactionId === requestPayment.transactionId) {
                resolve(transactionPayment)
            } else {
                reject('This is failed transaction');
            }
        });
    }).then( (transactionPayment) => {
        let transactionPaymentStr = transactionPayment.toString()
        res.status(200).send(`Found transaction-payment: ${transactionPaymentStr}`)
    }).catch( (error) => {
        res.status(200).send('This is failed paymentId')
        console.log(error)
    })
})

app.get('/request', (req, res) => {
    var payment = new RequestPayment.RequestPayment('4100116146429872',
        'Оплата за подписку HeightEstimator',
        '2',
        'demo-height',
        'subscription.one.month',
        new URL('/payment/success', `https://${req.hostname}/`));

    let amount_due = yooPayment.amountDueAfterCommission(payment.amount, 'AC')
    payment.storePayment(amount_due)
    let url = yooPayment.urlRequestPayment(payment)

    console.log(url.href)
    res.status(200).send(`
        <a href="${url.href}">${url.href}</a>
    `)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
