<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '~/store/news'

const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()


const loadNews = async () => {
  await newsStore.fetchNews()
}

const changeFilter = async (source) => {
  await router.push({ query: { source } })
  await loadNews()
  newsStore.filterNewsBySource(source)
}

const filterSource = route.query.source || ''

if (!filterSource) {
  loadNews()
} else {
  newsStore.filterNewsBySource(filterSource)
}
</script>

<template>
  <div>
    <div>
      <button @click="changeFilter('')">Все</button>
      <button @click="changeFilter('Lenta.ru')">Lenta.ru</button>
      <button @click="changeFilter('Mos.ru')">Mos.ru</button>
    </div>

    <ul>
      <li v-for="item in newsStore.news" :key="item.link">
        <a :href="item.link" target="_blank">{{ item.title }}</a>
        <p>{{ item.source }} — {{ new Date(item.date).toLocaleDateString() }}</p>
      </li>
    </ul>
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
</style>
