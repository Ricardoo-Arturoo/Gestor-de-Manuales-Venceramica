<script setup>
import TarjetaCategoria from "@/components/TarjetaCategoria.vue"
import TarjetaAgregar from "@/components/TarjetaAgregar.vue"

defineProps({
  tituloSeccion: { type: String, required: true },
  productos: { type: Array, required: true },
  estaLogueado: { type: Boolean, default: false }
})

defineEmits(['descargar', 'eliminar', 'editar', 'agregar'])
</script>

<template>
  <div class="mb-12">
    <div class="animacion-entrada-retraso mb-6 flex items-center">
      <h2 class="text-2xl font-bold text-gray-700 pr-4">{{ tituloSeccion }}</h2>
      <div class="flex-grow h-px bg-red-200"></div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch animacion-entrada-retraso">
      
      <!-- Contenedor individual de la tarjeta -->
      <div 
        v-for="item in productos" 
        :key="item.id" 
        class="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
      >
        <!-- Tarjeta de Producto (ocupa el espacio disponible a la izquierda) -->
        <div class="flex-1 cursor-pointer" @click="$emit('descargar', item.archivo_pdf)">
          <TarjetaCategoria 
            :titulo="item.nombre"
            :imagen="item.imagen"
            subtitulo="Descargar PDF"
          />
        </div>

        <!-- Botones de Administrador ALINEADOS AL CENTRO (A la derecha) -->
        <div v-if="estaLogueado" class="flex items-center gap-2 ml-3 pl-3 border-l border-gray-100">
          <button 
            @click.stop="$emit('editar', item)"
            class="flex items-center justify-center w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200"
            title="Editar PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </button>
          
          <button 
            @click.stop="$emit('eliminar', item.id)"
            class="flex items-center justify-center w-9 h-9 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200"
            title="Eliminar Manual"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Tarjeta para Agregar -->
      <div v-if="estaLogueado" class="h-full min-h-[90px]">
        <TarjetaAgregar @click="$emit('agregar', tituloSeccion)" />
      </div>

    </div>
  </div>
</template>