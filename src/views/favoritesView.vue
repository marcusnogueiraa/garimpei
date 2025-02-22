<template>
    <div class="vh-100 d-flex flex-column position-relative">
      <HeaderComponent />
      <main class="h-100 p-4">
        <h2>Seus Favoritos</h2>
        <div v-if="favoriteStore.favorites.length === 0" class="h-100 d-flex justify-content-center align-items-center">
          <div>
            <img src="../assets/fav_icon.svg" class="empty-favorites-icon" alt="">
            <h6 class="mt-4">Nenhum item nos favoritos</h6>
          </div>
        </div>
        <div v-else>
          <div class="row mt-4" id="produtos">
            <ProductCard 
              v-for="(item) in favoriteStore.favorites" 
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
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script lang="ts">
  import FooterComponent from '@/components/footer/footerComponent.vue';
  import HeaderComponent from '@/components/header/headerComponent.vue';
  import ProductCard from '@/components/card/productCard.vue';
  import { useFavoriteStore } from '@/store/favorites';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    setup() {
      const favoriteStore = useFavoriteStore();
      return { favoriteStore };
    },
    components: {
      HeaderComponent,
      FooterComponent,
      ProductCard
    }
  });
  </script>
  
  <style scoped>
  .empty-favorites-icon {
    width: 300px;
  }
  </style>
  