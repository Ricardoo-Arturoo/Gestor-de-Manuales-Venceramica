<script setup>
import TarjetaCategoria from "@/components/TarjetaCategoria.vue"

defineProps({
  tituloSeccion: { type: String, required: true },
  productos: { type: Array, required: true }
})

// Emitimos el evento de clic hacia la vista principal
defineEmits(['descargar'])
</script>

<template>
  <!-- Solo se muestra si hay productos en este arreglo -->
  <div v-if="productos.length > 0" class="mb-12">
    <div class="animacion-entrada-retraso mb-6 flex items-center">
      <h2 class="text-2xl font-bold text-gray-700 pr-4">{{ tituloSeccion }}</h2>
      <div class="flex-grow h-px bg-red-200"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animacion-entrada-retraso">
      <TarjetaCategoria 
        v-for="item in productos" 
        :key="item.id"
        :titulo="item.nombre"
        :imagen="item.imagen"
        subtitulo="Descargar PDF"
        @click="$emit('descargar', item.archivo_pdf)" 
      />
    </div>
  </div>
</template>