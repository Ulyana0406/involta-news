<template>
  <div class="container">
    <header class="container-header">
      <div class="logo">
        <h1 class="header_h1">Список новостей</h1>
        <img
            src="@/assets/icons/refresh.png"
            alt="Обновить"
            @click="refreshNews"
            class="refresh-icon"
        />
      </div>
      <div class="search-wrapper">
        <input
            type="text"
            v-model="searchQuery"
            @input="updateSearchQuery"
            class="search-input"
        />
        <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.48485 1.81818C4.80295 1.81818 1.81818 4.80295 1.81818 8.48485C1.81818 12.1667 4.80295 15.1515 8.48485 15.1515C10.2942 15.1515 11.9352 14.4307 13.1363 13.2606C13.1548 13.2382 13.1745 13.2165 13.1955 13.1956C13.2165 13.1746 13.2382 13.1549 13.2606 13.1364C14.4307 11.9352 15.1515 10.2942 15.1515 8.48485C15.1515 4.80295 12.1667 1.81818 8.48485 1.81818ZM15.093 13.8074C16.2669 12.3518 16.9697 10.5004 16.9697 8.48485C16.9697 3.7988 13.1709 0 8.48485 0C3.7988 0 0 3.7988 0 8.48485C0 13.1709 3.7988 16.9697 8.48485 16.9697C10.5004 16.9697 12.3518 16.2669 13.8074 15.0931L18.448 19.7337C18.803 20.0888 19.3786 20.0888 19.7337 19.7337C20.0887 19.3787 20.0887 18.8031 19.7337 18.4481L15.093 13.8074Z" fill="#DCDCDC"/>
        </svg>
      </div>
    </header>
    <div class="divider"></div>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '~/store/news'
import { useHead } from '#imports'


useHead({
  bodyAttrs: {
    style: 'background-color: #FBFBFB;'
  }
})
const newsStore = useNewsStore()
const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.search || '')

// Фильтрация при изменении поиска
const updateSearchQuery = () => {
  router.push({ query: { ...route.query, search: searchQuery.value, page: 1 } })
}

// Следим за изменением query в URL
watch(() => route.query.search, (newSearch) => {
  searchQuery.value = newSearch || ''
  newsStore.filterNewsBySearch(newSearch || '')
})

// Функция обновления новостей
const refreshNews = async () => {
  newsStore.filterNewsBySearch('')
  await router.push({ query: { search: '', page: 1 } })
  await newsStore.fetchNews()
}
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  max-width: 1060px;;
}
.container-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.search-wrapper {
  position: relative;
  max-width: 321px;
  width: 100%;
}

.search-input {
  width: 321px;
  height: 40px;
  font-size: 14px;
  background-color: #FFFFFF;
  border: 1px solid #E5E5E5;
  box-shadow: 0px 2px 4px 0px #0000000D;
  border-radius: 3px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #0029FF;
}

.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.header_h1{
  margin: 0;
}
@media (max-width: 768px) {
  .container {
    font-family: Arial, sans-serif;
    margin: 0 auto;
    max-width: 382px;;
  }
  .container-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
  }
  .logo {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: auto;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 23px;
  }
  .search-wrapper[data-v-433a9abd] {
    position: relative;
    width: 100%;
    max-width: 380px;
    margin-bottom: 23px;
  }
  .search-input{
    width: 100%;
    height: 40px;
    font-size: 14px;
    background-color: #FFFFFF;
    border: 1px solid #E5E5E5;
    box-shadow: 0px 2px 4px 0px #0000000D;
    border-radius: 3px;
    outline: none;
    transition: border-color 0.3s ease;
  }
}
</style>
