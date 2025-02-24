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
              <input v-model="produto.name" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Descrição</label>
              <textarea v-model="produto.description" class="form-control" rows="3" required></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Preço (R$)</label>
              <input v-model.number="produto.price" type="number" class="form-control" required min="1" />
            </div>

            <div class="mb-3">
              <label class="form-label">Categoria</label>
              <select v-model="produto.tags" class="form-select" required>
                <option disabled value="">Selecione uma categoria</option>
                <option v-for="category in productCategories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Imagens do Produto</label>
              <div class="image-upload-container">
                <div class="image-box">
                  <input type="file" class="form-control" @change="handleImageUpload($event, 'image1')" accept="image/*" />
                  <img v-if="produto.image1" :src="produto.image1" class="preview-img" />
                </div>
                <div class="image-box">
                  <input type="file" class="form-control" @change="handleImageUpload($event, 'image2')" accept="image/*" />
                  <img v-if="produto.image2" :src="produto.image2" class="preview-img" />
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
import { Produto, ProductCategory } from '../types/interfaces';
import { useProductStore } from '@/store/products';

export default defineComponent({
  name: 'EditProduct',
  components: { HeaderComponent, FooterComponent },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const productStore = useProductStore();
    const produto = ref<Produto>({
      id: 0,
      documentId: '',
      name: '',
      description: '',
      price: 0,
      wasSold: false,
      tags: ProductCategory.ROUPAS,
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
      image1: '',
      image2: '',
    });

    const productCategories = Object.values(ProductCategory);

    onMounted(async () => {
      const produtoId = Number(route.params.id);
      if (!produtoId) {
        router.push('/manage-products');
        return;
      }

      await productStore.fetchProductById(produtoId);
      if (productStore.product) {
        produto.value = { ...productStore.product };
      }
    });

    const formValido = computed(() => {
      return (
        produto.value.name.trim() !== '' &&
        produto.value.description.trim() !== '' &&
        produto.value.price > 0 
      );
    });

    const handleImageUpload = (event: Event, key: 'image1' | 'image2') => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) produto.value[key] = e.target.result as string;
        };
        reader.readAsDataURL(file);
      }
    };

    const submitForm = async () => {
      if (!formValido.value) return;
      try {
        await productStore.updateProduct(produto.value.id, produto.value);
        alert('Produto atualizado com sucesso!');
        router.push('/manage-products');
      } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        alert('Erro ao atualizar produto.');
      }
    };

    const cancelarEdicao = () => {
      router.push('/manage-products');
    };

    return { produto, productCategories, formValido, handleImageUpload, submitForm, cancelarEdicao };
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
