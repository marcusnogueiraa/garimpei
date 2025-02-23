<template>
    <div class="manage-products">
      <div>
        <HeaderComponent />
      </div>
      <div>
        <section class="container h-100 my-5">
            <h2 class="fw-bold">Meus Produtos</h2>
      
            <div v-if="produtos.length === 0" class="text-center mt-4">
              <p>Você ainda não cadastrou produtos.</p>
            </div>
      
            <div v-else>
              <table class="table mt-4">
                <thead>
                  <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="produto in produtos" :key="produto.id">
                    <td>
                      <img :src="produto.imagem1" :alt="produto.nome" class="product-thumb" />
                    </td>
                    <td>{{ produto.nome }}</td>
                    <td>{{ formatPrice(produto.preco) }}</td>
                    <td>
                      <button class="btn btn-outline-primary btn-sm me-2" @click="editarProduto(produto.id)">Editar</button>
                      <button class="btn btn-outline-danger btn-sm" @click="confirmarRemocao(produto.id)">Remover</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
      </div>
    
      <div v-if="modalRemover" class="modal-backdrop">
        <div class="modal-content">
          <p>Tem certeza que deseja remover este produto?</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-danger" @click="removerProduto">Remover</button>
            <button class="btn btn-secondary" @click="modalRemover = false">Cancelar</button>
          </div>
        </div>
      </div>
  
      <FooterComponent />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import HeaderComponent from '@/components/header/headerComponent.vue';
  import FooterComponent from '@/components/footer/footerComponent.vue';
  import { Produto } from '../types/interfaces';
  
  export default defineComponent({
    components: {
      HeaderComponent,
      FooterComponent
    },
    setup() {
      const router = useRouter();
      const produtos = ref<Produto[]>([]);
      const modalRemover = ref(false);
      const produtoIdParaRemover = ref<string | null>(null);
        
      const produtosMock: Produto[] = [
        {
          id: "1",
          nome: "Tênis Esportivo X",
          preco: 299.99,
          imagem1: "https://via.placeholder.com/100",
          imagem2: "https://via.placeholder.com/100/cccccc",
          categoria: ["Tênis", "Esportivo"],
          seller: "Meu Loja",
          descricao: "Tênis confortável para prática esportiva.",
        },
        {
          id: "2",
          nome: "Bolsa Fashion",
          preco: 199.99,
          imagem1: "https://via.placeholder.com/100",
          imagem2: "",
          categoria: ["Bolsas"],
          seller: "Meu Loja",
          descricao: "Bolsa moderna e espaçosa.",
        }
      ];
  
      onMounted(() => {
        produtos.value = produtosMock;
      });
  
      const formatPrice = (price: number): string => {
        return price.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      };
  
      const editarProduto = (id: string) => {
        router.push(`/edit-product/${id}`);
      };
  
      const confirmarRemocao = (id: string) => {
        produtoIdParaRemover.value = id;
        modalRemover.value = true;
      };
  
      const removerProduto = () => {
        if (produtoIdParaRemover.value) {
          produtos.value = produtos.value.filter(p => p.id !== produtoIdParaRemover.value);
          modalRemover.value = false;
        }
      };
  
      return { produtos, formatPrice, editarProduto, confirmarRemocao, removerProduto, modalRemover };
    }
  });
  </script>
  
  <style scoped>
  .manage-products {
    min-height: 100vh;

    display: flex;
    flex-direction: column;

    justify-content: space-between;
  }
  
  .product-thumb {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    max-width: 720px;
    border-radius: 8px;
    text-align: center;
  }
  </style>
  