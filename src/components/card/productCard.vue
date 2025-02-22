<template>
  <div class="col-md-3">
    <div 
      class="card product-card shadow-sm border-1" 
      @mouseover="hover = true" 
      @mouseleave="hover = false"
      @click="goToProduct"
    >
      <div class="card-body text-center position-relative">
        <div class="star position-absolute" @click.stop="toggleFavorite">
          <i :class="isFavorite ? 'fa fa-star' : 'far fa-star'"></i>
        </div>
        <img :src="imagem1" :alt="nome" class="product-image object-fit-cover" />
        <h5 class="card-title mt-3">{{ nome }}</h5>
        <p class="text-muted">{{ seller }}</p>
        <p class="fw-bold"> {{ formatPrice(preco) }} </p>
        <div class="buttons">
          <button @click.stop="toggleCart" class="btn btn-outline-primary">
            {{ isInCart ? 'Remover do Carrinho' : 'Adicionar ao Carrinho' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart';
import { useFavoriteStore } from '@/store/favorites';
import { Produto } from '../../types/interfaces';

const props = defineProps<Produto>();

const hover = ref(false);
const router = useRouter();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const isInCart = computed(() => cartStore.cart.some(item => item.id === props.id));
const isFavorite = computed(() => favoriteStore.favorites.some(item => item.id === props.id));

const goToProduct = () => {
  router.push(`/product/${props.id}`);
};

const toggleCart = () => {
  if (isInCart.value) {
    cartStore.removeCartItem(props.id);
  } else {
    cartStore.addCartItem({ ...props });
  }
};

const toggleFavorite = () => {
  if (isFavorite.value) {
    favoriteStore.removeFavorite(props.id);
  } else {
    favoriteStore.addFavorite({ ...props });
  }
};

const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease-in-out;
}

.star {
  top: 6px;
  right: 6px;
  cursor: pointer;

  color: yellow;
}

.product-card:hover {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.6);
  transform: scale(1.05)
}

.product-image {
  width: 100%;
  height: 300px;
  background-color: #fff; 
  border-radius: 5px;
}

.buttons button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}
</style>
