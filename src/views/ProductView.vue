<template>
  <div class="product-page">
    <HeaderComponent />

    <section class="container my-5">
      <div class="p-4">
        <div class="row">
          <div class="col-md-4 d-flex justify-content-center">
            <img :src="produto?.imagem1" :alt="produto?.nome" class="img-fluid product-image" />
          </div>
          <div class="col-md-8">  
            <h2 class="fw-bold">{{ produto?.nome }}</h2>
            <h4 class="text-success">{{ produto?.preco }}</h4>
            <p>{{ produto?.descricao }}</p>
            <button class="btn btn-success" @click="adicionarAoCarrinho(produto)">Adicionar ao carrinho</button>
          </div>
        </div>
        <div class="mt-5">
          <h4>Avaliações</h4>
          <div v-if="produto?.avaliacoes && produto.avaliacoes.length">
            <div v-for="avaliacao in produto.avaliacoes" :key="avaliacao.buyer" class="mb-3">
              <p><strong>{{ avaliacao.buyer }}</strong> - Nota: {{ avaliacao.nota }}</p>
              <p>{{ avaliacao.comentario }}</p>
            </div>
          </div>
          <div v-else>
            <p>Este produto ainda não possui avaliações.</p>
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

    const fetchProduto = async (id: number) => {
      // Substitua pelo seu método de busca, por exemplo, uma chamada HTTP para sua API
      const response = await fetch(`/api/produtos/${id}`);
      if (response.ok) {
        produto.value = await response.json();
      }
    };

    onMounted(() => {
      const produtoId = Number(route.params.id);
      if (!isNaN(produtoId)) {
        fetchProduto(produtoId);
      }
    });

    const adicionarAoCarrinho = (produto: Produto | null) => {
      if (produto) {
        cartStore.addCartItem(produto);
      }
    };

    return { produto, adicionarAoCarrinho };
  }
});
</script>

<style scoped>
.product-image {
  max-width: 100%;
  height: auto;
}
</style>
