const express = require('express')
const cors = require('cors')
const {port,env} = require('./config/envVars')

const app = express()

app.use(express.json())
app.use(cors({
    origin:["*"],
    credentials:true
}))


app.get('/',(req,res)=>{
    return res.json({Messsage:"funciona"})
})

app.listen(port,()=>{
    console.log("MODE:"+env)
    console.log("http//:localhost:"+port)
})