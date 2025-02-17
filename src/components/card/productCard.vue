<template>
  <div class="col-md-3">
    <div 
      class="card product-card shadow-sm border-0" 
      @mouseover="hover = true" 
      @mouseleave="hover = false"
      @click="goToProduct"
    >
      <div class="card-body text-center">
        <img :src="imagem" :alt="nome" class="product-image object-fit-cover" />
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
  transition: all 0.3s ease-in-out;
}

.star{
  display: none;
  top: 6px;
  right: 6px;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0px 0x 16px rgba(0, 0, 0, 0.6);
  transform: scale(1.05);
}
.product-card:hover .star{
  display: block;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
