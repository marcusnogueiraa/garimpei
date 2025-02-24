<template>
  <sellerHeaderComponent />
  <div class="container mt-4">
    <h2>🎟 Gerenciar Cupons</h2>

    <form @submit.prevent="createCoupon" class="input-group mb-3">
      <input v-model="newCoupon.code" class="form-control" placeholder="Código do Cupom" required />
      <input v-model="newCoupon.discount" type="number" class="form-control" placeholder="Desconto (%)" required />
      <input v-model="newCoupon.expiryDate" type="date" class="form-control" required />
      <button class="btn btn-success" type="submit">Criar</button>
    </form>

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
          <th>Data</th>
          <th>Método de Pagamento</th>
          <th>Produto</th>
          <th>Total</th>
          <th>Endereço</th>
          <th>Comprador</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td>{{ new Date(sale.date).toLocaleDateString() }}</td>
          <td>{{ formatPaymentMethod(sale.paymentMethod) }}</td>
          <td>{{ sale.productName }}</td>
          <td>R$ {{ sale.total.toFixed(2) }}</td>
          <td>{{ sale.address }}</td>
          <td>{{ sale.buyerUsername }}</td>
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
      headers: { Authorization: `Bearer ${token}` },
    });

    coupons.value = response.data.data;
  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
    alert("Erro ao buscar cupons. Verifique suas permissões e tente novamente.");
  }
};

const fetchSales = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para ver suas vendas.");
    return;
  }

  try {
    const response = await api.get(`/sales?filters[buyerUsername][$eq]=${user.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    sales.value = response.data.data.map(sale => ({
      id: sale.id,
      date: sale.date,
      paymentMethod: sale.paymentMethod,
      productName: sale.productName,
      total: sale.total,
      address: sale.address,
      buyerUsername: sale.buyerUsername
    }));
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    alert("Erro ao buscar vendas. Tente novamente.");
  }
};

const createCoupon = async () => {
  if (!newCoupon.value.code || !newCoupon.value.discount) {
    alert("Preencha todos os campos!");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para criar um cupom.");
    return;
  }

  console.log("Chamando API para criar cupom...");

  try {
    const response = await api.post(
      "/coupons", 
      {
        data: {
          code: newCoupon.value.code,
          discount: newCoupon.value.discount,
          seller: user.username,
          expiryDate: newCoupon.value.expiryDate,
        }
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );

    coupons.value.push(response.data.data);
    newCoupon.value = { code: "", discount: "", expiryDate: "" };
    alert("Cupom criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar cupom:", error.response?.data || error);
    alert("Erro ao criar o cupom. Verifique os dados e tente novamente.");
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
      headers: { Authorization: `Bearer ${token}` },
    });

    coupons.value = coupons.value.filter((coupon) => coupon.id !== id);
    alert("Cupom removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover cupom:", error);
    alert("Erro ao remover o cupom. Tente novamente.");
  }
};

const formatPaymentMethod = (method) => {
  const methods = {
    pix: "PIX",
    cartao: "Cartão de Crédito",
    boleto: "Boleto Bancário"
  };
  return methods[method] || "Desconhecido";
};

onMounted(() => {
  fetchCoupons();
  fetchSales();
});
</script>
