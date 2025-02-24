import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

export const useProductStore = defineStore('product', () => {
  const products = ref<any[]>([]);
  const product = ref<any | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts() {
    loading.value = true;
    try {
      const response = await api.get('/products?populate=*');
      if (!response.data || !response.data.data) {
        console.error("A resposta da API não contém a chave 'data'.", response);
        error.value = "Erro ao buscar produtos.";
        return;
      }

      console.log(response.data.data)
      products.value = response.data.data; 
      console.log("Produtos carregados:", products.value);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      error.value = 'Erro ao buscar produtos';
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductById(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/products?filters[id][$eq]=${id}&populate=*`);
  
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        console.error("Erro: Produto não encontrado.", response);
        error.value = "Produto não encontrado.";
        return;
      }
  
      product.value = response.data.data[0]; 
      console.log("Produto carregado:", product.value);
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      error.value = 'Erro ao buscar produto';
    } finally {
      loading.value = false;
    }
  }

  async function fetchProductByIdForEdit(id: string) {
    loading.value = true;
    try {
      const response = await api.get(`/products/${id}?populate=*`);
  
      console.log("Produto carregado:", response.data.data);
      product.value = response.data.data 
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      error.value = 'Erro ao buscar produto';
    } finally {
      loading.value = false;
    }
  }
  
  

  async function createProduct(newProduct: any) {
    loading.value = true;
    try {
      const response = await api.post('/products', { data: newProduct }, { headers: { ...getAuthHeader() } });
      products.value.push(response.data.data);
      console.log("Produto criado:", response.data.data);
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      error.value = 'Erro ao criar produto';
    } finally {
      loading.value = false;
    }
  }

  async function updateProduct(id: number, updatedProduct: any) {
    loading.value = true;
    try {
      const response = await api.put(`/products/${id}`, { data: updatedProduct }, { headers: { ...getAuthHeader() } });
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) products.value[index] = response.data.data;
      console.log("Produto atualizado:", response.data.data);
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      error.value = 'Erro ao atualizar produto';
    } finally {
      loading.value = false;
    }
  }

  async function deleteProduct(id: number) {
    loading.value = true;
    try {
      await api.delete(`/products/${id}`, { headers: { ...getAuthHeader() } });
      products.value = products.value.filter(p => p.id !== id);
      console.log(`Produto com ID ${id} excluído.`);
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      error.value = 'Erro ao excluir produto';
    } finally {
      loading.value = false;
    }
  }

  function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProductByIdForEdit
  };
});
