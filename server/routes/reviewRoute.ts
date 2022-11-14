import express from 'express'
import db from '../config/db'
import portfolioSchema from '../models/Portfolio'
import { Portfolio, Review } from '../types'

const router = express.Router()

/*
 * レビューを追加
 * @params {object} req - req object PostBodyParams
 * @params {object} res - res object Portfolio
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
 * @params {object} req - req object likePost
 * @params {object} res - res object Portfolio
 */
interface LikePost {
    body: {
        newLike: {
            email: string
        }
    }
    params: {
        id: string
    }
}

router.post('/like/:id', async (req, res) => {
    const {
        params: { id },
        body: { newLike }
    } = req as LikePost

    const portfolioDucument = await portfolioSchema.find({
        _id: id,
    })

    const portfolioObj = portfolioDucument
        ? portfolioDucument[0]
        : {} as typeof portfolioDucument


    if(portfolioObj.like.length !== 0) {
        // すでにいいねしているので
        // いいねを外す
        const result = await portfolioSchema
            .findByIdAndUpdate(
                id,
                {
                    $pull: {
                        like: newLike
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
    
    } else {
        //まだいいねしていないので
        //いいねを追加する
        // いまいちを押していたら外す
        const result = await portfolioSchema
            .findByIdAndUpdate(
                id,
                {
                    $push: {
                        like: newLike
                    },
                    $pull: {
                        dislike: newLike
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
    }

})

/*
 * いまいちボタン押下
 * @params {object} req - req object DislikePost
 * @params {object} res - res object Portfolio
 */
interface DislikePost {
    body: {
        newDislike: {
            email: string
        }
    }
    params: {
        id: string
    }
}

router.post('/dislike/:id', async (req, res) => {
    const {
        params: { id },
        body: { newDislike }
    } = req as DislikePost

    const portfolioDucument = await portfolioSchema.find({
        _id: id,
    })

    const portfolioObj = portfolioDucument
        ? portfolioDucument[0]
        : {} as typeof portfolioDucument


    if(portfolioObj.dislike.length !== 0) {
        // すでにいまいちしているので
        // いまいちを外す
        const result = await portfolioSchema
            .findByIdAndUpdate(
                id,
                {
                    $pull: {
                        dislike: newDislike
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
    
    } else {
        //まだいまいちしていないので
        //いまいちを追加する
        // いいねを押していたら外す
        const result = await portfolioSchema
            .findByIdAndUpdate(
                id,
                {
                    $push: {
                        dislike: newDislike
                    },
                    $pull: {
                        like: newDislike
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
    }
})

export default router
