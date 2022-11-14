import { ObjectId, Date } from 'mongoose'

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
    like: {
        email: string
    }[]
    dislike: {
        email: string
    }[]
    createdAt: Date
    updatedAt: Date
}

export type Review = {
    createdAt: string
    username: string
    star: number
    text: string
}
