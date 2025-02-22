<template>
    <div class="vh-100 d-flex flex-column position-relative">
        <HeaderComponent />
        <main class="h-100 p-4">    
            <div class="d-flex">
                <h2 class="text-left">Buscando Resultados para: {{ search }}</h2>   
            </div>
              
            <div class="d-flex">
                <aside>

                </aside>     
                <section>
                    <p>Exibindo resultados para "{{ search }}"...</p>
                </section>
            </div>
        </main>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/footer/footerComponent.vue';
import HeaderComponent from '@/components/header/headerComponent.vue';
import { defineComponent, ref, watch } from 'vue';
import { useSearchStore } from '@/store/search';  

export default defineComponent({
    components: {
        HeaderComponent,
        FooterComponent
    },
    setup() {
        const searchStore = useSearchStore();
        const search = ref(searchStore.query); // Inicializa com o valor armazenado

        // Sincroniza sempre que a store de pesquisa for alterada
        watch(() => searchStore.query, (newQuery) => {
            search.value = newQuery;
        });

        return { search };
    }
});
</script>
