import type { MetadataRoute } from 'next'
import strapi from '~/server/strapi'
import slugify from '@sindresorhus/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const data = await strapi.get('events', {
        pagination: {
            limit: 1000
        }
    })

    const sitemaps = data.data.map((e: any) => ({
        url: 'https://stom-coach.ru/events/' + slugify(e.attributes.name + " " + e.id),
        lastModified: new Date(e.attributes.updatedAt)
    }))

    return [
        {
            url: 'https://stom-coach.ru',
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: 'https://stom-coach.ru/events',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://stom-coach.ru/photoalbums',
            lastModified: new Date(),
            changeFrequency: 'weekly'
        },
        {
            url: 'https://stom-coach.ru/auth/signin',
            lastModified: new Date(),
            changeFrequency: 'yearly'
        },
        {
            url: 'https://stom-coach.ru/auth/signup',
            lastModified: new Date(),
            changeFrequency: 'yearly'
        },
        {
            url: 'https://stom-coach.ru/privacy',
            lastModified: new Date(),
            changeFrequency: 'yearly'
        },
        ...sitemaps
    ]
}