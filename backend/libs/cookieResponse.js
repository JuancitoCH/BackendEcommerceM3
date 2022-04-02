require('dotenv').config()
const cookieResponse=(res,{token,message,success,user})=>{
    let date = new Date(new Date().setDate(new Date().getDate()+7))
    
    if(process.env.ENV_MODE === "dev"){
        return res.cookie('token',token,{
        httpOnly:true,
        // secure:true,
        // sameSite:'none',
            expires:date
        }).json({success,message,data:user})
    }

    return res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        expires:date
    }).json({success,message,data:user})
}
module.exports = cookieResponse