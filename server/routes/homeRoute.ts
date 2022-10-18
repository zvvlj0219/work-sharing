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

const router = express.Router()

let gridfsBucket: GridFSBucket
let gfs: g.Grid

// initialize GridFsBucket
const connection = mongoose.connection;
connection.once('open', () => {
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: 'uploads-images'
    });

    gfs = g(connection.db, mongoose.mongo)
    gfs.collection('uploads-images');
});


const sampleData = {
    portfolios: [
        {
            _id: new mongoose.Types.ObjectId('634e635b275e2120a7374d2b'),
            image: {
                // filename
                name: 'U2FsdGVkX1p1L2u3S7W6wkzUg47eAb6oLqlMImNJNDFE1zKioe1Q2u3A4l.png'
            },
            username: 'sample1',
            review: [],
            work_url: 'sample@sample.com',
            work_name: 'otaku',
            description: 'otaku man otaku man otaku man otaku man otaku man',
            review_avg: 0,
            like:0,
            dislike:0
        }
    ]
}

// get meta file
router.get('/', async (req,res) => {
    await db.connect()

    // api

    const result = sampleData.portfolios

    await db.disconnect()

    return res.status(200).json({ portfolios: result })
})

router.get('/fetch/:filename', async (req,res) => {
    const { filename } = req.params
    if(!filename) return res.status(400).json({ msg: 'not found filename'})

    const file = await gfs.files.findOne({ filename })

    if(!file){
        return res.status(400).json({ msg: 'not exsit file'})
    }

    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res)
})

export default router
