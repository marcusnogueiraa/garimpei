import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null);
  const token = ref<string>(localStorage.getItem('token') ?? ''); 

  function getUser() {
    const user = localStorage.getItem('user'); 
    if (user && user.trim() !== '') { 
      try {
        return JSON.parse(user); 
      } catch (error) {
        console.error('Erro ao fazer parse do usuário:', error);
        return null; 
      }
    }
    return null; 
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post('/auth/local/register', { 
      username: name,
      email,
      password
    }).catch(error => error.response);
  
    if (!response || response.status !== 200) {  
      return {
        success: false,
        message: response?.data?.error?.message || "Ocorreu um erro no Cadastro"
      };
    }
  
    token.value = response.data.jwt;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);
  
    return { success: true };
  }
  
  
  
  async function login(email: string, password: string) {
    const response = await api.post('/auth/local', {
      identifier: email,
      password
    }).catch(error => error.response);

    if (!response || response.status !== 200) {
      return {
        success: false,
        message: response?.data?.error?.message || "Erro ao fazer login"
      };
    }

    token.value = response.data.jwt;
    user.value = response.data.user;
    localStorage.setItem('token', token.value);

    console.log("Login bem-sucedido:", user.value);

    return { success: true }
  }

  async function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
  }

  return { user, token, register, login, logout, getUser};
});
