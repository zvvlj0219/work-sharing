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

const router = express.Router()

/*
* レビューを追加
* @params {object} req - req object
* @params {object} res - res object
*/
router.post('/:id', async (req, res) => {
    const {
        body: {
            text,
            username,
            star
        },
        params: {
            id
        }
    } = req

    const new_review: Review = {
        createdAt: String(new Date()),
        text,
        username,
        star
    }

    const result = await portfolioSchema.findByIdAndUpdate(
        id,
        {
            $push: {
                review: new_review
            }
        }
    )

    if(!result) return res.status(400).json({ msg: 'no found'})

    return res.status(200).json({ result})
})

export default router
