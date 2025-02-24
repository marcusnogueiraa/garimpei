<template>
  <div class="product-page">
    <HeaderComponent />
    <section class="container h-100 animate-spawn">
      <div class="p-4 product-container">
        <div v-if="loading" class="text-center">
          <span class="spinner-border text-success"></span>
          <p>Carregando Produto...</p>
        </div>

        <div v-else-if="!product" class="text-center">
          <p class="text-muted">Produto não encontrado.</p>
        </div>

        <div v-else class="row">
          <div class="col-md-4 d-flex justify-content-center">
            <img 
              :src="product.image1?.url ? `http://localhost:1337${product.image1.url}` : 'https://via.placeholder.com/200'"
              :alt="product?.name || 'Product'" 
              class="img-fluid product-image"
              @mouseover="hover = true" 
              @mouseleave="hover = false"
            />
          </div>
          <div class="col-md-8 text-start">  
            <h2 class="fw-bold">{{ product?.name }}</h2>
            <h4 class="text-success">Preço: {{ formatPrice(discountedPrice) }}</h4>
            <p v-if="discount > 0" class="text-muted">
              <s>Original: {{ formatPrice(product?.price ?? 0) }}</s> ({{ discount }}% OFF)
            </p>
            <p>{{ product?.description }}</p>

            <div class="coupon-container">
              <input v-model="couponCode" type="text" class="form-control" placeholder="Enter coupon code" />
              <button class="btn btn-primary" @click="applyCoupon">Aplicar</button>
            </div>
            <p v-if="couponMessage" class="text">{{ couponMessage }}</p>

            <button class="btn mt-3" 
              :class="isInCart ? 'btn-danger' : 'btn-success'" 
              @click="toggleCart">
              {{ isInCart ? "Remover do Carrinho" : "Adicionar ao Carrinho" }}
            </button>

          </div>
        </div>
      </div>
    </section>
    
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderComponent from "@/components/header/headerComponent.vue";
import FooterComponent from "@/components/footer/footerComponent.vue";
import { useCartStore } from "@/store/cart";
import { useCouponStore } from "@/store/coupon";
import { useProductStore } from "@/store/products";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
  components: { HeaderComponent, FooterComponent },
  setup() {
    const route = useRoute();
    const cartStore = useCartStore();
    const couponStore = useCouponStore();
    const productStore = useProductStore();
    const authStore = useAuthStore();
    
    const product = ref<any | null>(null);
    const hover = ref(false);
    const couponCode = ref("");
    const discount = ref(0);
    const couponMessage = ref("");
    const loading = ref(true);
    const user = authStore.getUser();

    const loadProduct = async () => {
      const productId = Number(route.params.id); 

      if (isNaN(productId)) {
        loading.value = false;
        return;
      }

      await productStore.fetchProductById(productId);

      if (productStore.product) {
        product.value = productStore.product;
      }

      loading.value = false;
    };

    onMounted(loadProduct);

    const applyCoupon = async () => {
      if (!user) {
        couponMessage.value = "Você precisa estar logado para usar um cupom.";
        return;
      }

      if (!product.value) {
        couponMessage.value = "Produto não encontrado.";
        return;
      }

      const result = await couponStore.validateCoupon(
        couponCode.value,
        user.id,
        product.value.seller.username
      );

      if (!result.valid) {
        couponMessage.value = result.message || "";
        return;
      }

      discount.value = result.discount ?? 0;
      couponMessage.value = "Cupom aplicado com sucesso!";
    };

    const discountedPrice = computed(() => {
      if (!product.value) return 0;
      return product.value.price * ((100 - discount.value) / 100);
    });

    const isInCart = computed(() => {
      return cartStore.cart.some(item => item.id === product.value?.id);
    });

    const toggleCart = () => {
      if (!product.value) return;

      if (isInCart.value) {
        cartStore.removeCartItem(product.value.id);
      } else {
        cartStore.addCartItem({ ...product.value, price: discountedPrice.value });
      }
    };

    const formatPrice = (price: number): string => {
      return price.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    };

    return {
      product,
      loading,
      hover,
      couponCode,
      applyCoupon,
      couponMessage,
      discount,
      discountedPrice,
      isInCart,
      toggleCart,
      formatPrice
    };
  },
});
</script>

<style scoped>

.product-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
}

.container {
  flex-grow: 1;
}

.product-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-image {
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease-in-out;
}

.coupon-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.animate-spawn {
  animation: spawn 0.2s forwards;
}

@keyframes spawn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>