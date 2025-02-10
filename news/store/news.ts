export const useNewsStore = defineStore('news', {
    state: () => ({
        news: [],
        filteredNews: [],
        currentPage: 1,
        perPage: 4,
        sourceFilter: '',
    }),

    getters: {
        paginatedNews(state) {
            const start = (state.currentPage - 1) * state.perPage
            return state.filteredNews.slice(start, start + state.perPage)
        },
        totalPages(state) {
            return Math.ceil(state.filteredNews.length / state.perPage)
        }
    },

    actions: {
        async fetchNews() {
            const { data } = await useAsyncData('news', () => $fetch('/api/news'))
            this.news = data.value || []
            this.filteredNews = [...this.news]
        },
        filterNewsBySource(source: string, page = 1) {
            this.sourceFilter = source
            if (source) {
                this.filteredNews = this.news.filter(item => item.source === source)
            } else {
                this.filteredNews = [...this.news]
            }
            this.currentPage = page
        },

        setPage(page: number) {
            this.currentPage = page
        },
        filterNewsBySearch(searchQuery) {
            this.filteredNews = this.news.filter(newsItem =>
                newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                newsItem.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

    }
})
