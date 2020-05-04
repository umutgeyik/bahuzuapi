const express = require('express')
const app = express()
const bodyParser = require('body-parser')
session = require('express-session');
'use-strict';

app.use(express.json())
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended:true }))
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

var Iyzipay = require('iyzipay');
var fs = require('fs');

var iyzipay = new Iyzipay({
    apiKey: "sandbox-xaZ6xivE74YH9Jm9FhQYMboXuMiH7jmT",
    secretKey: "sandbox-CXja3zg1nG3dctkNSXNTV0rfxjjulmHy",
    uri: 'https://sandbox-api.iyzipay.com'
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Listening on port 3000")
})

app.post('/cardDetails',(req,res) => {

console.log(req.body)
   const newRequest = {
        cardHolderName: req.body.cardHolderName,
        cardNumber: req.body.cardNumber,
        cvc: req.body.cvc,
        expirationMonth: req.body.expirationMonth,
        expirationYear: req.body.expirationYear,
        price: req.body.price,
    }

    var request = {
        price: newRequest.price,
        paidPrice: newRequest.price,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        callbackUrl: 'http://localhost:5000/threedresponse',
        paymentCard: {
            cardHolderName: newRequest.cardHolderName,
            cardNumber: newRequest.cardNumber,
            expireMonth: newRequest.expirationMonth,
            expireYear: newRequest.expirationYear,
            cvc: newRequest.cvc,
            registerCard: '0'
        },
        buyer: {
            id: 'BY789',
            name: 'Umut',
            surname: 'Gyk',
            email: 'email@email.com',
            identityNumber: '74300864791',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: newRequest.price
            },
            
        ]
    };
    iyzipay.threedsInitialize.create(request, function (err, result) {
        console.log('IYZICO RESPONSE :: ')
        console.log(result);


        let data = result.threeDSHtmlContent;
        let buff = new Buffer(data, 'base64');
        let text = buff.toString('ascii');
        res.status(200).send(text)    
    });

    
   

    console.log(req.body.price)
    
    const answer = {
        name: "Geldi"
    }


})

app.get('/threedresponse',function(req,res) {
    //console.log(req.session.threedresponse.threeDSHtmlContent)
    console.log('3D RESPONSE ICINE GIRDIK')

    let data = req.session.threedresponse.threeDSHtmlContent;
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');

    console.log('"' + data + '" converted from Base64 to ASCII is "' + text + '"');
    //const html = fs.readFileSync( __dirname + '/response/3dresponse.html' );
    //res.json({html: html.toString(), data: req.session.threedresponse.threeDSHtmlContent});


    res.sendFile('response/3dresponse.html', {root: __dirname})
    //res.send(`Full name is:${req.session.threedresponse.threeDSHtmlContent} ${'SELAM'}.`);
})

app.post('/render',(req,res) =>{

})

app.post('/callback',(req,res) =>{
    console.log(req.body)
    iyzipay.threedsPayment.create({
        conversationId: req.body.conversationId,
        locale: Iyzipay.LOCALE.TR,
        paymentId: req.body.paymentId,
        conversationData: req.body.conversationData
    }, function (err, result) {
        console.log(err, result);
        res.send(result.status)
    });
})

app.get('/',(req,res) =>{
    
    var request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: '1',
        paidPrice: '1.2',
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'http://localhost:5000/callback',
        paymentCard: {
            cardHolderName: 'John Doe',
            cardNumber: '5528790000000008',
            expireMonth: '12',
            expireYear: '2030',
            cvc: '123',
            registerCard: '0'
        },
        buyer: {
            id: 'BY789',
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: '0.3'
            },
            {
                id: 'BI102',
                name: 'Game code',
                category1: 'Game',
                category2: 'Online Game Items',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.5'
            },
            {
                id: 'BI103',
                name: 'Usb',
                category1: 'Electronics',
                category2: 'Usb / Cable',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: '0.2'
            }
        ]
    };
    
    iyzipay.threedsInitialize.create(request, function (err, result) {
        console.log(err, result);
        let data = result.threeDSHtmlContent;
        let buff = new Buffer(data, 'base64');
        let text = buff.toString('ascii');
        res.status(200).send(text)
    });

})

app.get('/posts',(req,res) =>{

    const post = {
        text:"Merhaba Deneniyorsunuz"
    }
    console.log('Dolu olana girdik')
    res.status(200).send(post)
})






 
