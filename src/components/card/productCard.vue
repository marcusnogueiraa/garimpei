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
        <img :src="productImage" :alt="name" class="product-image object-fit-cover" />
        <h5 class="card-title mt-3">{{ name }}</h5>
        <p class="fw-bold">{{ formatPrice(price) }}</p>
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
import { useAuthGuard } from '@/composables/useAuthGuard'; 
import api from '@/api/axios';

const props = defineProps<Produto>();

const hover = ref(false);
const router = useRouter();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore();

const isInCart = computed(() => cartStore.cart.some(item => item.id === props.id));
const isFavorite = computed(() => favoriteStore.favorites.some(item => item.id === props.id));

const { requireLogin } = useAuthGuard();

const goToProduct = () => {
  router.push(`/product/${props.id}`);
};

const toggleCart = () => {
  requireLogin(() => {
    if (isInCart.value) {
      cartStore.removeCartItem(props.id);
    } else {
      cartStore.addCartItem({ ...props });
    }
  });
};

const toggleFavorite = () => {
  requireLogin(() => {
    if (isFavorite.value) {
      favoriteStore.removeFavorite(props.id);
    } else {
      favoriteStore.addFavorite({ ...props });
    }
  });
};

// Ajustando o caminho correto da imagem
const productImage = computed(() => props.image1 || '');


const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// async function fetchUserById(id: number) {
//     try {
//       const response = await api.get(`/users?filters[id][$eq]=${id}&populate=*`);
  
//       if (!response.data || !response.data.data || response.data.data.length === 0) {
//         console.error("Erro: User não encontrado.", response);
//         return;
//       }
      
//       console.log(response.data.data)
//       return  response.data.data.username
//     } catch (err) {
//       console.error('Erro ao buscar produto:', err);
//     } 
//   }
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease-in-out;
}

.star {
  top: 6px;
  right: 6px;
  cursor: pointer;
  color: #ffff00;
  opacity: 0;
  visibility: hidden;
}

.product-card:hover {
  box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.6);
  transform: scale(1.05)
}

.product-card:hover .star{
  opacity: 1;
  visibility: visible;
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
