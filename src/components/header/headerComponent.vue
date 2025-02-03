<template>
    <header class="header">
      <div class="container d-flex justify-content-between align-items-center py-3">

        <div>
            <h1 class="text-light fw-bold">Garimpei </h1>
        </div>
  

        <div>
          <button class="btn btn-outline-light me-2">Login</button>
          <button class="btn btn-success">Cadastro</button>
        </div>
      </div>
    </header>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'HeaderComponent',
  });
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
  