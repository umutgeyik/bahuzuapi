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

var dErrorCodes = new Map();
dErrorCodes.set('0','3-D Secure imzası geçersiz veya doğrulama')
dErrorCodes.set('1','Odeme basariyla gerceklestirildi.')
dErrorCodes.set('2','Kart sahibi veya bankası sisteme kayıtlı değil.')
dErrorCodes.set('3','Kartın bankası sisteme kayıtlı değil.')
dErrorCodes.set('4','Doğrulama denemesi, kart sahibi sisteme daha sonra kayıt olmayı seçmiş.')
dErrorCodes.set('5','Doğrulama yapılamıyor.')
dErrorCodes.set('6','3-D Secure hatası.')
dErrorCodes.set('7','Sistem hatası.')
dErrorCodes.set('8','Bilinmeyen kart no.')
dErrorCodes.set('failure','Basarisiz')
dErrorCodes.set('success','Basarili')


app.listen(process.env.PORT || 5000, () => {
    console.log("Listening...")
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
        doctorUid: req.body.doctorUid,
        userUid: req.body.userUid
    }
    console.log('DOCTOR UID ::: ')
    console.log(newRequest.doctorUid)
    var request = {
        price: newRequest.price,
        paidPrice: newRequest.price,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        callbackUrl: 'https://bahuzudenemeapp.herokuapp.com/callback',
        paymentCard: {
            cardHolderName: newRequest.cardHolderName,
            cardNumber: newRequest.cardNumber,
            expireMonth: newRequest.expirationMonth,
            expireYear: newRequest.expirationYear,
            cvc: newRequest.cvc,
            registerCard: '0'
        },
        buyer: {
            id: newRequest.userUid,
            name: newRequest.userUid,
            surname: 'default',
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
                id: newRequest.doctorUid,
                name: newRequest.doctorUid,
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: newRequest.price
            },
            
        ]
    };
    iyzipay.threedsInitialize.create(request, function (err, result) {
        console.log(result);
        res.status(200).send(result)    
    });
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


app.post('/callback',(req,res) =>{
    console.log(req.body)
    iyzipay.threedsPayment.create({
        conversationId: req.body.conversationId,
        locale: Iyzipay.LOCALE.TR,
        paymentId: req.body.paymentId,
        conversationData: req.body.conversationData
    }, function (err, result) {
        console.log(err, result);
        var userResponse = dErrorCodes.get(req.body.mdStatus)
        var userSuccess = dErrorCodes.get(result.status)
        var denemeBla = '<!DOCTYPE html>\n<html>\n<head>\n<meta name="viewport" content="width=device-width, initial-scale=1">\n</head>\n<body>\n<h1>' + userSuccess + '</h1>\n<p>' + userResponse + '</p>\n</body>\n</html>'
       
        console.log(req.body.mdStatus)
        
        res.send(denemeBla)
     
    });
})










 
