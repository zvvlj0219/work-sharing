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
const dotenv_1 = __importDefault(require("dotenv"));
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const upload_1 = require("../middleware/upload");
dotenv_1.default.config();
const router = express_1.default.Router();
/*
 * ポートフォリオの画像をgridfsに保存
 * @params {object} req - req object
 * @params {object} res - res object
 */
router.post('/save_image', upload_1.upload.single('upload-image-name'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ msg: 'ok', result_image: req.file });
}));
router.post('/save_portfolio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolioData: { image, username, work_url, work_name, description } } = req.body;
        const newPortfolio = yield Portfolio_1.default.create({
            image,
            username,
            review: [],
            work_url,
            work_name,
            description,
            review_avg: 0,
            like: [],
            dislike: []
        });
        return res.status(200).json({ result: newPortfolio });
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}));
exports.default = router;
