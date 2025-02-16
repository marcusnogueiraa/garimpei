<template>
  <div class="container-fluid bg-light min-vh-100 m-0 p-0">
    <HeaderComponent/>

    <main class="text-center py-5 bg-light vh-90 d-grid align-items-center justify-content-center">
      <div>
        <h1 class="fw-bold">Moda Sustentável ao seu Alcance</h1>
        <p class="text-muted">
          Descubra peças únicas em brechós selecionados. Compre e venda moda de segunda mão de forma fácil e sustentável.
        </p>
        <div class="d-flex justify-content-center gap-3 mt-3">
          <button class="btn btn-success">Explorar Produtos</button>
          <button class="btn btn-outline-secondary">Abrir sua Loja</button>
        </div>
      </div>
    </main>

    <section class="container my-5">
      <h4 class="fw-bold">Produtos</h4>
      <div class="row mt-4">
        <ProductCard 
            v-for="(item, index) in produtos" 
            :key="index" 
            :nome="item.nome" 
            :categoria="item.categoria" 
            :preco="item.preco" 
            :imagem="item.imagem"
          />
      </div>
    </section>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import HeaderComponent from '@/components/header/headerComponent.vue';
import FooterComponent from '@/components/footer/footerComponent.vue';
import ProductCard from '@/components/card/productCard.vue';

export default defineComponent({
  name: 'HeaderContent',
  setup() {
    const produtos = ref([
      { 
            nome: 'Vestido Vintage Floral', 
            categoria: 'Brechó', 
            preco: 'R$ 55,00',
            imagem: 'https://m.media-amazon.com/images/I/51WYOCCy3sL._AC_.jpg' 
        },
        { 
            nome: 'Vestido Vintage Floral', 
            categoria: 'Brechó', 
            preco: 'R$ 55,00',
            imagem: 'https://m.media-amazon.com/images/I/51WYOCCy3sL._AC_.jpg' 
        },
        { 
            nome: 'Vestido Vintage Floral', 
            categoria: 'Brechó', 
            preco: 'R$ 55,00',
            imagem: 'https://m.media-amazon.com/images/I/51WYOCCy3sL._AC_.jpg' 
        },
        { 
            nome: 'Vestido Vintage Floral', 
            categoria: 'Brechó', 
            preco: 'R$ 55,00',
            imagem: 'https://m.media-amazon.com/images/I/51WYOCCy3sL._AC_.jpg' 
        },
    ]);
    return { produtos };
  },
  components: {
      HeaderComponent,
      ProductCard,
      FooterComponent,
    },
});
</script>

<style scoped>
.placeholder-image {
  width: 100%;
  height: 150px;
  background: #e9ecef;
  border-radius: 5px;
}
</style>
