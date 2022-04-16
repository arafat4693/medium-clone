import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client'

const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    useCdn: process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN
}

const client = sanityClient(config)

export default async function createComment(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { name, mail, comment, _id } = JSON.parse(req.body)
    try {
        await client.create({
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            mail,
            comment
        })
    } catch (err) {
        res.status(500).json({ message: 'comment could not be submitted', err })
    }

    res.status(200).json({ message: 'comment submitted' })
}
