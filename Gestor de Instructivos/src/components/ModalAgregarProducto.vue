<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  mostrar: { type: Boolean, required: true },
  categoria: { type: String, required: true },
  tipo: { type: String, required: true },
  clasificacionInicial: { type: String, default: 'Instructivo' }
})

const emit = defineEmits(['cerrar', 'guardado'])

const nombre = ref('')
const clasificacion = ref(props.clasificacionInicial)
const archivoPdf = ref(null)
const nombreArchivo = ref('') // <-- Estado para mostrar el nombre del archivo seleccionado
const enviandoFormulario = ref(false)
const porcentajeSubida = ref(0)
const textoEstado = ref('Subiendo archivo...')

watch(() => props.mostrar, (nuevoValor) => {
  if (nuevoValor) {
    nombre.value = ''
    archivoPdf.value = null
    nombreArchivo.value = '' // Reseteamos el nombre del archivo al abrir el modal
    clasificacion.value = props.clasificacionInicial
    porcentajeSubida.value = 0
    textoEstado.value = 'Subiendo archivo...'
  }
})

const manejarSubidaArchivo = (event) => {
  const archivo = event.target.files[0]
  if (archivo) {
    archivoPdf.value = archivo
    nombreArchivo.value = archivo.name // Guardamos el nombre para mostrarlo en la interfaz
  }
}

const guardarNuevoProducto = () => {
  if (!nombre.value || !archivoPdf.value || !clasificacion.value) {
    alert("Por favor, completa todos los campos y selecciona un PDF.")
    return
  }

  enviandoFormulario.value = true
  porcentajeSubida.value = 0
  textoEstado.value = 'Subiendo archivo...'

  const datos = new FormData()
  datos.append('nombre', nombre.value)
  datos.append('tipo', props.tipo)
  datos.append('categoria', props.categoria)
  datos.append('clasificacion', clasificacion.value)
  datos.append('pdf', archivoPdf.value)

  const xhr = new XMLHttpRequest()

  // Progreso de subida del cliente al servidor
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const porcentaje = Math.round((e.loaded * 100) / e.total)
      porcentajeSubida.value = porcentaje

      // Si llega al 100%, cambiamos el texto porque ahora el servidor está procesando
      if (porcentaje === 100) {
        textoEstado.value = 'Procesando en el servidor...'
      }
    }
  })

  // Evento cuando el servidor termina por completo de procesar y responder
  xhr.addEventListener('load', () => {
    enviandoFormulario.value = false
    if (xhr.status >= 200 && xhr.status < 300) {
      alert("¡Producto añadido con éxito!")
      emit('guardado')
      emit('cerrar')
    } else {
      console.error("Error guardando:", xhr.responseText)
      alert("Hubo un error al guardar el producto.")
    }
  })

  xhr.addEventListener('error', () => {
    enviandoFormulario.value = false
    console.error("Error de red al subir el archivo.")
    alert("Hubo un error de conexión con el servidor.")
  })

  xhr.open('POST', 'https://api.instructivos.venceramica.com/api/productos')
  xhr.send(datos)
}
</script>

<template>
  <div v-if="mostrar"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animacion-entrada">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

      <!-- Cabecera -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-800">Añadir Nuevo Registro</h3>
        <button @click="emit('cerrar')" :disabled="enviandoFormulario"
          class="text-gray-400 hover:text-[#CE1126] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardarNuevoProducto" class="p-6 space-y-4">

        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-1">Nombre del Producto / Modelo</label>
          <input v-model="nombre" type="text" placeholder="Ej: Producto Nuevo..."
            :disabled="enviandoFormulario"
            class="w-full px-4 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            required />
        </div>

        <!-- Clasificación -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Clasificación</label>
          <input :value="clasificacionInicial" type="text"
            class="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
            readonly />
        </div>

        <!-- Tipo y Categoría -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <input :value="categoria" type="text"
              class="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
              readonly />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
            <input :value="tipo" type="text"
              class="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed"
              readonly />
          </div>
        </div>

        <!-- PDF con Icono y Nombre Dinámico -->
        <div 
          class="relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 bg-white transition-colors group"
          :class="enviandoFormulario ? 'bg-gray-50 opacity-70 cursor-not-allowed' : 'hover:border-[#CE1126] cursor-pointer'">
          
          <!-- Input original intacto -->
          <input 
            type="file" 
            accept="application/pdf" 
            @change="manejarSubidaArchivo"
            :disabled="enviandoFormulario"
            class="absolute inset-0 w-full h-full opacity-0 z-10"
            :class="enviandoFormulario ? 'cursor-not-allowed' : 'cursor-pointer'"
            required 
          />
          
          <!-- Contenido visual con el icono y cambio dinámico -->
          <div class="flex flex-col items-center text-center pointer-events-none">
            <div class="p-3 bg-[#CE1126]/10 text-[#CE1126] rounded-full mb-2 transition-colors"
                 :class="!enviandoFormulario ? 'group-hover:bg-[#CE1126]/25' : 'opacity-70'">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
              </svg>
            </div>
            <label class="block text-sm font-semibold text-gray-900 mb-1">Archivo PDF</label>
            <p class="text-xs text-gray-500">
              <span v-if="!nombreArchivo">Arrastra tu archivo aquí o <span :class="enviandoFormulario ? 'text-gray-500' : 'text-[#CE1126] font-medium'">haz clic para buscar</span></span>
              <span v-else class="text-gray-800 font-semibold flex items-center gap-1">
                📄 {{ nombreArchivo }}
              </span>
            </p>
          </div>
        </div>

        <!-- BARRA DE PROGRESO CON TEXTO DINÁMICO -->
        <div v-if="enviandoFormulario" class="space-y-1">
          <div class="flex justify-between text-xs font-semibold text-gray-600">
            <span>{{ textoEstado }}</span>
            <span>{{ porcentajeSubida }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div class="bg-[#CE1126] h-2.5 rounded-full transition-all duration-300 ease-out"
              :style="{ width: porcentajeSubida + '%' }"></div>
          </div>
        </div>

        <!-- Botones -->
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" @click="emit('cerrar')" :disabled="enviandoFormulario"
            class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">Cancelar</button>
          <button type="submit" :disabled="enviandoFormulario"
            class="px-4 py-2 text-sm font-semibold text-white bg-[#CE1126] hover:bg-[#AB1A2D] rounded-lg disabled:bg-[#CE1126]/50 disabled:cursor-not-allowed transition-colors">
            {{ enviandoFormulario ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<style scoped>
.animacion-entrada {
  opacity: 0;
  animation: fadeUp 0.3s ease-out forwards;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>