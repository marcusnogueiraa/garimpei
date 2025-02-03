<template>
  <div class="login-page d-flex justify-content-center align-items-center vh-100">
    <div class="login-card card shadow-sm p-4">
      <h2 class="text-center fw-bold">Bem-vindo de volta!</h2>
      <p class="text-center text-muted">Entre com suas credenciais para acessar sua conta</p>

      <form class="login-form-container" @submit.prevent="handleLogin">
        <InputLoginField label="Email" id="email" type="email" placeholder="seu@email.com" v-model="email" />
        <InputLoginField label="Senha" id="password" type="password" placeholder="********" v-model="password" />
        
        <button type="submit" class="login-button btn btn-success w-100">Entrar</button>
      </form>

      <p class="text-center mt-3">
        Não tem uma conta? <a href="#" class="text-decoration-none">Cadastre-se</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background-color: #F5F5F0;
  min-height: 100vh;
}

.login-card {
  width: 450px;
}

.login-form-container{
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-button{
  background-color: #7C9082;
  border-color: #7C9082;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import InputLoginField from '@/components/InputLoginField.vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  console.log('Email:', email.value, 'Senha:', password.value);
};
</script>
