<!-- src/components/RegisterForm.vue -->
<template>
  <div class="register-page d-flex justify-content-center align-items-center vh-100">
    <div class="register-card card shadow-sm p-4">
      <h2 class="text-center fw-bold">Crie sua conta</h2>
      <p class="text-center text-muted">Cadastre-se para começar a comprar e vender</p>

      <form class="register-form-container" @submit.prevent="handleRegister">
        <InputLoginField label="Nome completo" id="name" type="text" placeholder="João Silva" v-model="name" />
        <InputLoginField label="Email" id="email" type="email" placeholder="seu@email.com" v-model="email" />
        <InputLoginField label="Senha" id="password" type="password" placeholder="********" v-model="password" />
        <InputLoginField label="Confirme sua senha" id="confirm-password" type="password" placeholder="********" v-model="confirmPassword" />
        
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

<script lang="ts" setup>
import { ref } from 'vue';
import InputLoginField from '@/components/InputLoginField.vue';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('As senhas não coincidem!');
    return;
  }
  console.log('Nome:', name.value, 'Email:', email.value, 'Senha:', password.value);
};
</script>
