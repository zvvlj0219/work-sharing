import express from 'express'
import mongoose from 'mongoose'
import CryptoJS from 'crypto-js';
import multer from 'multer'
import path from 'path';
import {GridFsStorage} from 'multer-gridfs-storage'
import dotenv from 'dotenv'
import type { GridFSBucket } from 'mongoose/node_modules/mongodb/mongodb'
import g from 'gridfs-stream'
import db from '../config/db'
import portfolioSchema from '../models/Portfolio'
import { Review } from '../types';
import {upload} from '../middleware/upload'

dotenv.config()

const router = express.Router()

/*
* ポートフォリオの画像をgridfsに保存
* @params {object} req - req object
* @params {object} res - res object
*/
router.post('/save_image', upload.single('upload-image-name'), async (req,res) => {
    // console.log(req.file)
    // console.log(req.files)
    return res.status(200).json({ msg: 'ok', result_image: req.file})
})




/*
* ポートフォリオをアップロード
* @params {object} req - req object
* @params {object} res - res object
*/
interface PostBody {
    image: {
        name: string
    };
    username: string;
    work_url: string;
    work_name: string;
    description: string;
}

router.post('/save_portfolio', async (req, res) => {
    try {
        const { 
            portfolioData: {
                image,
                username,
                work_url,
                work_name,
                description
            }
        } = req.body as { portfolioData: PostBody}
    
        console.log({
            image,
            username,
            work_url,
            work_name,
            description
        })
        
        const newPortfolio = await portfolioSchema.create({
            image,
            username,
            review: [],
            work_url,
            work_name,
            description,
            review_avg: 0,
            like: 0,
            dislike: 0
        })
    
        return res.status(200).json({ result: newPortfolio })
    } catch (error) {
        console.log(error)
    }
})

export default router
