import express from 'express'
import db from '../config/db'
import portfolioSchema from '../models/Portfolio'
import { Portfolio, Review } from '../types'

const router = express.Router()

/*
 * レビューを追加
 * @params {object} req - req object
 * @params {object} res - res object
 */
interface PostBodyParams {
    body: {
        username: string
        text: string
        star: number
        review_avg: number
    }
    params: {
        id: string
    }
}

router.post('/:id', async (req, res) => {
    const {
        body: { username, text, star, review_avg },
        params: { id }
    } = req as PostBodyParams

    const new_review: Review = {
        createdAt: String(new Date()),
        text,
        username,
        star
    }

    const result = await portfolioSchema
        .findByIdAndUpdate(
            id,
            {
                $push: {
                    review: new_review
                },
                $set: {
                    review_avg
                }
            },
            {
                returnDocument: 'after'
            }
        )
        .lean()

    if (!result) return res.status(400).json({ msg: 'no found' })

    const convertedDocument = db.convertDocToObj<Portfolio>(result)

    return res.status(200).json({ result: convertedDocument })
})

/*
 * いいねボタン押下
 * @params {object} req - req object
 * @params {object} res - res object
 */
interface LikePost {
    body: {
        newlikeCount: number
    }
    params: {
        id: string
    }
}

router.post('/like/:id', async (req, res) => {
    const {
        params: { id },
        body: { newlikeCount }
    } = req as LikePost

    const result = await portfolioSchema
        .findByIdAndUpdate(
            id,
            {
                $set: {
                    like: newlikeCount
                }
            },
            {
                returnDocument: 'after'
            }
        )
        .lean()

    if (!result) return res.status(400).json({ msg: 'no found' })

    const convertedDocument = db.convertDocToObj<Portfolio>(result)

    return res.status(200).json({ msg: 'ok', result: convertedDocument })
})

/*
 * いまいちボタン押下
 * @params {object} req - req object
 * @params {object} res - res object
 */
interface DislikePost {
    body: {
        newdislikeCount: number
    }
    params: {
        id: string
    }
}

router.post('/dislike/:id', async (req, res) => {
    const {
        params: { id },
        body: { newdislikeCount }
    } = req as DislikePost

    const result = await portfolioSchema
        .findByIdAndUpdate(
            id,
            {
                $set: {
                    dislike: newdislikeCount
                }
            },
            {
                returnDocument: 'after'
            }
        )
        .lean()

    if (!result) return res.status(400).json({ msg: 'no found' })

    const convertedDocument = db.convertDocToObj<Portfolio>(result)

    return res.status(200).json({ msg: 'ok', result: convertedDocument })
})

export default router
