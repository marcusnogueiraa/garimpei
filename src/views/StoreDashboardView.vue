<script setup>
import sellerHeaderComponent from "@/components/header/sellerHeaderComponent.vue"
import { ref, onMounted } from 'vue'

// Estados locais
const products = ref([])
const coupons = ref([])
const sales = ref([])

const newProduct = ref({ name: '', price: '', quantity: '' })
const newCoupon = ref({ code: '', discount: '' })

// Mock de busca de dados (substituir por API futuramente)
const fetchProducts = async () => {
  products.value = [
    { id: 1, name: 'Camiseta Vintage', price: 50, quantity: 10 },
    { id: 2, name: 'Calça Jeans', price: 80, quantity: 5 }
  ]
}

const fetchCoupons = async () => {
  coupons.value = [
    { id: 1, code: 'DESCONTO10', discount: 10 },
    { id: 2, code: 'FRETEGRATIS', discount: 100 }
  ]
}

const fetchSales = async () => {
  sales.value = [
    { id: 1, client: 'Ana Souza', total: 150, date: '2025-02-10' },
    { id: 2, client: 'Carlos Lima', total: 80, date: '2025-02-12' }
  ]
}

// Função para adicionar um produto
const addProduct = () => {
  if (!newProduct.value.name || !newProduct.value.price) return
  products.value.push({ id: Date.now(), ...newProduct.value })
  newProduct.value = { name: '', price: '', quantity: '' }
}

// Função para remover um produto
const removeProduct = (id) => {
  products.value = products.value.filter(product => product.id !== id)
}

// Função para adicionar um cupom
const addCoupon = () => {
  if (!newCoupon.value.code || !newCoupon.value.discount) return
  coupons.value.push({ id: Date.now(), ...newCoupon.value })
  newCoupon.value = { code: '', discount: '' }
}

// Função para remover um cupom
const removeCoupon = (id) => {
  coupons.value = coupons.value.filter(coupon => coupon.id !== id)
}

// Carregar os dados quando o componente for montado
onMounted(() => {
  fetchProducts()
  fetchCoupons()
  fetchSales()
})
</script>

<template>
  <sellerHeaderComponent/>
  <div class="container mt-4">
    <h2>📦 Gerenciar Produtos</h2>

    <div class="input-group mb-3">
      <input v-model="newProduct.name" class="form-control" placeholder="Nome do Produto" />
      <input v-model="newProduct.price" type="number" class="form-control" placeholder="Preço" />
      <input v-model="newProduct.quantity" type="number" class="form-control" placeholder="Quantidade" />
      <button class="btn btn-success" @click="addProduct">Adicionar</button>
    </div>

    <ul class="list-group mb-4">
      <li v-for="product in products" :key="product.id" class="list-group-item d-flex justify-content-between">
        {{ product.name }} - R$ {{ product.price }} (Qtd: {{ product.quantity }})
        <button class="btn btn-danger btn-sm" @click="removeProduct(product.id)">🗑</button>
      </li>
    </ul>

    <h2>🎟 Gerenciar Cupons</h2>

    <div class="input-group mb-3">
      <input v-model="newCoupon.code" class="form-control" placeholder="Código do Cupom" />
      <input v-model="newCoupon.discount" type="number" class="form-control" placeholder="Desconto (%)" />
      <button class="btn btn-success" @click="addCoupon">Criar</button>
    </div>

    <ul class="list-group mb-4">
      <li v-for="coupon in coupons" :key="coupon.id" class="list-group-item d-flex justify-content-between">
        {{ coupon.code }} - {{ coupon.discount }}% de desconto
        <button class="btn btn-danger btn-sm" @click="removeCoupon(coupon.id)">🗑</button>
      </li>
    </ul>

    <h2>🛍️ Vendas</h2>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Valor Total</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td>{{ sale.id }}</td>
          <td>{{ sale.client }}</td>
          <td>R$ {{ sale.total }}</td>
          <td>{{ new Date(sale.date).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
body {
    background-color: #F5F5F0 !important;
}
</style>