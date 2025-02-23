<template>
    <div v-if="show" class="modal-overlay">
      <div class="modal-card">
        <h4 class="fw-bold text-center">Ação Necessária</h4>
        <p class="text-center">Você precisa estar logado para realizar esta ação.</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
          <button class="btn btn-success" @click="redirectToLogin">Fazer Login</button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    props: {
      show: Boolean
    },
    emits: ['close'],
    setup(_, { emit }) {
      const router = useRouter();
  
      const closeModal = () => {
        emit('close');
      };
  
      const redirectToLogin = () => {
        emit('close');
        router.push('/login');
      };
  
      return { closeModal, redirectToLogin };
    }
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .modal-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    text-align: center;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  </style>
  