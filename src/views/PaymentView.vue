<template>
  <div class="checkout-container">
    <HeaderComponent />

    <div class="container my-5">
      <h2 class="fw-bold text-center">Finalizar Compra</h2>
      
      <div class="row mt-4">
        <div class="col-md-6">
          <h4 class="fw-bold">Itens no Carrinho</h4>
          <div v-if="cart.length === 0">
            <p>Seu carrinho está vazio.</p>
          </div>
          <div v-else>
            <div v-for="item in cart" :key="item.id" class="cart-item">
              <img :src="formatImage(item.image1)" :alt="item.name" class="cart-image" />
              <div>
                <h5>{{ item.name }}</h5>
                <p class="fw-bold">{{ formatPrice(item.price) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <h4 class="fw-bold">Informações de Entrega</h4>
          <form @submit.prevent="finalizarCompra">
            <div class="mb-3">
              <label class="form-label">Nome Completo</label>
              <input v-model="form.nome" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Endereço</label>
              <input v-model="form.endereco" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">CEP</label>
              <input v-model="form.cep" type="text" class="form-control" required />
            </div>

            <h4 class="fw-bold mt-4">Pagamento</h4>
            <div class="mb-3">
              <label class="form-label">Método de Pagamento</label>
              <select v-model="form.pagamento" class="form-control" required>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de Crédito</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>

            <h5 class="fw-bold mt-4">Resumo do Pedido</h5>
            <p><strong>Total:</strong> {{ formatPrice(total) }}</p>

            <button type="submit" class="btn btn-success w-100 mt-3">Finalizar Compra</button>
          </form>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/store/cart';
import HeaderComponent from '@/components/header/headerComponent.vue';
import FooterComponent from '@/components/footer/footerComponent.vue';
import { Produto } from '@/types/interfaces';

export default defineComponent({
  name: 'CheckoutPage',
  components: { HeaderComponent, FooterComponent },
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();

    const form = ref({
      nome: '',
      endereco: '',
      cep: '',
      pagamento: 'pix'
    });

    const cart = computed(() => cartStore.cart as Produto[]);
    const total = computed(() => cartStore.cart.reduce((acc, item) => acc + item.price, 0));

    const formatPrice = (price: number) => {
      return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    };

    const formatImage = (image: string | { url?: string }) => {
      if (typeof image === 'string') return image;
      return image?.url ? `http://localhost:1337${image.url}` : 'https://via.placeholder.com/100';
    };

    const finalizarCompra = () => {
      if (!form.value.nome || !form.value.endereco || !form.value.cep) {
        alert('Preencha todas as informações de entrega.');
        return;
      }

      alert('Compra realizada com sucesso! 🛒✅');
      cartStore.clearCart();
      router.push('/');
    };

    return { cart, form, total, formatPrice, formatImage, finalizarCompra };
  }
});
</script>

<style scoped>
.checkout-container {
  min-height: 100vh;
  background: #f8f9fa;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.cart-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}
</style>
