<template>
  <div class="col-md-3">
    <div 
      class="card product-card shadow-sm border-0" 
      @mouseover="hover = true" 
      @mouseleave="hover = false"
      @click="goToProduct"
    >
      <div class="card-body text-center">
        <img :src="imagem" :alt="nome" class="product-image" />
        <h5 class="card-title mt-3">{{ nome }}</h5>
        <p class="text-muted">{{ categoria }}</p>
        <p class="fw-bold">{{ preco }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  nome: string;
  categoria: string;
  preco: string;
  imagem: string;
}>();

const hover = ref(false);
const router = useRouter();

const goToProduct = () => {
  router.push('/product');
};
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
