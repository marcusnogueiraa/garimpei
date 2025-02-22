import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const token = ref<string>(localStorage.getItem('token') ?? ''); // Evita erro de tipo

  async function register(name: string, email: string, password: string) {
    try {
      const response = await api.post('/auth/local/register', { 
        username: name,
        email,
        password
      });

      token.value = response.data.jwt;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);

      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || "Erro ao registrar";
      return { success: false, message: errorMessage }
    }
  }
  
  async function login(email: string, password: string) {
    const response = await api.post('/auth/local', {
      identifier: email, // O Strapi usa 'identifier' ao invés de 'email'
      password
    }).catch(error => error.response);

    if (!response || response.status !== 200) {
      return {
        success: false,
        message: response?.data?.error?.message || "Erro ao fazer login"
      };
    }

    // Salva o token e os dados do usuário na store
    token.value = response.data.jwt;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);

    console.log("Login bem-sucedido:", user.value);

    return { success: true }
  }

  async function logout() {
    token.value = ''; // Define como string vazia em vez de null
    user.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, register, login, logout };
});
