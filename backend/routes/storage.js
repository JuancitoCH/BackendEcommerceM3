const express = require('express')
const { uploadFile, downloadFile } = require('../libs/storage')
const {isAdmin} = require('../middlewares/auth')
const upload = require('../middlewares/multerConfig')

const storageRoutes =(app)=>{
    const router = express.Router()
    app.use('/files/storage',router)

    router.post('/upload',isAdmin,upload.single('pic'),async (req,res)=>{
        // req.file
        // form data no en json
        const response = await uploadFile(req.file.originalname,req.file.buffer)
        return res.json(response)
    })

    router.get('/download/:fileName',async(req,res)=>{
        await downloadFile(req.params.fileName,res)
    })
    
}
module.exports = storageRoutes