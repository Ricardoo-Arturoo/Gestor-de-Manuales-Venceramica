<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente

const herrajesTanque = ref([])
const fluxometros = ref([])
const repuestos = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarHerrajes = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos/Herrajes')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    herrajesTanque.value = datosObtenidos.filter(h => h.tipo === 'Tanque')
    fluxometros.value = datosObtenidos.filter(h => h.tipo === 'Fluxómetro')
    repuestos.value = datosObtenidos.filter(h => h.tipo === 'Repuesto')

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
  window.open(`http://localhost:3000/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su manual?')) {
    try {
      await fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' })
      herrajesTanque.value = herrajesTanque.value.filter(item => item.id !== id)
      fluxometros.value = fluxometros.value.filter(item => item.id !== id)
      repuestos.value = repuestos.value.filter(item => item.id !== id)
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
  if (seccion === 'Herrajes para Tanques') tipoSeleccionadoParaModal.value = 'Tanque'
  else if (seccion === 'Fluxómetros') tipoSeleccionadoParaModal.value = 'Fluxómetro'
  else if (seccion === 'Repuestos') tipoSeleccionadoParaModal.value = 'Repuesto'
  
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Manuales de Herrajes" descripcion="Seleccione el modelo de herraje o fluxómetro para ver o descargar su manual." />

      <Cargador v-if="cargando" mensaje="Cargando herrajes..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Herrajes para Tanques" 
          :productos="herrajesTanque" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Fluxómetros" 
          :productos="fluxometros" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />

        <SeccionTarjetas 
          tituloSeccion="Repuestos" 
          :productos="repuestos" 
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