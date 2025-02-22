<template>
    <div class="vh-100 d-flex flex-column position-relative">
      <HeaderComponent />
      <main class="h-100 p-4">
        <h2 class="fw-bold">Meu Carrinho</h2>
        <div v-if="cartStore.cart.length === 0" class="h-100 d-flex justify-content-center align-items-center">
          <div>
            <img src="../assets/empty_cart.svg" class="empty-cart-icon" alt="">
            <h6 class="mt-4">Carrinho vazio</h6>
          </div>
        </div>
        <div v-else>
          <div class="row mt-4" id="produtos">
            <ProductCard 
              v-for="(item) in cartStore.cart" 
              :key="item.id" 
              :id="item.id"
              :nome="item.nome" 
              :categoria="item.categoria" 
              :preco="item.preco" 
              :imagem1="item.imagem1"
              :seller="item.seller"
              :descricao="item.descricao"
              class="col-md-3 mt-2"
            />
          </div>
          <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-primary">Comprar</button>
          </div>
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script lang="ts">
  import FooterComponent from '@/components/footer/footerComponent.vue';
  import HeaderComponent from '@/components/header/headerComponent.vue';
  import ProductCard from '@/components/card/productCard.vue';
  import { useCartStore } from '@/store/cart';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    setup() {
      const cartStore = useCartStore();
      return { cartStore };
    },
    components: {
      HeaderComponent,
      FooterComponent,
      ProductCard
    }
  });
  </script>
  
  <style scoped>
  .empty-cart-icon {
    width: 300px;
  }
  </style>
  