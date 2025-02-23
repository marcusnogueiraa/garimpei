<template>
  <div class="product-page">
    <HeaderComponent />

    <section class="container my-5 animate-spawn">
      <div class="p-4">
        <div class="row">
          <div class="col-md-4 d-flex justify-content-center">
            <img 
              :src="hover && produto?.imagem2 ? produto?.imagem2 : produto?.imagem1" 
              :alt="produto?.nome" 
              class="img-fluid product-image"
              @mouseover="hover = true" 
              @mouseleave="hover = false"
            />
          </div>
          <div class="col-md-8">  
            <h2 class="fw-bold">{{ produto?.nome }}</h2>
            <h4 class="text-success">Preço: {{ formatPrice(precoComDesconto) }}</h4>
            <p v-if="desconto > 0" class="text-muted">
              <s>Original: {{ formatPrice(produto?.preco ?? 0) }}</s> ({{ desconto }}% OFF)
            </p>

            <p>{{ produto?.descricao }}</p>

            <div>
              <div class="cupom-container">
                <input v-model="cupomDigitado" type="text" class="form-control" placeholder="Digite o cupom" />
                <button class="btn btn-primary" @click="aplicarCupom">Aplicar</button>
              </div>
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
import { defineComponent, ref, computed } from "vue";
import { useRoute } from "vue-router";
import HeaderComponent from "@/components/header/headerComponent.vue";
import FooterComponent from "@/components/footer/footerComponent.vue";
import { Produto } from "../types/interfaces";
import { useCartStore } from "@/store/cart";
import { useCouponStore } from "@/store/coupon";
import { useAuthStore } from "@/store/auth"; 

export default defineComponent({
  components: { HeaderComponent, FooterComponent },
  setup() {
    const route = useRoute();
    const produto = ref<Produto | null>(null);
    const cartStore = useCartStore();
    const couponStore = useCouponStore();
    const authStore = useAuthStore();

    const hover = ref(false);
    const cupomDigitado = ref("");
    const desconto = ref(0);
    const mensagemCupom = ref("");

    const user = authStore.getUser();
    
    // Simulando um produto (mock)
    const produtoMock: Produto = {
      id: "12345",
      nome: "Tênis Esportivo X",
      preco: 299.99,
      imagem1: "https://preview.redd.it/lu8nhkt27anb1.jpg?auto=webp&s=fc33f9f515e7c8dceca7828cddf4941390962095",
      imagem2: "https://cdn-images.dzcdn.net/images/artist/ee3e58cbff48a6e1f47b0e21ff66ee95/1900x1900-000000-80-0-0.jpg",
      categoria: ["Tênis", "Esportivo"],
      seller: "Loja Oficial XYZ",
      descricao: "Tênis confortável para prática esportiva. Leve e resistente.",
    };

    produto.value = produtoMock;

    const aplicarCupom = () => {
      if (!user) {
        mensagemCupom.value = "Você precisa estar logado para usar um cupom.";
        return;
      }

      const resultado = couponStore.validateCoupon(cupomDigitado.value, user.id);
      if (resultado.valid) {
        desconto.value = resultado.discount ?? 0; // Garante que desconto sempre tenha um número
        mensagemCupom.value = "Cupom aplicado com sucesso!";
      } else {
        mensagemCupom.value = resultado.message ?? '';
      }

    };

    const precoComDesconto = computed(() => {
      if (!produto.value) return 0;
      return produto.value.preco * ((100 - desconto.value) / 100);
    });

    const adicionarAoCarrinho = (produto: Produto | null) => {
      if (produto) {
        cartStore.addCartItem({ ...produto, preco: precoComDesconto.value });
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
.product-image {
  max-width: 100%;
  height: auto;
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
