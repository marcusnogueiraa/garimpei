<template>
  <sellerHeaderComponent />
  <div class="container mt-4">
    <h2>🎟 Gerenciar Cupons</h2>

    <!-- Formulário para criar cupons -->
    <form @submit.prevent="createCoupon" class="input-group mb-3">
      <input v-model="newCoupon.code" class="form-control" placeholder="Código do Cupom" required />
      <input v-model="newCoupon.discount" type="number" class="form-control" placeholder="Desconto (%)" required />
      <input v-model="newCoupon.expiryDate" type="date" class="form-control" required />
      <button class="btn btn-success" type="submit">Criar</button>
    </form>

    <!-- Lista de cupons -->
    <ul class="list-group mb-4">
      <li v-for="coupon in coupons" :key="coupon.id" class="list-group-item d-flex justify-content-between">
        <div>
          <strong>{{ coupon.code }}</strong> - {{ coupon.discount }}% de desconto
          <br />
          Expira em: {{ new Date(coupon.expiryDate).toLocaleDateString() }}
        </div>
        <button class="btn btn-danger btn-sm" @click="deleteCoupon(coupon.id)">🗑</button>
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

<script setup>
import sellerHeaderComponent from "@/components/header/sellerHeaderComponent.vue";
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth"; 

const coupons = ref([]);
const sales = ref([]);
const authStore = useAuthStore();
const user = authStore.getUser(); 

const newCoupon = ref({
  code: "",
  discount: "",
  expiryDate: "",
});

const fetchCoupons = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para ver os cupons.");
    return;
  }

  try {
    const response = await api.get("/coupons", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    coupons.value = response.data.data;
  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
    alert("Erro ao buscar cupons. Verifique suas permissões e tente novamente.");
  }
};

const fetchSales = async () => {
  sales.value = [
    { id: 1, client: "Ana Souza", total: 150, date: "2025-02-10" },
    { id: 2, client: "Carlos Lima", total: 80, date: "2025-02-12" },
  ];
};

const createCoupon = async () => {
  if (!newCoupon.value.code || !newCoupon.value.discount || !newCoupon.value.expiryDate) {
    alert("Preencha todos os campos!");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para criar um cupom.");
    return;
  }

  try {
    const response = await api.post(
      "/coupons",
      {
        data: {
          code: newCoupon.value.code,
          discount: newCoupon.value.discount,
          expiryDate: newCoupon.value.expiryDate,
          seller: user?.id,   
          whoUsedId: [], 
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    coupons.value.push(response.data.data);
    newCoupon.value = { code: "", discount: "", expiryDate: "" };
    alert("Cupom criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar cupom:", error);
    alert("Erro ao criar o cupom. Verifique suas permissões e tente novamente.");
  }
};

const deleteCoupon = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para excluir um cupom.");
    return;
  }

  try {
    await api.delete(`/coupons/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    coupons.value = coupons.value.filter((coupon) => coupon.id !== id);
    alert("Cupom removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover cupom:", error);
    alert("Erro ao remover o cupom. Tente novamente.");
  }
};

onMounted(() => {
  fetchCoupons();
  fetchSales();
});
</script>
