<template>
    <div class="col-md-3">
      <div class="card shadow-sm border-0">
        <div class="card-body text-center"> 
          <div class="placeholder-image bg-light mb-3"></div>
          <h5 class="card-title">{{ nome }}</h5>
          <p class="text-muted">{{ categoria }}</p>
          <p class="fw-bold">{{ preco }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'productCard',
    props: {
      nome: {
        type: String,
        required: true
      },
      categoria: {
        type: String,
        required: true
      },
      preco: {
        type: String,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .placeholder-image {
    width: 100%;
    height: 150px;
    background: #e9ecef;
    border-radius: 5px;
  }
  </style>
  