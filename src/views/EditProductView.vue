<template>
  <div class="vh-100 d-flex flex-column position-relative">
    <HeaderComponent />
    <main class="container my-5 animate-spawn">
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
                  <input
                    type="file"
                    class="form-control"
                    @change="handleImageUpload($event, 'image1')"
                    accept="image/*"
                  />
                  <img v-if="produto.image1" :src="produto.image1" class="preview-img" />
                </div>
                <div class="image-box">
                  <input
                    type="file"
                    class="form-control"
                    @change="handleImageUpload($event, 'image2')"
                    accept="image/*"
                  />
                  <img v-if="produto.image2" :src="produto.image2" class="preview-img" />
                </div>
              </div>
            </div>
            <button type="submit" class="btn btn-success w-100" :disabled="!formValido">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </main>
    <FooterComponent />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import HeaderComponent from "@/components/header/headerComponent.vue"
import FooterComponent from "@/components/footer/footerComponent.vue"
import { ProductCategory } from "@/types/interfaces"
import api from "@/api/axios"

export default defineComponent({
  name: "EditProduct",
  components: { HeaderComponent, FooterComponent },
  setup() {
    const router = useRouter()
    const route = useRoute()

    // Dados do produto (estado local)
    const produto = ref({
      id: 0,
      name: "",
      description: "",
      price: 0,
      tags: "",
      wasSold: false,
      image1: null as string | null,
      image2: null as string | null,
      documentId: ''
    })

    // Categorias disponíveis
    const productCategories = Object.values(ProductCategory)

    // Captura dos arquivos selecionados (para envio no PUT)
    let file1: File | null = null
    let file2: File | null = null

    // Busca dados do produto para edição ao montar a página
    onMounted(async () => {
      const produtoId = route.params.id
      console.log(route.params.id)
      
      if (!produtoId) {
        router.push("/my-products")
        return
      }
      // Busca o produto no Strapi
      const token = localStorage.getItem("token")
      try {
        const response = await api.get(`/products/${produtoId}?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = response.data.data
        if (!data) {
          router.push("/my-products")
          return
        }
        // Ajusta estado local
        produto.value.id = data.id
        produto.value.name = data.name
        produto.value.description = data.description
        produto.value.price = data.price
        produto.value.tags = data.tags
        // Exibir imagens atuais (caso existam)
        const img1 = data.image1?.data?.[0]?.url
        const img2 = data.image2?.data?.[0]?.url
        produto.value.image1 = img1 ? "http://localhost:1337" + img1 : null
        produto.value.image2 = img2 ? "http://localhost:1337" + img2 : null
        produto.value.documentId = data.documentId

        console.log(produto.value)
      } catch (error) {
        console.error("Erro ao buscar produto:", error)
        router.push("/my-products")
      }
    })

    // Validações mínimas
    const formValido = computed(() => {
      return (
        produto.value.name.trim() !== "" &&
        produto.value.description.trim() !== "" &&
        produto.value.price > 0 &&
        produto.value.tags !== ""
      )
    })


    const handleImageUpload = (event: Event, key: "image1" | "image2") => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        
        if (key === "image1") file1 = file
        if (key === "image2") file2 = file

        
        const reader = new FileReader()
        reader.onload = e => {
          if (e.target) {
            produto.value[key] = e.target.result as string
          }
        }
        reader.readAsDataURL(file)
      }
    }


    const urlToFile = async (url: string, filename: string): Promise<File> => {
      const res = await fetch(url)
      const blob = await res.blob()
      return new File([blob], filename, { type: blob.type })
    }

    
    const uploadImage = async (file: File): Promise<number> => {
      const formData = new FormData()
      formData.append("files", file)
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      return response.data[0].id
    }

    // Atualiza o produto (PUT)
    const updateProduct = async () => {
      // Se tiver imagens novas, subimos primeiro
      let image1Id: number | undefined
      let image2Id: number | undefined
      if (file1) {
        image1Id = await uploadImage(file1)
      }
      if (file2) {
        image2Id = await uploadImage(file2)
      }
      // Montamos o objeto data com IDs das imagens se existirem
      const dataToSend: any = {
        name: produto.value.name,
        description: produto.value.description,
        price: produto.value.price,
        tags: produto.value.tags,
        wasSold: produto.value.wasSold
      }
      if (image1Id !== undefined) {
        dataToSend.image1 = image1Id
      }
      if (image2Id !== undefined) {
        dataToSend.image2 = image2Id
      }
      const token = localStorage.getItem("token")
      await api.put(
        `/products/${produto.value.documentId}`,
        { data: dataToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
    }

    const submitForm = async () => {
      if (!formValido.value) {
        alert("Preencha todos os campos corretamente antes de submeter.")
        return
      }
      try {
        await updateProduct()
        router.push("/my-products")
      } catch (error) {
        console.error("Erro ao atualizar produto:", error)
        alert("Erro ao atualizar produto.")
      }
    }

    return {
      produto,
      productCategories,
      formValido,
      handleImageUpload,
      submitForm
    }
  }
})
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
