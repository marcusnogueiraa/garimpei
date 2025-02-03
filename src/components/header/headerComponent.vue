<template>
  <header class="header">
    <div class="container d-flex justify-content-between align-items-center py-3">
      <div>
        <h1 class="text-light fw-bold">Garimpei</h1>
      </div>

      <div>
        <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
        <router-link to="/register" class="btn btn-success">Cadastro</router-link>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.header {
  background-color: #4A4238;
}

.btn {
  font-weight: bold;
  padding: 8px 16px;
}

.btn-success {
  background-color: #6C9A8B;
  border-color: #6C9A8B;
}

.btn-success:hover {
  background-color: #5b887a;
  border-color: #5b887a;
}
</style>
