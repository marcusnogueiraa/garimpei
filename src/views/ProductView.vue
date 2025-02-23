<template>
  <div class="product-page">
    <div>
      <HeaderComponent />
    </div>

    <section class="container my-5 h-100 animate-spawn">
      <div class="p-4">
        <div v-if="loading" class="text-center">
          <span class="spinner-border text-success"></span>
          <p>Carregando produto...</p>
        </div>


        <div v-else-if="!produto" class="text-center">
          <p class="text-muted">Produto não encontrado.</p>
        </div>

        <div v-else class="row">
          <div class="col-md-4 d-flex justify-content-center">
            <img 
              :src="`http://localhost:1337${produto.image1.url}`" 
              :alt="produto?.name" 
              class="img-fluid product-image"
              @mouseover="hover = true" 
              @mouseleave="hover = false"
            />
          </div>
          <div class="col-md-8">  
            <h2 class="fw-bold">{{ produto?.name }}</h2>
            <h4 class="text-success">Preço: {{ formatPrice(precoComDesconto) }}</h4>
            <p v-if="desconto > 0" class="text-muted">
              <s>Original: {{ formatPrice(produto?.price ?? 0) }}</s> ({{ desconto }}% OFF)
            </p>
            <p>{{ produto?.description }}</p>


            <div class="cupom-container">
              <input v-model="cupomDigitado" type="text" class="form-control" placeholder="Digite o cupom" />
              <button class="btn btn-primary" @click="aplicarCupom">Aplicar</button>
            </div>
            <p v-if="mensagemCupom" class="text">{{ mensagemCupom }}</p>


            <button class="btn btn-success mt-3" @click="adicionarAoCarrinho(produto)">Adicionar ao carrinho</button>
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
    
    const produto = ref<any | null>(null);
    const hover = ref(false);
    const cupomDigitado = ref("");
    const desconto = ref(0);
    const mensagemCupom = ref("");
    const loading = ref(true);
    const user = authStore.getUser();

    console.log("Página carregada, verificando parâmetros...");
    console.log("ID do produto na rota:", route.params.id);

    const carregarProduto = async () => {
      const productId = Number(route.params.id); 

      if (isNaN(productId)) {
        console.error("ID inválido na URL");
        loading.value = false;
        return;
      }

      console.log("Buscando produto com ID:", productId);
      
      await productStore.fetchProductById(productId);
      
      console.log("Produto retornado da store:", productStore.product);

      if (productStore.product) {
        produto.value = productStore.product;
        console.log("Produto carregado:", produto.value);
      } else {
        console.error("Produto não encontrado.");
      }

      loading.value = false;
    };

    onMounted(carregarProduto);

    const aplicarCupom = () => {
      if (!user) {
        mensagemCupom.value = "Você precisa estar logado para usar um cupom.";
        return;
      }

      const resultado = couponStore.validateCoupon(cupomDigitado.value, user.id);
      if (resultado.valid) {
        desconto.value = resultado.discount ?? 0; 
        mensagemCupom.value = "Cupom aplicado com sucesso!";
      } else {
        mensagemCupom.value = resultado.message ?? '';
      }
    };

    const precoComDesconto = computed(() => {
      if (!produto.value) return 0;
      return produto.value.price * ((100 - desconto.value) / 100);
    });

    const adicionarAoCarrinho = (produto: any) => {
      if (produto) {
        cartStore.addCartItem({ ...produto, price: precoComDesconto.value });
      }
    };

    const formatPrice = (price: number): string => {
      return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    return {
      produto,
      loading,
      adicionarAoCarrinho,
      hover,
      cupomDigitado,
      aplicarCupom,
      mensagemCupom,
      desconto,
      precoComDesconto,
      formatPrice
    };
  },
});
</script>

<style scoped>
.product-page{
  min-height: 100dvh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-image {
  max-width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: opacity 0.3s ease-in-out;
}

.cupom-container {
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
