import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios';

export const useProductStore = defineStore('product', () => {
  const products = ref([]);
  const sales = ref([]);
  const userId = ref<number | null>(null);

  async function fetchProducts() {
    try {
      const response = await api.get('/products?populate=*');
      products.value = response.data.data.map((product: any) => ({
        id: product.id,
        name: product.attributes.name,
        price: product.attributes.price,
        description: product.attributes.description,
        photos: product.attributes.photos?.data?.map((photo: any) => photo.url) || [],
        seller: product.attributes.seller?.data?.attributes?.username || "Desconhecido",
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }

  async function fetchSales() {
    try {
      const response = await api.get('/sales?populate=product');
      sales.value = response.data.data.map((sale: any) => ({
        id: sale.id,
        buyer: sale.attributes.buyer?.data?.attributes?.username || "Desconhecido",
        productName: sale.attributes.product?.data?.attributes?.name || "Produto removido",
        total: sale.attributes.product?.data?.attributes?.price || 0,
        date: sale.attributes.createdAt
      }));
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
    }
  }

  async function addProduct(name: string, price: number, description: string, images: File[]) {
    if (!userId.value) {
      console.error("Usuário não autenticado");
      return { success: false, message: "Usuário não autenticado" };
    }

    try {
      const formData = new FormData();
      images.forEach(image => formData.append("files", image));

      const uploadResponse = await api.post('/upload', formData);
      const uploadedPhotos = uploadResponse.data.map((file: any) => file.id);

      const response = await api.post('/products', {
        data: {
          name,
          price,
          description,
          photos: uploadedPhotos,
          seller: userId.value, 
        }
      });

      fetchProducts(); 
      return { success: true };
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      return { success: false, message: "Erro ao adicionar produto" };
    }
  }

  return { products, sales, fetchProducts, fetchSales, addProduct, userId };
});
