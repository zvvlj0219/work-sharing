import { ObjectId } from 'mongoose'

export type Portfolio = {
    _id: ObjectId
    image: {
        name: string
    }
    username: string
    review: Review[]
    work_url: string
    work_name: string
    description: string
    review_avg: number
    like: number
    dislike: number
}

export type Review = {
    createdAt: string
    username: string
    star: number
    text: string
}
