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
            <h4 class="text-success">{{ produto?.preco }}</h4>
            <p>{{ produto?.descricao }}</p>
            <button class="btn btn-success" @click="adicionarAoCarrinho(produto)">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </section>

    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from '@/components/header/headerComponent.vue';
import FooterComponent from '@/components/footer/footerComponent.vue';
import { Produto } from '../types/interfaces';
import { useCartStore } from '@/store/cart';

export default defineComponent({
  components: {
    HeaderComponent,
    FooterComponent
  },
  setup() {
    const route = useRoute();
    const produto = ref<Produto | null>(null);
    const cartStore = useCartStore();
    const hover = ref(false);

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

    onMounted(() => {
      produto.value = produtoMock;
    });

    const adicionarAoCarrinho = (produto: Produto | null) => {
      if (produto) {
        cartStore.addCartItem(produto);
      }
    };

    return { produto, adicionarAoCarrinho, hover };
  }
});
</script>

<style scoped>
.product-image {
  max-width: 100%;
  height: auto;
  transition: opacity 0.3s ease-in-out;
}

.animate-spawn{
  animation: spawn .2s forwards;
}

@keyframes spawn {
    from{
      opacity: 0;
      transform: translateY(-8px);
    }
}
</style>
