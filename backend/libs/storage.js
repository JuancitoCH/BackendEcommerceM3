const {Storage} = require('@google-cloud/storage')
const {Readable} = require('stream')
const { bucket_name } = require("../config/envVars")
const uuid = require("uuid")
const path = require("path")

const storage = new Storage({keyFilename:'Credentials_key.json'})

const uploadFile=(fileName,buffer)=>{
    
    if(!fileName || !buffer){
        return {success:false,message:"A file is necessary"}
    }

    const extFile = path.extname(fileName)
    const newFileName = uuid.v4() + extFile

    const file = storage.bucket(bucket_name).file(newFileName)

    // el buffer lo convertimos en readable stream
    const stream = Readable.from(buffer)

    return new Promise((resolve,reject)=>{
        // con el pipe mandamos el stream
        // lo que esta dentro del parentesis seria el destino
        // y en este caso sobrescribe el archivo del bucket a writeStream
        stream.pipe(file.createWriteStream())
        .on('finish',()=>{
            resolve({success:true,message:"File uploaded succesfully",fileName:newFileName})
        })
        .on('error',(err)=>{
            console.log(err)
            reject({success:false,message:"An Error ocurre xD trying to upload the file"})
        })
    })
}

const downloadFile = async (fileName,res)=>{
    //Referencia al objeto de archivo en google cloud
    const file = storage.bucket(bucket_name).file(fileName)
    const [data] = await file.getMetadata()
    
    // console.log(data.contentType)

    // convertimos el file en readable
    const stream = file.createReadStream()
    .on("error",(error)=>{
        if(error.code===404){
            res.status(error.code).json({error:true,message:"No se encontró el archivo"})
        }
    }) 
    // retornamos en la respuesta el archivo en readable y lo destinamos a la res
    res.header('Content-Type',data.contentType)
    stream.pipe(res)
}

const deleteFile= async(fileName)=>{
    const responseDelete=await storage.bucket(bucket_name).file(fileName).delete();
    // console.log(responseDelete)
}

module.exports = { uploadFile,downloadFile,deleteFile }