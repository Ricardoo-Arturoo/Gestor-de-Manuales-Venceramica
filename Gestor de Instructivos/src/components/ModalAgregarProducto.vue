<script setup>
import { ref, watch } from 'vue'

// Propiedades que recibirá este modal desde cualquier vista padre
const props = defineProps({
  mostrar: { type: Boolean, required: true },
  categoria: { type: String, required: true },
  tipo: { type: String, required: true }
})

// Eventos que enviaremos de vuelta a la vista padre
const emit = defineEmits(['cerrar', 'guardado'])

const nombre = ref('')
const archivoPdf = ref(null)
const enviandoFormulario = ref(false)

// Cada vez que se abre el modal, reseteamos los campos
watch(() => props.mostrar, (nuevoValor) => {
  if (nuevoValor) {
    nombre.value = ''
    archivoPdf.value = null
  }
})

const manejarSubidaArchivo = (event) => {
  archivoPdf.value = event.target.files[0]
}

const guardarNuevoProducto = async () => {
  if (!nombre.value || !archivoPdf.value) {
    alert("Por favor, completa todos los campos y selecciona un PDF.")
    return
  }

  enviandoFormulario.value = true

  const datos = new FormData()
  datos.append('nombre', nombre.value)
  datos.append('tipo', props.tipo)           // Usamos el tipo dinámico
  datos.append('categoria', props.categoria) // Usamos la categoría dinámica
  datos.append('pdf', archivoPdf.value)

  try {
    const respuesta = await fetch('http://localhost:3000/api/productos', {
      method: 'POST',
      body: datos
    })

    if (!respuesta.ok) throw new Error('Error al guardar el producto')

    alert("¡Producto añadido con éxito!")
    emit('guardado') // Avisamos a la vista que el producto se guardó para que recargue la lista
    emit('cerrar')   // Cerramos el modal

  } catch (error) {
    console.error("Error guardando:", error)
    alert("Hubo un error al guardar el producto.")
  } finally {
    enviandoFormulario.value = false
  }
}
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animacion-entrada">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      
      <!-- Cabecera -->
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h3 class="text-lg font-bold text-gray-800">Añadir Nuevo Manual</h3>
        <button @click="emit('cerrar')" class="text-gray-400 hover:text-[#CE1126] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="guardarNuevoProducto" class="p-6 space-y-4">
        
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Producto / Modelo</label>
          <input 
            v-model="nombre" 
            type="text" 
            placeholder="Ej: Producto Nuevo..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] outline-none"
            required
          />
        </div>

        <!-- Tipo y Categoría (Solo lectura) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <input :value="categoria" type="text" class="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" readonly />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
            <input :value="tipo" type="text" class="w-full px-4 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded-lg cursor-not-allowed" readonly />
          </div>
        </div>

        <!-- PDF -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Archivo PDF (Manual)</label>
          <input 
            type="file" 
            accept="application/pdf"
            @change="manejarSubidaArchivo"
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#CE1126]/10 file:text-[#CE1126] hover:file:bg-[#CE1126]/20 cursor-pointer transition-colors"
            required
          />
        </div>

        <!-- Botones -->
        <div class="pt-4 flex justify-end gap-3">
          <button type="button" @click="emit('cerrar')" class="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancelar</button>
          <button type="submit" :disabled="enviandoFormulario" class="px-4 py-2 text-sm font-semibold text-white bg-[#CE1126] hover:bg-[#AB1A2D] rounded-lg disabled:bg-[#CE1126]/50 transition-colors">
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
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>