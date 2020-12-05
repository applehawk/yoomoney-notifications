const constants = require('./constants.js')
const url = require('url');

/*
https://yoomoney.ru/docs/payment-buttons/using-api/forms?lang=en
 */
function formRequestYoo(receiver, paymentTarget, sum, paymentId, storeName, productName, successURL) {
    const myUrlWithParams = new URL('/transfer', 'https://money.yandex.ru/');

    myUrlWithParams.searchParams.append('receiver', receiver);
    /*
    shop for a multi purpose form;
    small for a button;
    donate for a charity form.
     */
    myUrlWithParams.searchParams.append('quickpay-form', 'small')
    /*
    targets
    Up to 150 characters
    payment purpose
     */
    myUrlWithParams.searchParams.append('targets', paymentTarget)
    myUrlWithParams.searchParams.append('sum', sum)
    /*
    https://yookassa.ru/docs/payment-solution/supplementary/reference/payment-types /
     */
    myUrlWithParams.searchParams.append('selectedPaymentType', 'AC')
    /*
    This make 'uneditable receiver and sum'
     */
    myUrlWithParams.searchParams.append('origin', 'button')
    /*
    Name of the transfer in sender’s history (for transfers from a wallet or linked bank card). Displayed in sender’s wallet.
    The simplest way to create it is to combine the names of the store and product. For instance: My Store: white valenki boots
    * */
    storeProduct = `${storeName}:${productName}`
    myUrlWithParams.searchParams.append('formcomment', storeProduct)
    myUrlWithParams.searchParams.append('short-dest', storeProduct)

    myUrlWithParams.searchParams.append('successURL', successURL);

    paymentLabel = `${storeName}:${paymentId}`
    myUrlWithParams.searchParams.append('label', paymentLabel)
/*
    myUrlWithParams.searchParams.append('quickpay-back-url', quickPayBackurl)
    myUrlWithParams.searchParams.append('shop-host', shophost)
 */

    /*
    need only with forms
    * */
    //myUrlWithParams.searchParams.append('comment', comment)
    /* https://yookassa.ru/docs/payment-solution/supplementary/reference/payment-types /
    myUrlWithParams.searchParams.append('destination', destination)
*/

    return myUrlWithParams
}

module.exports = {
    formRequestYoo: formRequestYoo,
}