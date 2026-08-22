<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente

const inodorosDeDosPiezas = ref([])
const inodorosDeUnaPieza = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarHerrajes = async () => {
  try {
    const respuesta = await fetch('https://api.manuales.venceramica.com/api/productos/Herrajes')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    inodorosDeDosPiezas.value = datosObtenidos.filter(h => h.tipo === 'Inodoros de Dos Piezas')
    inodorosDeUnaPieza.value = datosObtenidos.filter(h => h.tipo === 'Inodoros de Una Pieza')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarHerrajes()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un manual asignado.")
  window.open(`https://api.manuales.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su manual?')) {
    try {
      await fetch(`https://api.manuales.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      inodorosDeDosPiezas.value = inodorosDeDosPiezas.value.filter(item => item.id !== id)
      inodorosDeUnaPieza.value = inodorosDeUnaPieza.value.filter(item => item.id !== id)
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

const editarProducto = (producto) => {
  console.log("Editar:", producto.nombre)
}

// Abrir modal y asignar el tipo correcto según la sección
const abrirFormularioAgregar = (seccion) => {
  if (seccion === 'Inodoros de Dos Piezas') tipoSeleccionadoParaModal.value = 'Inodoros de Dos Piezas'
  else if (seccion === 'Inodoros de Una Pieza') tipoSeleccionadoParaModal.value = 'Inodoros de Una Pieza'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Manuales de Herrajes" descripcion="Seleccione el modelo de herraje descargar su manual." />

      <Cargador v-if="cargando" mensaje="Cargando herrajes..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Inodoros de Dos Piezas" 
          :productos="InodorosDeDosPiezas" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Inodoros de Una Pieza" 
          :productos="InodorosDeUnaPieza" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Herrajes"
      :tipo="tipoSeleccionadoParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarHerrajes"
    />

  </div>
</template>