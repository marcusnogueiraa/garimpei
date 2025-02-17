<template>
  <div class="container-fluid bg-light min-vh-100 m-0 p-0">
    <HeaderComponent />

    <main class="bg-light">
      <div class="mural">
        <div class="bg-black-50 d-flex justify-content-center align-items-center ">
          <div class="mural-content">
            <h1 class="fw-bold text-light">Moda Sustentável ao seu Alcance</h1>
            <p class="text-light">
              Descubra peças únicas em brechós selecionados. Compre e venda moda de segunda mão de forma fácil e sustentável.
            </p>
            <div class="d-flex gap-3 mt-3 justify-content-center align-items-center">
              <button class="btn btn-success">Explorar Produtos</button>
              <button class="btn btn-outline-light">Abrir sua Loja</button>
            </div>
          </div>
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
          class="mt-2"
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
.mural {
  background: url(../assets/mural.avif) no-repeat center center;
  
  background-size: cover;
  height: 500px;  
  display: flex;
  align-items: flex-end; 
  justify-content: center; 
  text-align: center;
  position: relative;
}

.bg-black-50{
  height: 100%;
  width: 100%;

  background-color: rgba(0, 0, 0, 0.589);
}

.mural-content {
  max-width: 600px; 
}

.mural h1 {
  font-size: 2.5rem; 
  margin-bottom: 1rem; 
}

.mural p {
  font-size: 1.2rem; 
  margin-bottom: 1.5rem;  
}

.mural .btn {
  font-size: 1rem; 
  padding: 10px 20px; 
}
</style>