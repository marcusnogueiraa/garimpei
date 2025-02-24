<template>
  <div class="manage-products">
    <div>
      <HeaderComponent />
    </div>
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
                <img :src="`http://localhost:1337${produto.image1.url}`" :alt="produto.name" class="product-thumb" />
              </td>
              <td>{{ produto.name }}</td>
              <td>{{ formatPrice(produto.price) }}</td>
              <td>
                <button class="btn btn-outline-primary btn-sm me-2" @click="editarProduto(produto.documentId)">Editar</button>
                <button class="btn btn-outline-danger btn-sm" @click="confirmarRemocao(produto.documentId)">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
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
import { defineComponent, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import HeaderComponent from "@/components/header/headerComponent.vue"
import FooterComponent from "@/components/footer/footerComponent.vue"
import api from "@/api/axios"

export default defineComponent({
  components: {
    HeaderComponent,
    FooterComponent
  },
  setup() {
    const router = useRouter()
    const produtos = ref<any[]>([])
    const modalRemover = ref(false)
    const produtoIdParaRemover = ref<number | null>(null)

    const fetchProdutos = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        const token = localStorage.getItem("token")
        const response = await api.get("/products?populate=*", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log(response.data.data)

        const userProducts = response.data.data.filter((item: any) => {
          return item.seller.id === user.id
        })
        console.log(userProducts)
        return userProducts
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(async () => {
      const userProducts = await fetchProdutos()
      if (userProducts) {
        produtos.value = userProducts
      }
    })

    const formatPrice = (price: number): string => {
      return price.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
    }

    const editarProduto = (id: number) => {
      router.push(`/edit-product/${id}`)
    }

    const confirmarRemocao = (id: number) => {
      produtoIdParaRemover.value = id
      modalRemover.value = true
    }

    const removerProduto = async () => {
      if (produtoIdParaRemover.value !== null) {
        console.log(produtoIdParaRemover.value)
        try {
          const token = localStorage.getItem("token")
      
          const response = await api.delete(`/products/${produtoIdParaRemover.value}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        console.log(response)
          produtos.value = produtos.value.filter(p => p.documentId !== produtoIdParaRemover.value)
          modalRemover.value = false
        } catch (error) {
          console.error(error)
        }
      }
    }

    return {
      produtos,
      modalRemover,
      produtoIdParaRemover,
      formatPrice,
      editarProduto,
      confirmarRemocao,
      removerProduto
    }
  }
})
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
