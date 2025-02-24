<template>
  <div class="vh-100 d-flex flex-column position-relative">
    <HeaderComponent />
    <main class="container my-5 animate-spawn">
      <h2 class="fw-bold text-center">Vender Produto</h2>
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

            <div class="row">
              <label class="form-label">Preço (R$)</label>
              <input v-model.number="produto.price" type="number" class="form-control" required min="1" />
            </div>

            <div class="mb-3">
              <label class="form-label">Tags</label>
              <select v-model="produto.tags" class="form-control" required>
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
                  <img v-if="produto.image1" :src="produto.image1.url" class="preview-img" />
                </div>
                <div class="image-box">
                  <input type="file" class="form-control" @change="handleImageUpload($event, 'image2')" accept="image/*" />
                  <img v-if="produto.image2" :src="produto.image2.url" class="preview-img" />
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-success w-100" :disabled="!formValido">
              Publicar Produto
            </button>
          </form>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import HeaderComponent from "@/components/header/headerComponent.vue";
import FooterComponent from "@/components/footer/footerComponent.vue";
import { ProductCategory } from "@/types/interfaces";
import api from "@/api/axios";

export default defineComponent({
  name: "SellProduct",
  components: { HeaderComponent, FooterComponent },
  setup() {
    const router = useRouter();

    const produto = ref({
      name: "",
      description: "",
      price: 0,
      tags: "" as ProductCategory,
      wasSold: false,
      image1: null as { url: string } | null,
      image2: null as { url: string } | null,
    });

    const productCategories = Object.values(ProductCategory);

    const formValido = computed(() => {
      return (
        produto.value.name.trim() !== "" &&
        produto.value.description.trim() !== "" &&
        produto.value.price > 0 &&
        produto.value.tags !== undefined
      );
    });

    const handleImageUpload = (event: Event, key: "image1" | "image2") => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            produto.value[key] = { url: e.target.result as string };
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const createProduct = async () => {
      try {
        const formData = new FormData();

        formData.append("name", produto.value.name);
        formData.append("description", produto.value.description);
        formData.append("price", produto.value.price.toString());
        formData.append("tags", produto.value.tags);
        formData.append("wasSold", produto.value.wasSold.toString());

        if (produto.value.image1 && produto.value.image1.url) {
          const file = await urlToFile(produto.value.image1.url, "image1.jpg");
          formData.append("files.image1", file);
        }

        if (produto.value.image2 && produto.value.image2.url) {
          const file = await urlToFile(produto.value.image2.url, "image2.jpg");
          formData.append("files.image2", file);
        }

        const response = await api.post("/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log(response);
        alert("Produto cadastrado com sucesso!");
        router.push("/manage-products");
      } catch (error) {
        console.error("Erro ao criar produto:", error);
        alert("Erro ao cadastrar produto.");
      }
    };

    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const res = await fetch(url);
      const blob = await res.blob();
      return new File([blob], filename, { type: blob.type });
    };

    const submitForm = async () => {
      if (!formValido.value) {
        alert("Preencha todos os campos corretamente antes de submeter.");
        return;
      }
      await createProduct();
    };

    return { produto, productCategories, formValido, handleImageUpload, submitForm };
  },
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

.animate-spawn {
  animation: spawn 0.2s forwards;
}

@keyframes spawn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
}
</style>
