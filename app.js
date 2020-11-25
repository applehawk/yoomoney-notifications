const express = require('express')
const app = express()
const port = 8080
const fs = require('fs')
const yamoney_http = require('./yamoney-http-notifications.js')
const https = require('https');

app.post('/yamoney', yamoney_http('SS91gZAFCStcbbQNmyjMWY3u', function(err, body) {
    console.log(body); // here will be body of the notification
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
