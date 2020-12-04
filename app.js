const fs = require('fs')
const https = require('https');
const express = require('express')
const app = express()
const port = 3000

const bodyParser = require("body-parser");
const yamoney_http = require('./yamoney-http-notifications.js')

const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/yamoney', yamoney_http('9c7v1ZlWYLQEmS3jtGyyTksy', function(err, body) {
    if (body.test_notification === 'true' || body.operation_id === 'test-notification') {
        console.log("This is test notification")
    } else {
        console.log("This is real payment")

    }

    console.log(body); // here will be body of the notification

}));

app.listen(port, () => {

  console.log(`Example app listening at http://localhost:${port}`)

});
