<template>
  <div class="container">
    <header>
      <h1>Список новостей</h1>
      <button @click="refreshNews">Обновить</button>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useNewsStore } from '~/store/news'

const newsStore = useNewsStore()

const refreshNews = async () => {
  await newsStore.resetFilters()
  await newsStore.fetchNews()
}
</script>

<style scoped>
.container {
  margin: 0 auto;
}

button {
  margin-left: 20px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
