<template>
    <div>
        <FooterComponent />
        <main>
            <h2>Buscando Resultados para: {{ search  }}</h2>
        </main>
        <FooterComponent />
    </div>
</template>

<script lang="ts">
import FooterComponent from '@/components/footer/footerComponent.vue';
import HeaderComponent from '@/components/header/headerComponent.vue';
import { defineComponent } from 'vue'


export default defineComponent({
    data(){
        return {
            search: "olaTudoBem"
        }
    },
    setup () {
        

        return {}
    },
    components: {
        HeaderComponent,
        FooterComponent
    }
})
</script>

<style scoped>

</style>