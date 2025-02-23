<template>
  <div class="container-fluid bg-light min-vh-100 m-0 p-0">
    <HeaderComponent />

    <main class="bg-light">
      <div class="mural animate-spawn">
        <div class="bg-black-50 d-flex justify-content-center align-items-center">
          <div class="mural-content">
            <h1 class="fw-bold text-light">Moda Sustentável ao seu Alcance</h1>
            <p class="text-light">
              Descubra peças únicas em brechós selecionados. Compre e venda moda de segunda mão de forma fácil e sustentável.
            </p>
            <div class="d-flex gap-3 mt-3 justify-content-center align-items-center">
              <button class="btn btn-success" @click="scrollToProducts">Explorar Produtos</button>
              <button class="btn btn-outline-light" @click="handleSellClick">Comece a Vender</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="container my-5 animate-spawn" ref="produtosSection">
      <h4 class="fw-bold">Últimas Novidades</h4>
      <div v-if="loading" class="text-center my-4">
        <span class="spinner-border text-success"></span>
        <p>Carregando produtos...</p>
      </div>
      <div v-else-if="produtos.length === 0" class="text-center">
        <p class="text-muted">Nenhum produto disponível no momento.</p>
      </div>
      <div class="row mt-4">
        <ProductCard 
      v-for="(item, index) in produtos" 
      :key="index" 
      :id="item.id"
      :documentId="item.documentId"
      :name="item.name" 
      :description="item.description"
      :price="item.price" 
      :quantity="item.quantity"
      :slug="item.slug"
      :wasSold="item.wasSold"
      :tags="item.tags"
      :createdAt="item.createdAt"
      :updatedAt="item.updatedAt"
      :publishedAt="item.publishedAt"
      :image1="item.image1?.url ? `http://localhost:1337${item.image1.url}` : ''"
      class="col-md-3 mt-2"
    />


      </div>
    </section>

    <FooterComponent />


    <div v-if="showTermsModal" class="modal-backdrop">
      <div class="modal-content">
        <h3>Termos de Uso para Vendedores</h3>
        <p>
          Para vender produtos em nossa plataforma, você deve concordar com nossos termos de uso.
          Isso inclui respeitar as políticas de produtos permitidos e oferecer suporte adequado aos compradores.
        </p>
        <p>Você concorda em se tornar um vendedor e seguir essas regras?</p>
        <div class="d-flex gap-3">
          <button class="btn btn-success" @click="acceptTerms">Aceitar e Tornar-se Vendedor</button>
          <button class="btn btn-secondary" @click="showTermsModal = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/auth";
import HeaderComponent from "@/components/header/headerComponent.vue";
import FooterComponent from "@/components/footer/footerComponent.vue";
import ProductCard from "@/components/card/productCard.vue";
import { useAuthGuard } from "@/composables/useAuthGuard"; 
import { useProductStore } from "@/store/products";
import { useAuth } from "@/store/user";
import api from "@/api/axios"; 

export default defineComponent({
  name: "HomePage",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const produtosSection = ref<HTMLElement | null>(null);
    const produtos = ref<any[]>([]);
    const loading = ref(true);
    const showTermsModal = ref(false); // Estado do modal
    const { userRole, fetchUserRole } = useAuth();
    
    const scrollToProducts = () => {
      if (produtosSection.value) {
        const navbarHeight = document.querySelector(".sticky-nav")?.clientHeight || 0; 
        const offset = produtosSection.value.getBoundingClientRect().top + window.scrollY - navbarHeight - 20; 
        window.scrollTo({ top: offset, behavior: "smooth" });
      }
    };

    const productStore = useProductStore();
    onMounted(async () => {
      loading.value = true;
      await productStore.fetchProducts(); 
      produtos.value = productStore.products;
      console.log("Produtos carregados:", produtos.value);
      loading.value = false;
    });

      const { requireLogin } = useAuthGuard();

      const handleSellClick = () => {
          requireLogin(async () => { 
            await fetchUserRole(); 

            if (userRole.value === "seller") {
              router.push("/sell-product");
            } else {
              showTermsModal.value = true;
            }
          });
        };


    const acceptTerms = async () => {
      try {
        const user = authStore.getUser(); 
        if (!user) {
          alert("Você precisa estar logado para se tornar vendedor.");
          return;
        }

        const userId = user.id; 
        const newRoleId = 3; 

        const response = await api.put(
          `/users/${userId}`,  
          { role: newRoleId }, 
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        if (response.status === 200) {
          userRole.value = "seller";
          showTermsModal.value = false;
          router.push("/sell-product");
        } else {
          alert("Erro ao atualizar sua conta para vendedor.");
        }
      } catch (error) {
        console.error("Erro ao atualizar role do usuário:", error);
        alert("Erro ao atualizar sua conta para vendedor. Tente novamente.");
      }
    };


    onMounted(fetchUserRole);

    return {
      produtos,
      loading,
      scrollToProducts,
      handleSellClick,
      showTermsModal,
      acceptTerms,
      produtosSection
    };
  },
  components: {
    HeaderComponent,
    ProductCard,
    FooterComponent,
  },
});
</script>

<style scoped>
.mural {
  background: url("@/assets/mural.avif") no-repeat center center;
  background-size: cover;
  height: 600px;  
  display: flex;
  align-items: flex-end; 
  justify-content: center; 
  text-align: center;
  position: relative;
}

.bg-black-50 {
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.589);
}

.mural-content {
  max-width: 600px; 
}

.mural h1 {
  font-size: 2.5rem; 
  margin-bottom: 1rem; 
}

.mural p {
  font-size: 1.2rem; 
  margin-bottom: 1.5rem;  
}

.mural .btn {
  font-size: 1rem; 
  padding: 10px 20px; 
}

.animate-spawn {
  animation: spawn .2s forwards;
}

@keyframes spawn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  text-align: center;
}

.modal-content h3 {
  margin-bottom: 15px;
}

.modal-content p {
  font-size: 16px;
  margin-bottom: 15px;
}

.modal-content .btn {
  width: 100%;
}
</style>
