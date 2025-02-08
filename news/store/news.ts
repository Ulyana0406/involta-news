import { defineStore } from 'pinia'

export const useNewsStore = defineStore('news', {
    state: () => ({
        news: []
    }),
    actions: {
        setNews(newsData) {
            this.news = newsData
        }
    }
})
