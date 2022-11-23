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
const db_1 = __importDefault(require("../config/db"));
const Portfolio_1 = __importDefault(require("../models/Portfolio"));
const router = express_1.default.Router();
router.post('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body: { username, text, star, review_avg }, params: { id } } = req;
    const new_review = {
        createdAt: String(new Date()),
        text,
        username,
        star
    };
    const result = yield Portfolio_1.default
        .findByIdAndUpdate(id, {
        $push: {
            review: new_review
        },
        $set: {
            review_avg
        }
    }, {
        returnDocument: 'after'
    })
        .lean();
    if (!result)
        return res.status(400).json({ msg: 'no found' });
    const convertedDocument = db_1.default.convertDocToObj(result);
    return res.status(200).json({ result: convertedDocument });
}));
router.post('/like/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, body: { newLike } } = req;
    const portfolioObj = yield Portfolio_1.default.findById(id).lean();
    if (!portfolioObj)
        return res.status(400).json({ msg: 'not found' });
    const existedLikeIndex = portfolioObj.like.findIndex((likeobj) => {
        return likeobj.email === newLike.email;
    });
    if (existedLikeIndex !== -1) {
        // すでにいいねしているので
        // いいねを外す
        const result = yield Portfolio_1.default
            .findByIdAndUpdate(id, {
            $pull: {
                like: {
                    email: newLike.email
                }
            }
        }, {
            returnDocument: 'after'
        })
            .lean();
        if (!result)
            return res.status(400).json({ msg: 'no found' });
        const convertedDocument = db_1.default.convertDocToObj(result);
        return res.status(200).json({ msg: 'ok', result: convertedDocument });
    }
    else {
        //まだいいねしていないので
        //いいねを追加する
        // いまいちを押していたら外す
        const result = yield Portfolio_1.default
            .findByIdAndUpdate(id, {
            $push: {
                like: {
                    email: newLike.email
                }
            },
            $pull: {
                dislike: {
                    email: newLike.email
                }
            }
        }, {
            returnDocument: 'after'
        })
            .lean();
        if (!result)
            return res.status(400).json({ msg: 'no found' });
        const convertedDocument = db_1.default.convertDocToObj(result);
        return res.status(200).json({ msg: 'ok', result: convertedDocument });
    }
}));
router.post('/dislike/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { id }, body: { newDislike } } = req;
    const portfolioObj = yield Portfolio_1.default.findById(id).lean();
    if (!portfolioObj)
        return res.status(400).json({ msg: 'not found' });
    const existedLikeIndex = portfolioObj.dislike.findIndex((dislikeobj) => {
        return dislikeobj.email === newDislike.email;
    });
    if (existedLikeIndex !== -1) {
        // すでにいまいちしているので
        // いまいちを外す
        const result = yield Portfolio_1.default
            .findByIdAndUpdate(id, {
            $pull: {
                dislike: {
                    email: newDislike.email
                }
            }
        }, {
            returnDocument: 'after'
        })
            .lean();
        if (!result)
            return res.status(400).json({ msg: 'no found' });
        const convertedDocument = db_1.default.convertDocToObj(result);
        return res.status(200).json({ msg: 'ok', result: convertedDocument });
    }
    else {
        //まだいまいちしていないので
        //いまいちを追加する
        // いいねを押していたら外す
        const result = yield Portfolio_1.default
            .findByIdAndUpdate(id, {
            $push: {
                dislike: {
                    email: newDislike.email
                }
            },
            $pull: {
                like: {
                    email: newDislike.email
                }
            }
        }, {
            returnDocument: 'after'
        })
            .lean();
        if (!result)
            return res.status(400).json({ msg: 'no found' });
        const convertedDocument = db_1.default.convertDocToObj(result);
        return res.status(200).json({ msg: 'ok', result: convertedDocument });
    }
}));
exports.default = router;
