<script setup>
import {computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useNewsStore} from '~/store/news'

const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()

const loadNews = async () => {
  await newsStore.fetchNews()
}

const changeFilter = async (source) => {
  await router.push({query: {source, page: 1}})
  await loadNews()
  newsStore.filterNewsBySource(source)
}

watch(() => route.query.source, (newSource) => {
  newsStore.filterNewsBySource(newSource || '')
})

watch(() => route.query.page, (newPage) => {
  const pageNumber = parseInt(newPage) || 1
  newsStore.setPage(pageNumber)
}, {immediate: true})

const filterSource = computed(() => route.query.source || '')
const currentPage = computed(() => newsStore.currentPage)
const totalPages = computed(() => newsStore.totalPages)
const paginatedNews = computed(() => newsStore.paginatedNews)

const changePage = (page) => {
  router.push({query: {source: filterSource.value, page}})
}


const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 4

  if (totalPages.value <= maxVisible + 1) {
    return Array.from({length: totalPages.value}, (_, i) => i + 1)
  }

  const startPage = Math.max(1, currentPage.value - 1)
  const endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (endPage < totalPages.value) {
    pages.push('...')
    pages.push(totalPages.value)
  }

  return pages
})
</script>

<template>
  <div>
    <div>
      <button @click="changeFilter('')">Все</button>
      <button @click="changeFilter('Lenta.ru')">Lenta.ru</button>
      <button @click="changeFilter('Mos.ru')">Mos.ru</button>
    </div>

    <ul>
      <li v-for="item in paginatedNews" :key="item.link">
        <a :href="item.link" target="_blank">{{ item.title }}</a>
        <p>{{ item.source }} — {{ new Date(item.date).toLocaleDateString() }}</p>
      </li>
    </ul>

    <div v-if="totalPages > 1" class="pagination">
      <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: page === currentPage }"
          @click="page !== '...' && changePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 15px;
}

a {
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
}

button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.active {
  font-weight: bold;
  color: white;
  background: #007bff;
}
</style>
