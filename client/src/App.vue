<template>
  <div id="app">
    <nav v-if="$route.path !== '/Management'">
      <router-link to="/Management" class="nav-link">Basic Management System</router-link>
    </nav>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  background-color: #24242473;
  padding: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #b9af42;
  text-decoration: underline;
}

.content {
  padding: 1rem;
}
</style>
