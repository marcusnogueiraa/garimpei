<template>
    <footer class="footer text-light text-center py-4">
      <div class="container">
        <div class="social-icons mb-3">
          <a href="https://facebook.com" target="_blank" class="icon-link">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" class="icon-link">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" class="icon-link">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" class="icon-link">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
  
        <p class="mb-1">
          <i class="fas fa-envelope"></i> 
          <a href="mailto:contato@modasustentavel.com" class="text-light">contato@garimpei.com</a>
        </p>
        

        <p class="m-0">&copy; Garimpei. Todos os direitos reservados.</p>
      </div>
    </footer>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'FooterComponent',
  });
  </script>
  
  <style scoped>
  .footer {
    background-color: #4A4238;
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .icon-link {
    color: white;
    font-size: 20px;
    transition: 0.3s;
  }
  
  .icon-link:hover {
    color: #d3d3d3;
  }
  </style>
  