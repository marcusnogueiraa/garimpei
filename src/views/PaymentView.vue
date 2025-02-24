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
              <input v-model.trim="form.nome" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Endereço</label>
              <input v-model.trim="form.endereco" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">CEP</label>
              <input v-model.trim="form.cep" type="text" class="form-control" required />
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

            <button type="submit" class="btn btn-success w-100 mt-3" :disabled="loading">
              {{ loading ? "Processando..." : "Finalizar Compra" }}
            </button>
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
import api from '@/api/axios'; 

export default defineComponent({
  name: 'CheckoutPage',
  components: { HeaderComponent, FooterComponent },
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();
    const loading = ref(false);

    const form = ref({
      nome: '',
      endereco: '',
      cep: '',
      pagamento: 'pix'
    });

    const cart = computed(() => cartStore.cart);
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

    const finalizarCompra = async () => {
      if (!form.value.nome || !form.value.endereco || !form.value.cep) {
        alert('Preencha todas as informações de entrega.');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.username) {
        alert('Usuário não autenticado. Faça login.');
        return;
      }

      loading.value = true;
      const token = localStorage.getItem("token");

      try {
        for (const item of cart.value) {
          console.log("Enviando venda:", {
            date: new Date().toISOString(),
            buyerUsername: user.username,  
            sellerUsername: item.seller.username,  
            total: item.price,
            paymentMethod: form.value.pagamento,
            address: form.value.endereco,
            productName: item.name
          });

          await api.put(`/products/${item.documentId}`, {
            data: { wasSold: true }
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          await api.post("/sales", {
            data: {
              date: new Date().toISOString(),
              buyerUsername: user.username,  
              sellerUsername: item.seller.username,  
              total: item.price,
              paymentMethod: form.value.pagamento,
              address: form.value.endereco,
              productName: item.name
            },
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          console.log(`Produto ${item.name} marcado como vendido e venda registrada.`);
        }

        alert('Compra realizada com sucesso! 🛒✅');
        cartStore.clearCart();
        router.push('/');
      } catch (error) {
        console.error("Erro ao finalizar compra:", error);
        alert('Erro ao processar a compra.');
      } finally {
        loading.value = false;
      }
    };



    return { cart, form, total, formatPrice, formatImage, finalizarCompra, loading };
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
