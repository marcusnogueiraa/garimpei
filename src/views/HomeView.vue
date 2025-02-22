<template>
  <div class="container-fluid bg-light min-vh-100 m-0 p-0">
    <HeaderComponent />

    <main class="bg-light">
      <div class="mural">
        <div class="bg-black-50 d-flex justify-content-center align-items-center">
          <div class="mural-content">
            <h1 class="fw-bold text-light">Moda Sustentável ao seu Alcance</h1>
            <p class="text-light">
              Descubra peças únicas em brechós selecionados. Compre e venda moda de segunda mão de forma fácil e sustentável.
            </p>
            <div class="d-flex gap-3 mt-3 justify-content-center align-items-center">
              <a href="#produtos" class="btn btn-success">Explorar Produtos</a>
              <button class="btn btn-outline-light">Comece a Vender</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="container my-5">
      <h4 class="fw-bold">Últimas Novidades</h4>
      <div class="row mt-4" id="produtos">
        <ProductCard 
          v-for="(item, index) in produtos" 
          :key="index" 
          :id="item.id"
          :nome="item.nome" 
          :seller="item.seller" 
          :preco="item.preco" 
          :imagem1="item.imagem1"
          :categoria="item.categoria"
          :descricao="item.descricao"
          class="col-md-3 mt-2"
        />
      </div>
    </section>

    <section class="container my-5">
      <h4 class="fw-bold">Vestidos</h4>
      <div class="row mt-4">
        <ProductCard 
          v-for="(item, index) in vestidos" 
          :key="index" 
          :id="item.id"
          :nome="item.nome" 
          :seller="item.seller" 
          :preco="item.preco" 
          :imagem1="item.imagem1"
          :categoria="item.categoria"
          :descricao="item.descricao"
          class="col-md-3 mt-2"
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
  name: 'HomePage',
  setup() {
    const produtos = ref([
      { 
        id: 'vestido-vintage-floral',
        nome: 'Vestido Vintage Floral', 
        seller: 'Maumau', 
        preco: 55.00,
        imagem1: 'https://m.media-amazon.com/images/I/51WYOCCy3sL._AC_.jpg',
        categoria: ['Brechó'], 
        descricao: 'Um vestido vintage floral elegante e confortável.'
      },
      { 
        id: 'blazer-elegante',
        nome: 'Blazer Elegante', 
        seller: 'Brechó Chic', 
        preco: 120.00,
        imagem1: 'https://img.ltwebstatic.com/images3_pi/2024/06/05/81/1717564315d787c6d841223e0f8717807f9e164fc1_thumbnail_405x.webp',
        categoria: ['Casual'], 
        descricao: 'Blazer elegante para um look sofisticado.'
      }
    ]);

    const vestidos = ref(produtos.value.filter(item => item.categoria.includes('Brechó')));
    
    return { produtos, vestidos };
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
  background: url('@/assets/mural.avif') no-repeat center center;
  background-size: cover;
  height: 600px;  
  display: flex;
  align-items: flex-end; 
  justify-content: center; 
  text-align: center;
  position: relative;
}

.bg-black-50 {
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
