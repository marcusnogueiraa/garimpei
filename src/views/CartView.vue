<template>
  <div class="vh-100 d-flex flex-column position-relative">
    <HeaderComponent />
    <main class="h-100 p-4 animate-spawn">
      <h2 class="fw-bold">Meu Carrinho</h2>
      <div v-if="cartStore.cart.length === 0" class="h-100 d-flex justify-content-center align-items-center">
        <div>
          <img src="../assets/empty_cart.svg" class="empty-cart-icon" alt="Carrinho Vazio">
          <h6 class="mt-4">Carrinho vazio</h6>
        </div>
      </div>
      <div v-else>
        <div class="row mt-4" id="produtos">
          <ProductCard 
              v-for="(item) in cartStore.cart" 
              :key="item.id" 
              :id="item.id"
              :documentId="item.documentId || ''"
              :name="item.name" 
              :description="item.description"
              :price="item.price" 
              :quantity="item.quantity || 1"
              :slug="item.slug || ''"
              :wasSold="item.wasSold || false"
              :tags="item.tags" 
              :image1="formatImage(item.image1)"
              :createdAt="item.createdAt || new Date().toISOString()"
              :updatedAt="item.updatedAt || new Date().toISOString()"
              :publishedAt="item.publishedAt || new Date().toISOString()"
              :sellerId="item.sellerId"
              class="col-md-3 mt-2"
            />

        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-primary" @click="$router.push('/payment')">Comprar</button>
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

    const formatImage = (image: string | { url?: string } | null): string => {
      if (!image) return ''; 
      if (typeof image === 'string') return image; 
      if (typeof image === 'object' && image.url) return `http://localhost:1337${image.url}`; 
      return ''; 
    };


    return { cartStore, formatImage };
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
