const express = require('express')
const app = express()

app.use(express.json())

app.listen(process.env.PORT || 5000, () => {
    console.log("Listening on port 3000")
})

app.get('/cardDetails',(req,res) => {

//    console.log(req.body)
  //  const newUser = {
    //    name: req.body.name,
      //  email: req.body.email,
       // password: req.body.password,
    //}

    res.status(200).send()
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
    res.status(200).send()
})
