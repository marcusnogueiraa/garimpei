import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref<string>('') // Garantimos que seja sempre string

  async function register(name: string, email: string, password: string) {
    try {
      const response = await axios.post('/api/register', { name, email, password })
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value) // Armazena token localmente
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || 'Erro ao registrar' }
    }
  }

  return { user, token, register }
})
