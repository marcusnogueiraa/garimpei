<script lang="ts" setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'

import { useRouter } from 'vue-router'
import InputLoginField from '@/components/InputLoginField.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem!';
    return;
  }

  const response = await authStore.register(name.value, email.value, password.value);

  if (response.success) {
    router.push('/');
  } else {
    console.log("Erro recebido no componente:", response.message);
    errorMessage.value = response.message;
  }
};

</script>

<template>
  <div class="register-page d-flex justify-content-center align-items-center vh-100">
    <div class="register-card card shadow-sm p-4">
      <h2 class="text-center fw-bold">Crie sua conta</h2>
      <p class="text-center text-muted">Cadastre-se para começar a comprar e vender</p>

      <form class="register-form-container" @submit.prevent="handleRegister">
        <InputLoginField label="Usuário" id="name" type="text" placeholder="joaovendas" v-model="name" />
        <InputLoginField label="Email" id="email" type="email" placeholder="seu@email.com" v-model="email" />
        <InputLoginField label="Senha" id="password" type="password" placeholder="********" v-model="password" />
        <InputLoginField label="Confirme sua senha" id="confirm-password" type="password" placeholder="********" v-model="confirmPassword" />

        <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>

        <button type="submit" class="register-button btn btn-success w-100">Cadastrar</button>
      </form>

      <p class="text-center mt-3">
        Já tem uma conta? <a href="/login" class="text-decoration-none">Faça login</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  background-color: #F5F5F0;
  min-height: 100vh;
}

.register-card {
  width: 450px;
}

.register-form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-button {
  background-color: #7C9082;
  border-color: #7C9082;
}
</style>
