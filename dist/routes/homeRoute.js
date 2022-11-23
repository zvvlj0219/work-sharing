"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const gridfs_stream_1 = __importDefault(require("gridfs-stream"));
const db_1 = __importDefault(require("../config/db"));
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const router = express_1.default.Router();
let gridfsBucket;
let gfs;
// initialize GridFsBucket
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    gridfsBucket = new mongoose_1.default.mongo.GridFSBucket(connection.db, {
        bucketName: 'uploads-images'
    });
    gfs = (0, gridfs_stream_1.default)(connection.db, mongoose_1.default.mongo);
    gfs.collection('uploads-images');
});
/*
 * 作品一覧の取得
 * @params {object} req - req object
 * @params {object} res - res object
 */
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Portfolio_1.default.find().lean();
    if (!result)
        return res.status(400).json({ msg: 'not found documents' });
    const convertedDocuments = result.map((doc) => {
        return db_1.default.convertDocToObj(doc);
    });
    return res.status(200).json({ portfolios: convertedDocuments });
}));
/*
 * 作品画像の取得
 * @params {object} req - req object
 * @params {object} res - res object
 */
router.get('/fetch/:filename', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filename } = req.params;
    if (!filename)
        return res.status(400).json({ msg: 'not found filename' });
    const file = yield gfs.files.findOne({ filename });
    if (!file) {
        return res.status(400).json({ msg: 'not exsit file' });
    }
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
}));
exports.default = router;
