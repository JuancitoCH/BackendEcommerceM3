require ('dotenv').config()

const config={
    env:process.env.ENV_MODE,
    port:process.env.PORT,

}
module.exports = config