<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '~/store/news'

const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()

const loadNews = async () => {
  await newsStore.fetchNews()
}

const changeFilter = async (source) => {
  await router.push({ query: { source, page: 1 } })
  await loadNews()
  newsStore.filterNewsBySource(source)
}

watch(() => route.query.source, (newSource) => {
  newsStore.filterNewsBySource(newSource || '')
})

watch(() => route.query.page, (newPage) => {
  const pageNumber = parseInt(newPage) || 1
  newsStore.setPage(pageNumber)
}, { immediate: true })

const filterSource = computed(() => route.query.source || '')
const currentPage = computed(() => newsStore.currentPage)
const totalPages = computed(() => newsStore.totalPages)
const paginatedNews = computed(() => newsStore.paginatedNews)

const changePage = (page) => {
  router.push({ query: { source: filterSource.value, page } })
}

const viewMode = ref('grid')

const changeViewMode = (mode) => {
  viewMode.value = mode
  if (process.client) {
    localStorage.setItem('viewMode', mode)
  }
}

onMounted(() => {
  if (process.client) {
    viewMode.value = localStorage.getItem('viewMode') || 'grid'
  }
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 4

  if (totalPages.value <= maxVisible + 1) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
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

    <div class="view-mode-buttons">
      <button @click="changeViewMode('grid')" :class="{ active: viewMode === 'grid' }">Сетка</button>
      <button @click="changeViewMode('list')" :class="{ active: viewMode === 'list' }">Список</button>
    </div>

    <div :class="['news-container', viewMode]">
      <div v-for="item in paginatedNews" :key="item.link" class="news-item">
        <a :href="item.link" target="_blank">{{ item.title }}</a>
        <p>{{ item.source }} — {{ new Date(item.date).toLocaleDateString() }}</p>
      </div>
    </div>

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
.view-mode-buttons {
  margin: 10px 0;
}

.view-mode-buttons button {
  margin-right: 5px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.view-mode-buttons .active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}


.news-container.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.news-container.list {
  display: block;
}


.news-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.news-item a {
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.news-item a:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
}

.pagination button {
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination .active {
  font-weight: bold;
  color: white;
  background: #007bff;
}
</style>
