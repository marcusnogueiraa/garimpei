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
          <button class="btn btn-primary btn-sm me-2" @click="openEditModal(coupon)">✏️</button>
          <button class="btn btn-danger btn-sm" @click="deleteCoupon(coupon.id)">🗑</button>
        </div>
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
import { useCouponStore } from "@/store/coupon";

const coupons = ref([]);
const sales = ref([]);
const showEditModal = ref(false);

const editCoupon = ref({
  id: null,
  documentId: "",
  code: "",
  discount: 0,
  expiryDate: ""
});

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
      headers: { Authorization: `Bearer ${token}` },
    });
    coupons.value = response.data.data; 
  } catch (error) {
    console.error("Erro ao buscar cupons:", error);
  }
};

const fetchSales = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Você precisa estar logado para ver suas vendas.");
    return;
  }

  try {
    const response = await api.get(`/sales?filters[sellerUsername][$eq]=${user.username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    console.log(response);

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
          sellerUsername: user.username,
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

    console.log("Resposta da API:", response.data);
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



const openEditModal = (coupon) => {
  editCoupon.value = { ...coupon };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const couponStore = useCouponStore();

const updateCoupon = async () => {
  if (!editCoupon.value.id) return;

  console.log("cupom do id mudado", editCoupon.value.id)

  const updatedData = {
    id: editCoupon.value.documentId,
    code: editCoupon.value.code,
    discount: editCoupon.value.discount,
    expiryDate: editCoupon.value.expiryDate
  };

  const result = await couponStore.updateCoupon(updatedData);

  if (result.success) {
    const index = coupons.value.findIndex(c => c.id === editCoupon.value.id);
    if (index !== -1) {
      coupons.value[index] = result.data;
    }
    alert("Cupom atualizado com sucesso!");
    closeEditModal();
  } else {
    alert(result.message);
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
