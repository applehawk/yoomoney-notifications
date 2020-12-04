const crypto = require('crypto');

module.exports = function(secret, callback) {
    return function(req, res) {
        shasum = crypto.createHash('sha1');

        checkString = req.body.notification_type + '&' +
            req.body.operation_id + '&' +
            req.body.amount + '&' +
            req.body.currency + '&' +
            req.body.datetime + '&' +
            req.body.sender + '&' +
            req.body.codepro + '&' +
            secret + '&' +
            req.body.label;
        shasum.update(checkString);
        var mySha = shasum.digest('hex');
        if (mySha == req.body.sha1_hash) {
            res.sendStatus(200);
            callback(null, req.body);
        } else {
            res.sendStatus(400, 'Checksum failed');
            callback("SHA1 hash check failed");
        }
    }
};
