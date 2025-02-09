import { defineEventHandler } from 'h3'
import Parser from 'rss-parser'

export default defineEventHandler(async () => {
    const parser = new Parser()
    const sources = [
        { name: 'Mos.ru', url: 'https://www.mos.ru/rss' },
        { name: 'Lenta.ru', url: 'https://lenta.ru/rss' }
    ]

    let news = []

    for (const source of sources) {
        try {
            const feed = await parser.parseURL(source.url)
            const items = feed.items.map(item => ({
                title: item.title,
                link: item.link,
                date: item.pubDate,
                source: source.name
            }))
            news = [...news, ...items]
        } catch (error) {
            console.error(`Ошибка загрузки RSS с ${source.name}:`, error)
        }
    }

    return news
})
