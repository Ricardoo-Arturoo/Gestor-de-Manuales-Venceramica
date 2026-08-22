<script setup>
defineEmits(['click'])
</script>

<template>
  <button 
    @click="$emit('click')"
    class="flex flex-col items-center justify-center w-full h-full p-6 bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-2xl hover:bg-[#CE1126]/10 hover:border-[#CE1126] transition-all duration-300 cursor-pointer group shadow-sm"
  >
    <!-- Círculo con el icono de Más (+) -->
    <div class="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 group-hover:shadow-md transition-transform duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-400 group-hover:text-[#CE1126] transition-colors duration-300">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </div>
    
    <!-- Texto -->
    <span class="mt-2 text-xs font-semibold text-gray-500 group-hover:text-[#CE1126] transition-colors duration-300">
      Añadir Producto
    </span>
  </button>
</template>