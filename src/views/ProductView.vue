<template>
    <div class="product-page">
      <HeaderComponent />
      
  
      <section class="container my-5">
        <div class=" p-4">
          <div class="row">
            <div class="col-md-4 d-flex justify-content-center">
              <img :src="produto.imagem" :alt="produto.nome" class="img-fluid product-image" />
            </div>
            <div class="col-md-8">
              <h2 class="fw-bold">{{ produto.nome }}</h2>
              <h4 class="text-success">R$ {{ produto.preco }}</h4>
              <p>{{ produto.descricao }}</p>
              <button class="btn btn-success">Adicionar ao carrinho</button>
            </div>
          </div>
        </div>
      </section>
  
      <section class="container my-5">
        <h4 class="fw-bold">Produtos Recomendados</h4>
        <div class="row mt-4">
          <ProductCard 
            v-for="(item, index) in produtosRecomendados" 
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
    components: {
      HeaderComponent,
      FooterComponent,
      ProductCard
    },
    setup() {
    
      const produto = ref({
        nome: 'Camiseta Tradicional Preta',
        preco: '23,00',
        descricao: 'Uma descrição detalhada do produto iria aqui.',
        imagem: 'https://m.media-amazon.com/images/I/41NXWPtQkcL._AC_SX679_.jpg' 
      });
  
      const produtosRecomendados = ref([
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
  
      return { produto, produtosRecomendados };
    }
  });
  </script>
  
  <style scoped>
  .product-card {
    background-color: #f8f9fa;
    border: none;
  }
  
  .product-image {
    max-width: 100%;
    border-radius: 5px;
  }
  </style>
  