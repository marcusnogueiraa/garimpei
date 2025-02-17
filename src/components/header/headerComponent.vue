<template>
  <header class="header">
    <div class="container d-flex justify-content-between align-items-center py-3">
      <div>
        <h1 class="text-light fw-bold">Garimpei</h1>
      </div>
      <div>
        <router-link to="/login" class="btn btn-outline-light me-2">Login</router-link>
        <router-link to="/register" class="btn btn-success">Cadastro</router-link>
      </div>
    </div>
  </header>
  <nav class="sticky-nav shadow">
    <div class="d-flex justify-content-between align-items-center px-4">
      <div class="d-flex gap-4 category-menu">
        <div
          v-for="(categoria, index) in categorias"
          :key="index"
          class="nav-item  only-desktop"
          @mouseover="toggleDropdown(index, true)"
          @mouseleave="toggleDropdown(index, false)"
        >
          <a href="#" class="nav-link text-light">{{ categoria.nome }}</a>

          <transition name="fade">
            <ul v-if="categoria.ativo" class="dropdown">
              <li v-for="(item, i) in categoria.tipos" :key="i">
                <a href="#" class="dropdown-item">{{ item }}</a>
              </li>
            </ul>
          </transition>
        </div>
      </div>
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Buscar produtos..."
          class="form-control"
        />
        <button class="btn btn-outline-light" @click="buscarProduto">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, onUnmounted } from 'vue';
export default defineComponent({
  name: 'NavBar',
  setup() {
    const categorias = reactive([
      { nome: 'Roupas', ativo: false, tipos: ['Vestidos', 'Camisetas', 'Calças', 'Jaquetas'] },
      { nome: 'Acessórios', ativo: false, tipos: ['Bolsas', 'Óculos', 'Bijuterias', 'Relógios'] },
      { nome: 'Calçados', ativo: false, tipos: ['Tênis', 'Sandálias', 'Botas', 'Sapatos'] }
    ]);
    const searchQuery = ref('');
    const isMobile = ref(window.innerWidth < 768);
    const toggleDropdown = (index: number, state: boolean) => {
      categorias[index].ativo = state;
    };
    const buscarProduto = () => {
      if (searchQuery.value.trim() !== '') {
        alert(`Buscando por: ${searchQuery.value}`);
      }
    };
    const updateMobileView = () => {
      isMobile.value = window.innerWidth < 768;
    };
    onMounted(() => {
      window.addEventListener('resize', updateMobileView);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', updateMobileView);
    });
    return { categorias, searchQuery, buscarProduto, toggleDropdown, isMobile };
  }
});
</script>

<style scoped>
.header {
  background-color: #4A4238;
}
.btn {
  font-weight: bold;
  padding: 6px 14px;
}
.btn-success {
  background-color: #6C9A8B;
  border-color: #6C9A8B;
}
.btn-success:hover {
  background-color: #5b887a;
  border-color: #5b887a;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 5px;
}
.form-control {
  padding: 8px;
  width: 250px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.sticky-nav {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1020;
  background-color: #4A4238;
  padding: 10px 0;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}
.category-menu {
  display: flex;
}
.nav-item {
  position: relative;
}
.nav-link {
  font-weight: bold;
  padding: 8px 16px;
  cursor: pointer;
  color: white;
  text-decoration: none;
}
.nav-link:hover {
  text-decoration: underline;
}
.dropdown {
position: absolute;
  background: white;
  list-style: none;
  padding: 10px;
  margin: 0;
  top: 100%;
  left: 0;
  border-radius: 5px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 150px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
@media (max-width: 768px) {
  .only-desktop {
    display: none;
  }
  .search-box {
    justify-content: center;
    width: 100%;
    max-width: none;
  }
}
</style>
