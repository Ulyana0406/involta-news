<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useNewsStore} from '~/store/news'

const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()

const loadNews = async () => {
  await newsStore.fetchNews()
}

const changeFilter = async (source, page = 1) => {
  await router.push({query: {source, page: page}})
  await loadNews()
  newsStore.filterNewsBySource(source, page)
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

const viewMode = ref('grid')

const changeViewMode = (mode) => {
  viewMode.value = mode
  if (process.client) {
    localStorage.setItem('viewMode', mode)
  }
}

onMounted(async () => {

  const source = route.query.source || ''
  const page = route.query.page || ''
  changeFilter(source, page)
  await loadNews();

  if (process.client) {
    viewMode.value = localStorage.getItem('viewMode') || 'grid';
  }

});


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
    <div class="filters_and_view">
      <div class="filters">
        <button
            class="filters_button"
            @click="changeFilter('')"
            :class="{ active: filterSource === '' }"
        >
          Все
        </button>
        <button
            class="filters_button"
            @click="changeFilter('Lenta.ru')"
            :class="{ active: filterSource === 'Lenta.ru' }"
        >
          Lenta.ru
        </button>
        <button
            class="filters_button"
            @click="changeFilter('Mos.ru')"
            :class="{ active: filterSource === 'Mos.ru' }"
        >
          Mos.ru
        </button>
      </div>

      <div class="view-mode-buttons">
        <svg
            @click="changeViewMode('list')"
            :class="{ active: viewMode === 'list' }"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
        >
          <rect width="18" height="8" :fill="viewMode === 'list' ? '#0029FF' : '#C4C4C4'"/>
          <rect y="10" width="18" height="8" :fill="viewMode === 'list' ? '#0029FF' : '#C4C4C4'"/>
        </svg>

        <svg
            @click="changeViewMode('grid')"
            :class="{ active: viewMode === 'grid' }"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
        >
          <rect width="8" height="8" :fill="viewMode === 'grid' ? '#0029FF' : '#C4C4C4'"/>
          <rect y="10" width="8" height="8" :fill="viewMode === 'grid' ? '#0029FF' : '#C4C4C4'"/>
          <rect x="10" width="8" height="8" :fill="viewMode === 'grid' ? '#0029FF' : '#C4C4C4'"/>
          <rect x="10" y="10" width="8" height="8" :fill="viewMode === 'grid' ? '#0029FF' : '#C4C4C4'"/>
        </svg>
      </div>
    </div>

    <div :class="['news-container', viewMode]">
      <div v-for="item in paginatedNews" :key="item.link" :class="['news-item', viewMode]">
        <div :class="['news-content_list', viewMode]" >
          <img v-if="viewMode === 'list'" :src="item.img" alt="News Image" class="news-image" />
          <div :class="['news-source_title', viewMode]"   >{{ item.title }}</div>
          <div :class="['news_content', viewMode]" >
            <div  class="news-source_title" >{{ item.title }}</div>
            <p  :class="['news-source_description', viewMode]"  >{{item.description}}</p>
          </div>
        </div>
        <div  :class="['news-source_div', viewMode]" >
          <p class="news-source_description">{{item.description}}</p>
          <a :class="['news-item_a', viewMode]" :href="item.link" target="_blank">Подробнее</a>
          <div class="news-source">
            <p class="news-source_p">{{ item.source }}</p>
            <p class="news-source_p_date"> {{ new Date(item.date).toLocaleDateString() }}</p>
          </div>
        </div>
        <div :class="['news-source', viewMode]" >
          <p class="news-source_p">{{ item.source }}</p>
          <p class="news-source_p_date"> {{ new Date(item.date).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: page === +currentPage }"
          @click="page !== '...' && changePage(page)"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-mode-buttons {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.view-mode-buttons svg {
  cursor: pointer;
  transition: fill 0.3s ease;
}

.view-mode-buttons svg.active {
  fill: #0029FF;
}

.view-mode-buttons svg rect {
  fill: #C4C4C4;
}

.view-mode-buttons svg.active rect {
  fill: #0029FF;
}

.news-content_list.list{
  display: flex;
  flex-direction: row;
  gap: 30px;
  margin-bottom: 31px;
  padding-inline: 30px;
}

.news-source{
  display: flex;
  justify-content: space-between;
}
.news-source.list{
  padding-inline: 30px;
  display: flex;
  justify-content: space-between;
  background-color: #FCFCFC;
}
.news-source.grid{
  display: none;
}
.news-source_description{
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
  color: #000000;
  height: 40px;
  margin-bottom: 20px;
}
.news-source_description.list{
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
  color: #000000;
  height: 40px;
  margin: 0px;
}
.news_content.list{
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.news_content.grid{
  display: none;
}
.news-image {
  width: 200px;
  height: 100px;
}
.news-source_p {
  color: #DCDCDC;
  font-weight: 400;
  font-size: 14px;
  text-decoration: underline;
  text-decoration-style: solid;
}

.news-source_p_date {
  color: #DCDCDC;
  font-weight: 400;
  font-size: 14px;
}
.news-container.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 50px;
}


.news-container.list {
 display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
}

.filters_button.active {
  color: #000000;
}

.news-item {
 background-color:  #FFFFFF;
  box-shadow: 0px 2px 4px 0px #0000000D;

}
.news-item.list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 30px;
  padding-bottom: 0px;
  border-radius: 3px;
  box-shadow: 0px 2px 4px 0px #0000000D;
}
.news-item.grid {
  height: 256px;
  padding: 16px 30px;
  //border: 1px solid #ccc;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  //box-shadow: 0px 1px 4px 0px #0000000D;
  box-shadow: 0px 2px 4px 0px #0000000D;
}

.news-source_title{
  font-weight: bold;
  font-size: 18px;
  color:  #0029FF;
}
.news-source_title.list{
  display: none;
}
.news-item_a {
  margin-bottom: 19px;
  color:  #0029FF;
  text-decoration: underline;
}

.news-item_a.list{
  display: none;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button {
  border: none;
  background: none;
  margin: 5px;
  padding: 5px 10px;
  cursor: pointer;
  color: #000000;
  font-weight: 700;
  font-size: 18px;
}

.pagination .active {
  font-weight: bold;
  color: #0029FF;
}

.filters_and_view {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.filters {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 159px;
}

.filters_button {
  background-color: transparent;
  border: none;
  color: #0029FF;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.filters_button .active {
  color: #007bff;
}
.view-mode-buttons svg {
  cursor: pointer;
  transition: fill 0.3s ease;
}

.view-mode-buttons svg.active {
  fill: #0029FF;
}

.news-source_div{
  display: flex;
  flex-direction: column;
}
.news-source_div.list{
  display: none
}
</style>
