import { defineStore } from 'pinia'
import { useAsyncData } from '#app'

export const useNewsStore = defineStore('news', {
    state: () => ({
        news: []
    }),

    actions: {
        async fetchNews() {
            const { data } = await useAsyncData('news', () => $fetch('/api/news'))
            this.news = data.value || []
        }
    }
})
