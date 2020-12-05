const constants = require('./constants.js')
const url = require('url');
const payment = require('./request-payment')

function urlRequestPayment(aRequestPayment) {
    return urlRequestPaymentArgs(aRequestPayment.receiver,
        aRequestPayment.paymentTarget,
        aRequestPayment.amount,
        aRequestPayment.paymentId,
        aRequestPayment.storeName,
        aRequestPayment.productName,
        aRequestPayment.successURL)
}

/*
* return ${shopName}:${productName}:${paymentId}
* */
function parseUUID(label) {
    let regexStr = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/
    let result = label.match(regexStr)
    return result
}

//need fix that
function parsePaymentId(label) {
    console.log(label)
    let result = label.match(/(.*):(.*):(.*)/)
    console.log(result[3])
    return result[3]
}

/*
https://yoomoney.ru/docs/payment-buttons/using-api/forms?lang=en
 */
function urlRequestPaymentArgs(receiver, paymentTarget, amount, paymentId, storeName, productName, successURL) {
    const myUrlWithParams = new URL('/transfer', 'https://money.yandex.ru/');

    myUrlWithParams.searchParams.append('receiver', receiver)
    myUrlWithParams.searchParams.append('sum', amount)
    myUrlWithParams.searchParams.append('selectedPaymentType', 'AC')
    myUrlWithParams.searchParams.append('targets', paymentTarget)

    myUrlWithParams.searchParams.append('successURL', successURL);

    storeProduct = `${storeName}:${productName}`
    paymentLabel = `${storeName}:${productName}:${paymentId}`

    const quickPayBackUrl = new URL('/quickpay/button-widget', 'https://money.yandex.ru/');
    quickPayBackUrl.searchParams.append('targets', paymentTarget)
    quickPayBackUrl.searchParams.append('default-sum', amount)
    quickPayBackUrl.searchParams.append('button-text', '12')
    quickPayBackUrl.searchParams.append('shop-host', 'yoomoney.ru')
    quickPayBackUrl.searchParams.append('any-card-payment-type', 'on')
    quickPayBackUrl.searchParams.append('button-size', 'm')
    quickPayBackUrl.searchParams.append('button-color', 'orange')
    quickPayBackUrl.searchParams.append('successURL', successURL)
    quickPayBackUrl.searchParams.append('quickpay','small')
    quickPayBackUrl.searchParams.append('account', receiver)

    myUrlWithParams.searchParams.append('quickpay-back-url', quickPayBackUrl.href)
    myUrlWithParams.searchParams.append('shop-host', 'money.yandex.ru')
    /*
targets
Up to 150 characters
payment purpose
 */
    //check autoredirect here
    myUrlWithParams.searchParams.append('comment', '')
    /*
    This make 'uneditable receiver and sum'
     */
    myUrlWithParams.searchParams.append('origin', 'button')
    /*
https://yookassa.ru/docs/payment-solution/supplementary/reference/payment-types /
 */
    myUrlWithParams.searchParams.append('destination', paymentTarget)


    myUrlWithParams.searchParams.append('label', paymentLabel)

    /*
Name of the transfer in sender’s history (for transfers from a wallet or linked bank card). Displayed in sender’s wallet.
The simplest way to create it is to combine the names of the store and product. For instance: My Store: white valenki boots
* */
    myUrlWithParams.searchParams.append('form-comment', storeProduct)
    myUrlWithParams.searchParams.append('short-dest', storeProduct)
    /*
shop for a multi purpose form;
small for a button;
donate for a charity form.
 */
    myUrlWithParams.searchParams.append('quickpay-form', 'small')

    return myUrlWithParams
}

/*
https://yoomoney.ru/docs/payment-buttons/using-api/forms?lang=en#calculating-commissions
* */
function commissionMultiplier(paymentType) {
    switch (paymentType) {
        case 'PC': { //YooMoney wallet
            return 0.005
        }
        case 'AC': { //bank card
            return 0.02
        }
        case 'MC': { //direct carrier billing
            return 0 //we don't know commision, it's depend on carrier
        }
    }
}
function commissionSum(sum, paymentType) {
    multiplier = commissionMultiplier(paymentType)
    return sum * (multiplier / (1 + multiplier))
}
function amountDueAfterCommission(sum, paymentType) {
    return sum - commissionSum(sum, paymentType)
}

module.exports = {
    urlRequestPayment: urlRequestPayment,
    amountDueAfterCommission: amountDueAfterCommission,
    parseUUID: parseUUID,
    parsePaymentId: parsePaymentId
}