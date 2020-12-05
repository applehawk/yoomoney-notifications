require('dotenv').config()

const yooMoneySecure = process.env.YOOMONEY_SECURE
const fs = require('fs')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const yamoney_http = require('./yamoney-http-notifications')
const processIncomeTransaction = require('./incoming-transaction')
const requestYooPayment = require('./request-yoopayment')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/yamoney', yamoney_http(yooMoneySecure, function(err, body) {
    if (body.test_notification === 'true' || body.operation_id === 'test-notification') {
        console.log("This is test notification")
        processIncomeTransaction(body);
    } else {
        console.log("This is real payment")
        processIncomeTransaction(body);
    }

    console.log(body); // here will be body of the notification

}));

app.get('')

app.get('/request', (req, res) => {
    url = requestYooPayment.formRequestYoo('4100116146429872',
        'Оплата за подписку HeightEstimator',
        '249',
        '123561123',
        'demo-height',
        'subscription.one.month',
        '/success')

    /*('4100116146429872', 2,
        'money.yandex.ru',
        '',
        'Оплата за подписку на HeightEstimator', '', //target important!
        'Оплата за подписку на HeightEstimator 123',
        'Оплата за подписку на HeightEstimator'
        )*/
    console.log(url.href)
})

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`)

});
