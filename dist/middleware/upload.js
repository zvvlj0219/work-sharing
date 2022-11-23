"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const multer_gridfs_storage_1 = require("multer-gridfs-storage");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.MONGODB_URI) {
    throw new Error('url not found');
}
// multerストレージ作成
const storage = new multer_gridfs_storage_1.GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            try {
                const basename = file.originalname.split('.')[0];
                // getでfilenameをparamsに渡すため
                // filenameに,/,+,= が入らないようにする
                if (typeof process.env.HASH_KEY === 'undefined')
                    throw new Error('hash_key not found');
                const encryptedBasename = crypto_js_1.default.AES.encrypt(basename, process.env.HASH_KEY)
                    .toString()
                    .replace(/\+/g, 'p1L2u3S')
                    .replace(/\//g, 's1L2a3S4h')
                    .replace(/=/g, 'e1Q2u3A4l');
                const encryptedFilename = encryptedBasename + path_1.default.extname(file.originalname);
                const fileInfo = {
                    filename: encryptedFilename,
                    bucketName: 'uploads-images'
                };
                resolve(fileInfo);
            }
            catch (error) {
                reject(error);
            }
        });
    }
});
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    //check the file extention
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    // more importantly, check the mimetype
    const mimetype = filetypes.test(file.mimetype);
    // if both are good then continue
    if (mimetype && extname)
        return cb(null, true);
    // otherwise, return error message
    cb(Error('missing filetype'));
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});
