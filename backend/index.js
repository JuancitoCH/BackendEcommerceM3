const express = require('express')
const cors = require('cors')
const {port,env} = require('./config/envVars')
const payments = require('./routes/payments')
const {connection} = require('./config/db')
const userRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const cookies = require('cookie-parser')
const storageRoutes = require('./routes/storage')
const productsRoutes = require('./routes/products')
const cartRoutes = require('./routes/cart')


const app = express()


// connection to DB
connection()

app.use(cookies())
app.use("/api/payments/webhook",express.raw({type: 'application/json'}))
app.use(express.json())
app.use(cors({
    origin:['http://localhost:3000',"http://127.0.0.1:5500","https://efruits-47d7f.web.app","https://efruits-47d7f.firebaseapp.com"],
    credentials:true
}))

payments(app)
userRoutes(app)
authRoutes(app)
storageRoutes(app)
productsRoutes(app)
cartRoutes(app)

app.get('/',(req,res)=>{
    return res.json({Messsage:"funciona"})
})

app.listen(port,()=>{
    console.log("MODE:"+env)
    console.log("http//:localhost:"+port)
})