<template>
  <div class="container">
    <header>
      <h1>Список новостей</h1>
      <nav>
        <NuxtLink to="/">Главная</NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
}
</style>
