require ('dotenv').config()

const config={
    env:process.env.ENV_MODE,
    port:process.env.PORT,
    stripe_pk:process.env.STRIPE_PK,
    stripe_sk:process.env.STRIPE_SK,
    db_userName:process.env.DB_USERNAME,
    db_password:process.env.DB_PASSWORD,
    db_host:process.env.DB_HOST,
    db_name:process.env.DB_NAME,
    jwt_secret:process.env.JWT_SECRET,
    
    bucket_name:process.env.BUCKET_NAME,

    email_host:process.env.EMAIL_HOST,
    email_port:process.env.EMAIL_PORT,
    email_secure:process.env.EMAIL_SECURE,
    email_user:process.env.EMAIL_USER,
    email_password:process.env.EMAIL_PASSWORD,

}
module.exports = config