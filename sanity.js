import {createClient} from 'next-sanity'
import createImgUrlBuilder from '@sanity/image-url'

export const config={
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: '2022-04-10',
    useCdn: process.env.NODE_ENV === 'production'
}

export const sanityClient = createClient(config)
export const urlFor = (source) => createImgUrlBuilder(config).image(source)