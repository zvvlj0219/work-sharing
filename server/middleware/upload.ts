import CryptoJS from 'crypto-js';
import multer from 'multer'
import path from 'path';
import {GridFsStorage} from 'multer-gridfs-storage'

if(!process.env.MONGODB_URI){
    throw new Error('url not found')
}

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (
        req,
        file: {
            fieldname: string
            originalname: string
            encoding: string
            mimetype: string
        }
    ) => {
        return new Promise((resolve, reject) => {
            try {
                const basename = file.originalname.split('.')[0]

                // getでfilenameをparamsに渡すため
                // filenameに,/,+,= が入らないようにする
                if(typeof process.env.HASH_KEY === 'undefined') throw new Error('hash_key not found')
                const encryptedBasename =
                    CryptoJS.AES.encrypt(basename, process.env.HASH_KEY)
                    .toString()
                    .replace(/\+/g,'p1L2u3S')
                    .replace(/\//g,'s1L2a3S4h')
                    .replace(/=/g,'e1Q2u3A4l')
                
                const encryptedFilename =
                    encryptedBasename
                    + path.extname(file.originalname)
    
                const fileInfo = {
                    filename: encryptedFilename,
                    bucketName: 'uploads-images'
                }
    
                resolve(fileInfo)
            } catch (error) {
                reject(error)
            }
        });
    }
});

const checkFileType = (
    file: Express.Multer.File,
    cb:multer.FileFilterCallback
) => {
    // https://youtu.be/9Qzmri1WaaE?t=1515
    // define a regex that includes the file types we accept
    const filetypes = /jpeg|jpg|png|gif/;
    //check the file extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // more importantly, check the mimetype
    const mimetype = filetypes.test(file.mimetype);
    // if both are good then continue
    if (mimetype && extname) return cb(null, true);
    // otherwise, return error message
    cb(Error('missing filetype'))
}

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})