require('dotenv').config()
const cookieResponse=(res,dataToResponse)=>{
    let date = new Date(new Date().setDate(new Date().getDate()+7))
    const {token} = dataToResponse
    delete dataToResponse.token
    if(process.env.ENV_MODE === "dev"){
        return res.cookie('token',token,{
        httpOnly:true,
        // secure:true,
        // sameSite:'none',
            expires:date
        }).json(dataToResponse)
    }

    return res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none',
        expires:date
    }).json(dataToResponse)
}
module.exports = cookieResponse