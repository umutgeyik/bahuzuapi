const express = require('express')
const app = express()

app.use(express.json())

var Iyzipay = require('iyzipay');

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
        expirationYear: req.body.expirationMonth,
        price: req.body.price,
    }

    var request = {
        price: newRequest.price,
        paidPrice: newRequest.price,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
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
    iyzipay.payment.create(request, function (err, result) {
        console.log(result);
    });

    console.log(req.body.price)
    
    const answer = {
        name: "Geldi"
    }

    res.status(200).send(answer)
})

app.get('/',(req,res) =>{
    console.log('BOS OLANA GIRDIK')
    res.send('BOSBOS')
})

app.get('/posts',(req,res) =>{

    const post = {
        text:"Merhaba Deneniyorsunuz"
    }
    console.log('Dolu olana girdik')
    res.status(200).send(post)
})
