import express from 'express'
import mongoose from 'mongoose'
import type { GridFSBucket } from 'mongoose/node_modules/mongodb/mongodb'
import g from 'gridfs-stream'
import db from '../config/db'
import portfolioSchema from '../models/Portfolio'
import type { Portfolio } from '../types'

const router = express.Router()

let gridfsBucket: GridFSBucket
let gfs: g.Grid

// initialize GridFsBucket
const connection = mongoose.connection
connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'uploads-images'
    })

    gfs = g(connection.db, mongoose.mongo)
    gfs.collection('uploads-images')
})

/*
 * 作品一覧の取得
 * @params {object} req - req object
 * @params {object} res - res object
 */
router.get('/', async (req, res) => {
    const result = await portfolioSchema.find().lean()

    if (!result) return res.status(400).json({ msg: 'not found documents' })

    const convertedDocuments = result.map((doc) => {
        return db.convertDocToObj<Portfolio>(doc)
    })

    return res.status(200).json({ portfolios: convertedDocuments })
})

/*
 * 作品画像の取得
 * @params {object} req - req object
 * @params {object} res - res object
 */
router.get('/fetch/:filename', async (req, res) => {
    const { filename } = req.params
    if (!filename) return res.status(400).json({ msg: 'not found filename' })

    const file = await gfs.files.findOne({ filename })

    if (!file) {
        return res.status(400).json({ msg: 'not exsit file' })
    }

    const readStream = gridfsBucket.openDownloadStream(file._id)
    readStream.pipe(res)
})

export default router
