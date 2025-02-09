<script setup>
import { useNewsStore } from '~/store/news'

const newsStore = useNewsStore()

await newsStore.fetchNews()
</script>

<template>
  <div>
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

