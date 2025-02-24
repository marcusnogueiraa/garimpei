<template>
  <div class="vh-100 d-flex flex-column position-relative">
    <HeaderComponent />
    <main class="h-100 p-4 animate-spawn">
      <h2 class="fw-bold">Seus Favoritos</h2>
      <div v-if="favoriteStore.favorites.length === 0" class="h-100 d-flex justify-content-center align-items-center">
        <div>
          <img src="../assets/fav_icon.svg" class="empty-favorites-icon" alt="Ícone favoritos">
          <h6 class="mt-4">Nenhum item nos favoritos</h6>
        </div>
      </div>
      <div v-else>
        <div class="row mt-4" id="produtos">
          <ProductCard 
            v-for="(item) in favoriteStore.favorites" 
            :key="item.id" 
            :id="item.id"
            :documentId="item.documentId"
            :name="item.name" 
            :description="item.description"
            :price="item.price" 
            :quantity="item.quantity"
            :slug="item.slug"
            :wasSold="item.wasSold"
            :tags="item.tags"
            :createdAt="item.createdAt"
            :updatedAt="item.updatedAt"
            :publishedAt="item.publishedAt"
            :image1="formatImage(item.image1)"
            :sellerId="item.sellerId"
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

    const formatImage = (image: string | { url?: string }) => {
      if (typeof image === 'string') return image;
      return image?.url ? `http://localhost:1337${image.url}` : 'https://via.placeholder.com/100';
    };

    return { favoriteStore, formatImage };
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

.animate-spawn {
  animation: spawn .2s forwards;
}

@keyframes spawn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
