import { ref } from "vue";
import api from "@/api/axios";

export function useAuth() {
  const userRole = ref<string | null>(null);

  async function fetchUserRole() {
    try {
      const response = await api.get('/users/me?populate=role', {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      userRole.value = response.data.role.name;
      console.log("Role do usuário:", userRole.value);
    } catch (error) {
      console.error("Erro ao buscar role do usuário:", error);
      userRole.value = null;
    }
  }

  return { userRole, fetchUserRole };
}
