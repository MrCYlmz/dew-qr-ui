<script setup lang="ts"></script>

<template>
  <header>
    <p>Admin Panel</p>
    <nav>
      <router-link to="/admin/create-item">Create Item</router-link>
      <router-link to="/admin/order-manager">Order Manager</router-link>
      <router-link to="/admin/update-item">Update Item</router-link>
    </nav>
  </header>
  <main>
    <router-view />
  </main>
</template>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  nav a {
    margin: 0 8px;
    text-decoration: none;
    color: #333;
  }
}
main {
  padding: 1rem;
}
</style>
