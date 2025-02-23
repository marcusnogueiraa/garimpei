<template>
  <div class="login-page d-flex justify-content-center align-items-center vh-100">
    <div class="login-card card shadow-sm p-4">
      <h2 class="text-center fw-bold">Bem-vindo de volta!</h2>
      <p class="text-center text-muted">Entre com suas credenciais para acessar sua conta</p>

      <form class="login-form-container" @submit.prevent="handleLogin">
        <InputLoginField label="Email" id="email" type="email" placeholder="seu@email.com" v-model="email" />
        <InputLoginField label="Senha" id="password" type="password" placeholder="********" v-model="password" />

        <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>

        <button type="submit" class="login-button btn btn-success w-100">Entrar</button>
      </form>

      <p class="text-center mt-3">
        Não tem uma conta? <a href="/register" class="text-decoration-none">Cadastre-se</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import InputLoginField from '@/components/InputLoginField.vue';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  console.log("Tentando login com:", email.value, password.value);

  const response = await authStore.login(email.value, password.value);

  if (response.success) {
    router.push('/');
  } else {
    console.log("Erro recebido:", response.message);
    errorMessage.value = response.message;
  }
};
</script>

<style scoped>
.login-page {
  background-color: #F5F5F0;
  min-height: 100vh;
}

.login-card {
  width: 450px;
}

.login-form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button {
  background-color: #7C9082;
  border-color: #7C9082;
}
</style>
