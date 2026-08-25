<script setup>
defineProps({
  mensaje: { type: String, default: 'Cargando instructivos...' }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 animacion-entrada">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
    <p class="text-gray-500 font-medium text-lg">{{ mensaje }}</p>
  </div>
</template>