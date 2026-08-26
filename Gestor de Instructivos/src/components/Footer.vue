<script setup>
// Puedes calcular el año actual de forma automática
const anioActual = new Date().getFullYear()
</script>

<template>
  <footer class="w-full py-4 text-center text-xs text-gray-500 border-t border-gray-200 mt-auto">
    <p>© {{ anioActual }} Vencerámica. Todos los derechos reservados.</p>
  </footer>
</template>