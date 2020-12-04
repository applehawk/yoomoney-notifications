require('dotenv').config()

const yooMoneySecure = process.env.YOOMONEY_SECURE
const fs = require('fs')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

const yamoney_http = require('./yamoney-http-notifications')
const payment = require('./payment')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/yamoney', yamoney_http(yooMoneySecure, function(err, body) {
    if (body.test_notification === 'true' || body.operation_id === 'test-notification') {
        console.log("This is test notification")
        payment(body);
    } else {
        console.log("This is real payment")
        payment(body);
    }

    console.log(body); // here will be body of the notification

}));

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`)

});
