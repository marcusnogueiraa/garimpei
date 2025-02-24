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
      <li
        v-for="coupon in coupons"
        :key="coupon.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>{{ coupon.code }}</strong> - {{ coupon.discount }}% de desconto
          <br />
          Expira em: {{ new Date(coupon.expiryDate).toLocaleDateString() }}
        </div>
        <div>
          <!-- Botão para Editar (abre modal) -->
          <button class="btn btn-primary btn-sm me-2" @click="openEditModal(coupon)">✏️</button>
          <!-- Botão para Deletar -->
          <button class="btn btn-danger btn-sm" @click="deleteCoupon(coupon.id)">🗑</button>
        </div>
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

    <!-- Modal para editar cupom -->
    <div v-if="showEditModal" class="modal-backdrop">
      <div class="modal-content p-3">
        <h5>Editar Cupom</h5>
        <form @submit.prevent="updateCoupon">
          <div class="mb-2">
            <label class="form-label">Código</label>
            <input v-model="editCoupon.code" class="form-control" required />
          </div>
          <div class="mb-2">
            <label class="form-label">Desconto (%)</label>
            <input v-model="editCoupon.discount" type="number" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Data de Expiração</label>
            <input v-model="editCoupon.expiryDate" type="date" class="form-control" required />
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-success">Salvar</button>
            <button type="button" class="btn btn-secondary" @click="closeEditModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import sellerHeaderComponent from "@/components/header/sellerHeaderComponent.vue";
import { ref, onMounted } from "vue";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth";

const coupons = ref([]);
const sales = ref([]);
const showEditModal = ref(false);

// Cupom que será editado (injetado no modal)
const editCoupon = ref({
  id: null,
  documentId: "",
  code: "",
  discount: 0,
  expiryDate: ""
});

// Novo cupom (form de criação)
const newCoupon = ref({
  code: "",
  discount: "",
  expiryDate: ""
});

const authStore = useAuthStore();
const user = authStore.getUser();

const fetchCoupons = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
   
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
  }
};

const fetchSales = async () => {
  // Exemplo estático; substitua por chamada à API se necessário
  sales.value = [
    { id: 1, client: "Ana Souza", total: 150, date: "2025-02-10" },
    { id: 2, client: "Carlos Lima", total: 80, date: "2025-02-12" },
  ];
};

const createCoupon = async () => {
  if (!newCoupon.value.code || !newCoupon.value.discount || !newCoupon.value.expiryDate) {
    
    return;
  }
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  try {
    const response = await api.post(
      "/coupons",
      {
        data: {
          code: newCoupon.value.code,
          discount: newCoupon.value.discount,
          seller: 1, 
          expiryDate: newCoupon.value.expiryDate
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
  } catch (error) {
    console.error("Erro ao criar cupom:", error.response?.data || error);
    alert("Erro ao criar o cupom. Verifique os dados e tente novamente.");
  }
};

const deleteCoupon = async (id) => {
  const token = localStorage.getItem("token");
  if (!token) { 
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

const openEditModal = (coupon) => {
  editCoupon.value = { ...coupon };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const updateCoupon = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para atualizar um cupom.");
    return;
  }
  try {
    const response = await api.put(
      `/coupons/${editCoupon.value.id}`,
      {
        data: {
          id: editCoupon.value.id,
          code: editCoupon.value.code,
          discount: editCoupon.value.discount,
          expiryDate: editCoupon.value.expiryDate
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
    
    const index = coupons.value.findIndex(c => c.id === editCoupon.value.id);
    if (index !== -1) {
      coupons.value[index] = response.data.data;
    }
    alert("Cupom atualizado com sucesso!");
    closeEditModal();
  } catch (error) {
    console.error("Erro ao atualizar cupom:", error);
    alert("Erro ao atualizar cupom. Tente novamente.");
  }
};

onMounted(() => {
  fetchCoupons();
  fetchSales();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal-content {
  background: white;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  border-radius: 8px;
}
</style>
