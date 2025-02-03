<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-sm p-4" style="width: 350px;">
      <h2 class="text-center fw-bold">Bem-vindo de volta!</h2>
      <p class="text-center text-muted">Entre com suas credenciais para acessar sua conta</p>

      <form @submit.prevent="handleLogin">
        <InputField label="Email" id="email" type="email" placeholder="seu@email.com" v-model="email" />

        <InputField label="Senha" id="password" type="password" placeholder="********" v-model="password" />

        <button type="submit" class="btn btn-success w-100">Entrar</button>
      </form>

      <p class="text-center mt-3">
        Não tem uma conta? <a href="#" class="text-decoration-none">Cadastre-se</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import InputField from './InputField.vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  console.log('Email:', email.value, 'Senha:', password.value);
};
</script>
