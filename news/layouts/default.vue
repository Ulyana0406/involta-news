<template>
  <div class="container">
    <header>
      <div class="logo">
        <h1>Список новостей</h1>
        <img
            src="@/assets/icons/refresh.png"
            alt="Обновить"
            @click="refreshNews"
            class="refresh-icon"
        />
      </div>
    </header>
    <div class="divider"></div>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useNewsStore } from '~/store/news'
import { useHead } from '#imports'

useHead({
  bodyAttrs: {
    style: 'background-color: #FBFBFB;'
  }
})
const newsStore = useNewsStore()

const refreshNews = async () => {
  await newsStore.resetFilters()
  await newsStore.fetchNews()
}
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 1060px;;
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

.refresh-icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
}
.logo{
  display: flex;
  flex-direction: row;
  gap: 30px;
  height: 113px;
  align-items: center;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: #E5E5E5;
  margin-bottom: 26px;
}
</style>
