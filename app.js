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
        //res.status(200).send(result)
        //req.session.threedresponse = result
        //res.redirect('/threedresponse')
        res.status(200).send(result)    
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

app.get('/',(req,res) =>{
    res.sendFile('response/3dresponse.html', {root: __dirname})
})

app.get('/posts',(req,res) =>{

    const post = {
        text:"Merhaba Deneniyorsunuz"
    }
    console.log('Dolu olana girdik')
    res.status(200).send(post)
})






 
