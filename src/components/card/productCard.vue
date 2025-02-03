<template>
  <div class="col-md-3">
    <div class="card product-card shadow-sm border-0" @mouseover="hover = true" @mouseleave="hover = false">
      <div class="card-body text-center">
        <img :src="imagem" :alt="nome" class="product-image" />
        <h5 class="card-title mt-3">{{ nome }}</h5>
        <p class="text-muted">{{ categoria }}</p>
        <p class="fw-bold">{{ preco }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    },
    imagem: {
      type: String,
      required: true
    }
  },
  setup() {
    const hover = ref(false);
    return { hover };
  }
});
</script>

<style scoped>
.product-card {
  transition: box-shadow 0.3s ease-in-out;
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
