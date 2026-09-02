<script setup>
import TarjetaCategoria from "@/components/TarjetaCategoria.vue"
import TarjetaAgregar from "@/components/TarjetaAgregar.vue"

defineProps({
  tituloSeccion: { type: String, required: true },
  productos: { type: Array, required: true },
  estaLogueado: { type: Boolean, default: false },
  imagen: { type: [String, Object], default: null }
})

// Se eliminó 'editar' de los eventos emitidos
defineEmits(['descargar', 'eliminar', 'agregar'])
</script>

<template>
  <div class="mb-12">
    <div class="animacion-entrada-retraso mb-6 flex items-center">
      <h2 class="text-2xl font-bold text-gray-700 pr-4">{{ tituloSeccion }}</h2>
      <!-- Línea separadora con Pantone 186 CVP al 20% de opacidad -->
      <div class="flex-grow h-px bg-[#CE1126]/20"></div>
    </div>

    <!-- Se ajustó el gap para pantallas pequeñas (gap-4 a sm:gap-6) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch animacion-entrada-retraso">
      
      <!-- Contenedor individual de la tarjeta -->
      <!-- Se ajustó el padding responsivo (p-3 a sm:p-4) -->
      <div 
        v-for="item in productos" 
        :key="item.id" 
        class="flex items-center justify-between bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
      >
        <!-- Tarjeta de Producto (ocupa el espacio disponible a la izquierda) -->
        <!-- Se agregó min-w-0 para evitar desbordamientos de texto largos -->
        <div class="flex-1 cursor-pointer min-w-0" @click="$emit('descargar', item.archivo_pdf)">
          <TarjetaCategoria 
            :titulo="item.nombre"
            :imagen="imagen"
            subtitulo="Descargar PDF"
          />
        </div>

        <!-- Botones de Administrador ALINEADOS AL CENTRO (A la derecha) -->
        <!-- flex-shrink-0 asegura que el contenedor no se aplaste, márgenes y paddings responsivos -->
        <div v-if="estaLogueado" class="flex items-center flex-shrink-0 ml-2 pl-2 sm:ml-4 sm:pl-4 border-l border-gray-100">
          
          <!-- Botón de eliminar con Pantone 186 CVP en hover y adaptabilidad de tamaño -->
          <button 
            @click.stop="$emit('eliminar', item.id)"
            class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-[#CE1126] hover:bg-[#CE1126]/10 hover:border-[#CE1126]/30 transition-all duration-200"
            title="Eliminar Instructivo"
          >
            <!-- El icono también se escala según la pantalla (w-4 a sm:w-5) -->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 sm:w-5 sm:h-5">
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