<template>
  <header class="header">
    <div class="d-flex justify-content-between align-items-center px-5 py-3">
      <div class="d-flex justify-content-between align-items-center">
        <router-link to="/" class="text-light fw-bold">Garimpei</router-link>
      </div>
      <div v-if="user" class="d-flex align-items-center">
        <span class="text-light fw-bold me-3">Olá, {{ user.username }}!</span>
        <div class="menu-icon" @click="toggleSideMenu">
          <i class="fas fa-bars text-light"></i>
        </div>
      </div>
      <div v-else>
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
          class="nav-item only-desktop"
          @mouseover="toggleDropdown(index, true)"
          @mouseleave="toggleDropdown(index, false)"
        >
          <a href="#" class="nav-link text-light">{{ categoria.nome }}</a>
          <transition name="fade">
            <ul v-if="categoria.ativo" class="dropdown">
              <li v-for="(item, i) in categoria.tipos" :key="i" @click="searchForItem(item)">
                <a href="#" class="dropdown-item" >{{ item }}</a>
              </li>
            </ul>
          </transition>
        </div>
      </div>
      
      <div class="d-flex gap-4">
         <form @submit.prevent="searchProduct" class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Buscar produtos..."
              class="form-control w-100"
            />
            <button class="btn btn-outline-light">
              <i class="fas fa-search"></i>
            </button>
         </form>
         <div class="cart-icon-container" @click="openCart">
          <img src="../../assets/bag.svg" alt="Loja" class="cart-icon" />
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </div>
      </div>
    </div>
  </nav>
  
  <aside v-if="sideMenuOpen">
    <div class="side-menu-overlay" @click="toggleSideMenu"></div>
    <div class="side-menu">
      <button class="close-btn" @click="toggleSideMenu">&times;</button>
      <ul>
        <li v-if="userRole === 'seller'" @click="$router.push('/sell-product')">Vender Produto</li>
        <li v-if="userRole === 'seller'" @click="$router.push('/my-products')">Meus Produtos</li>
        <li v-if="userRole === 'seller'" @click="$router.push('/dashboard')">Dashboard</li>
        <li @click="$router.push('/favorites')">Ver Favoritos</li>
        <li @click="logout">Logout</li>
      </ul>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import { useSearchStore } from "@/store/search";  
import { useCartStore } from "@/store/cart";
import { useAuthGuard } from "@/composables/useAuthGuard"; 
import api from "@/api/axios";

export default defineComponent({
  name: "NavBar",
  setup() {
    const searchStore = useSearchStore();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const user = authStore.getUser();
    const router = useRouter();
    const route = useRoute();
    const sideMenuOpen = ref(false);
    const userRole = ref<string | null>(null); 

    const { requireLogin } = useAuthGuard();
    
    const categorias = reactive([
      { nome: "Roupas", ativo: false, tipos: ["Vestido", "Camiseta", "Calça", "Jaqueta"] },
      { nome: "Acessórios", ativo: false, tipos: ["Bolsa", "Óculo", "Bijuteria", "Relógio"] },
      { nome: "Calçados", ativo: false, tipos: ["Tênis", "Sandália", "Bota", "Sapato"] }
    ]);

    const searchQuery = ref(searchStore.query); 
    const cartItemCount = computed(() => cartStore.cart.length);

    const toggleDropdown = (index: number, state: boolean) => {
      categorias[index].ativo = state;
    };

    const toggleSideMenu = () => {
      sideMenuOpen.value = !sideMenuOpen.value;
    };

    const searchProduct = () => {
      if (typeof searchQuery.value === "string" && searchQuery.value.trim() !== "") {
        searchStore.setSearchQuery(searchQuery.value);

        if (route.name === "search") {
          router.replace({ name: "search", query: { q: searchQuery.value } });
        } else {
          router.push({ name: "search", query: { q: searchQuery.value } });
        }
      }
    };

    const searchForItem = (item: string) => {
      searchStore.setSearchQuery(item);
      searchQuery.value = item;
      router.push({ path: "/search", query: { q: item } });
    };

    const openCart = () => {
      requireLogin(() => {
        router.push("/cart");
      });
    };

    const logout = () => {
      authStore.logout();
      router.push("/").then(() => {
        window.location.reload();
      });
    };

    const fetchUserRole = async () => {
      try {
        const response = await api.get("/users/me?populate=role", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        userRole.value = response.data.role.name;
        console.log("Role do usuário:", userRole.value);
      } catch (error) {
        console.error("Erro ao buscar role do usuário:", error);
        userRole.value = null;
      }
    };

    // Buscar a role do usuário ao carregar o componente
    onMounted(fetchUserRole);

    return {
      user,
      categorias,
      searchQuery,
      cartItemCount,
      searchProduct,
      searchForItem,
      toggleDropdown,
      openCart,
      logout,
      toggleSideMenu,
      sideMenuOpen,
      userRole, // Expor a role do usuário
    };
  }
});
</script>

<style scoped>
.header {
  background-color: #4a4238;
}

.btn {
  font-weight: bold;
  padding: 6px 14px;
}

.btn-success {
  background-color: #6c9a8b;
  border-color: #6c9a8b;
}

.btn-success:hover {
  background-color: #5b887a;
  border-color: #5b887a;
}

.cart-icon-container {
  position: relative;
  display: inline-block;
}

.cart-icon {
  cursor: pointer;
  width: 30px;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-icon{
  cursor: pointer;
}

.side-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background: #4a4238;
  color: #fff;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out;
  z-index: 1050;

  animation: animate-left .3s forwards;
}

@keyframes animate-left {
  from{
    transform: translateX(100%);
  }
  to{
    transform: translateX(0);
  }
}

.side-menu-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.side-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.side-menu ul li {
  padding: 15px;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.side-menu ul li:hover {
  background: #2c2721;
}

.close-btn {
  align-self: flex-end;
  font-size: 24px;
  border: none;
  background: none;
  cursor: pointer;
}

.side-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1049;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 5px;

  outline: none;
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
  background-color: #4a4238;
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
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  list-style: none;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 10px 0;
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nav-item:hover .dropdown {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 5px);
}

.dropdown li {
  padding: 10px 20px;
  transition: background 0.3s ease-in-out;

  cursor: pointer;
}

.dropdown-item {
  text-decoration: none;
  color: #333;
  font-size: 14px;
  display: block;
  transition: color 0.3s ease-in-out;
}

.dropdown-item:hover {
  color: white;
  border-radius: 5px;
}

.dropdown li {
  transition: all 0.1s ease-in;
}

.dropdown li:hover {
  background-color: #c2c2c2;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
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
