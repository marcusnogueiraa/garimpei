<template>
  <header class="header">
    <div class="container d-flex justify-content-between align-items-center py-3">

      <div>
        <h1 class="text-light fw-bold">Garimpei</h1>
      </div>


      <div>
        <button class="btn btn-outline-light me-2">Login</button>
        <button class="btn btn-success">Cadastro</button>
      </div>
    </div>

    <nav class="bg-dark py-2">
      <div class="container d-flex justify-content-center gap-4">
        <div 
          v-for="(categoria, index) in categorias" 
          :key="index" 
          class="nav-item dropdown"
          @mouseover="categoria.ativo = true"
          @mouseleave="categoria.ativo = false"
        >
          <a href="#" class="nav-link text-light">{{ categoria.nome }}</a>
          <ul v-if="categoria.ativo" class="dropdown-menu">
            <li v-for="(item, i) in categoria.tipos" :key="i">
              <a href="#" class="dropdown-item">{{ item }}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const categorias = ref([
      { nome: 'Roupas', ativo: false, tipos: ['Vestidos', 'Camisetas', 'Calças', 'Jaquetas'] },
      { nome: 'Acessórios', ativo: false, tipos: ['Bolsas', 'Óculos', 'Bijuterias', 'Relógios'] },
      { nome: 'Calçados', ativo: false, tipos: ['Tênis', 'Sandálias', 'Botas', 'Sapatos'] }
    ]);

    return { categorias };
  }
});
</script>

<style scoped>
.header {
  background-color: #4A4238;
}

/* Botões */
.btn {
  font-weight: bold;
  padding: 8px 16px;
}

.btn-success {
  background-color: #6C9A8B;
  border-color: #6C9A8B;
}

.btn-success:hover {
  background-color: #5b887a;
  border-color: #5b887a;
}

/* Navegação */
.nav-item {
  position: relative;
  background-color: #4A4238;
}

.nav-link {
  font-weight: bold;
  padding: 8px 16px;
  cursor: pointer;
}

.nav-link:hover {
  text-decoration: underline;
}

/* Dropdown */
.dropdown-menu {
  position: absolute;
  background: white;
  list-style: none;
  padding: 10px;
  margin: 0;
  top: 30px;
  left: 0;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 150px;
}

.dropdown-item {
  padding: 8px;
  color: black;
  display: block;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f8f9fa;
}
</style>
