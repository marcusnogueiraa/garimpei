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
        <img :src="productImage" :alt="name" class="product-image " />
        <h5 class="card-title mt-3">{{ name }}</h5>
        <h6 class="mt-3">{{ sellerUsername }} </h6>
        <p class="fw-bold">{{ formatPrice(price) }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, onMounted } from 'vue';
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
const sellerUsername = ref<string>(''); // 

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

const productImage = computed(() => props.image1 || '');

const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};


async function fetchUserById(id: number) {
  console.log("id", id)
  try {
    const response = await api.get(`/users?filters[id][$eq]=${id}&populate=*`);
    
    console.log(response.data)
    sellerUsername.value = response.data[0].username;
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
  }
}

onMounted(() => {
  fetchUserById(props.sellerId);
});
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
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
  height: auto;
  max-height: 250px;
  object-fit: contain;
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
