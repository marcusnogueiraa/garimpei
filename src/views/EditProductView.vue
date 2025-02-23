<template>
    <div class="vh-100 d-flex flex-column position-relative">
      <HeaderComponent />
      <main class="container my-5">
        <h2 class="fw-bold text-center">Editar Produto</h2>
        <div class="d-flex justify-content-between gap-4">
            <div class="only-desktop image-content">
                <img src="../assets/sell.svg" class="h-75 w-100" />
            </div>
            <div class="card p-4 shadow-sm">
                <form @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label class="form-label">Nome do Produto</label>
                    <input v-model="produto.nome" type="text" class="form-control" required />
                  </div>
        
                  <div class="mb-3">
                    <label class="form-label">Descrição</label>
                    <textarea v-model="produto.descricao" class="form-control" rows="3" required></textarea>
                  </div>
        
                  <div class="row">
                      <label class="form-label">Preço (R$)</label>
                      <input v-model.number="produto.preco" type="number" class="form-control" required min="1" />    
                  </div>
        
                  <div class="mb-3">
                    <label class="form-label">Categorias</label>
                    <input type="text" v-model="categoriaInput" class="form-control" @keyup.enter.prevent="addCategoria" placeholder="Digite uma categoria e pressione Enter" />
                    <div class="category-tags mt-2">
                      <span v-for="(cat, index) in produto.categoria" :key="index" class="badge bg-secondary me-2">
                        {{ cat }} <span @click="removeCategoria(index)" class="ms-1 text-light" style="cursor:pointer;">×</span>
                      </span>
                    </div>
                  </div>
        
                  <div class="mb-3">
                    <label class="form-label">Imagens do Produto</label>
                    <div class="image-upload-container">
                      <div class="image-box">
                        <input type="file" class="form-control" @change="handleImageUpload($event, 'imagem1')" accept="image/*" />
                        <img v-if="produto.imagem1" :src="produto.imagem1" class="preview-img" />
                      </div>
                      <div class="image-box">
                        <input type="file" class="form-control" @change="handleImageUpload($event, 'imagem2')" accept="image/*" />
                        <img v-if="produto.imagem2" :src="produto.imagem2" class="preview-img" />
                      </div>
                    </div>
                  </div>
    
                  <div class="d-flex gap-3">
                    <button type="submit" class="btn btn-success w-100" :disabled="!formValido">Salvar Alterações</button>
                    <button type="button" class="btn btn-outline-danger w-100" @click="cancelarEdicao">Cancelar</button>
                  </div>
                </form>
              </div>
        </div>
      </main>
      <FooterComponent />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import HeaderComponent from '@/components/header/headerComponent.vue';
  import FooterComponent from '@/components/footer/footerComponent.vue';
  import { Produto } from '../types/interfaces';

  export default defineComponent({
    name: 'EditProduct',
    components: { HeaderComponent, FooterComponent },
    setup() {
      const route = useRoute();
      const router = useRouter();
      
      const produto = ref<Produto>({
        id: '',
        nome: '',
        descricao: '',
        preco: 0,
        categoria: [],
        imagem1: '',
        imagem2: '',
        seller: 'Meu Loja'
      });

      const categoriaInput = ref('');

    
      const produtoMock: Produto = {
        id: "1",
        nome: "Tênis Esportivo X",
        preco: 299.99,
        imagem1: "https://via.placeholder.com/150",
        imagem2: "https://via.placeholder.com/150/cccccc",
        categoria: ["Tênis", "Esportivo"],
        seller: "Meu Loja",
        descricao: "Tênis confortável para prática esportiva.",
      };

      
      onMounted(() => {
        const produtoId = route.params.id as string;


        if (produtoId === produtoMock.id) {
          produto.value = { ...produtoMock };
        }
      });

      const addCategoria = () => {
        if (categoriaInput.value.trim() && produto.value.categoria.length < 5) {
          produto.value.categoria.push(categoriaInput.value.trim());
          categoriaInput.value = '';
        }
      };

      const removeCategoria = (index: number) => {
        produto.value.categoria.splice(index, 1);
      };

      const formValido = computed(() => {
        return (
          produto.value.nome.trim() !== '' &&
          produto.value.descricao.trim() !== '' &&
          produto.value.preco > 0 &&
          produto.value.categoria.length > 0
        );
      });

      const handleImageUpload = (event: Event, key: 'imagem1' | 'imagem2') => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target) produto.value[key] = e.target.result as string;
          };
          reader.readAsDataURL(file);
        }
      };

      const submitForm = () => {
        if (!formValido.value) return;
        console.log('Produto atualizado:', produto.value);
        alert('Produto atualizado com sucesso!');
        router.push('/manage-products');
      };

      const cancelarEdicao = () => {
        router.push('/manage-products');
      };

      return { produto, categoriaInput, addCategoria, removeCategoria, formValido, handleImageUpload, submitForm, cancelarEdicao };
    }
  });
  </script>
  
  <style scoped>
  textarea {
    resize: none;
  }

  .image-content {
    display: flex;
    align-items: center;    
  }

  .card {
    max-width: 600px;
    margin: auto;
  }

  .category-tags {
    display: flex;
    flex-wrap: wrap;
  }
  
  .image-upload-container {
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }
  
  .image-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .preview-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ccc;
    margin-top: 5px;
  }

  @media (max-width: 1000px) {
    .only-desktop {
      display: none;
    }
  }
  </style>
