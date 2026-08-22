<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente

const InodorosDeDosPiezas = ref([])
const InodorosDeUnaPieza = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarLavamanos = async () => {
  try {
    const respuesta = await fetch('http://localhost:3000/api/productos/Lavamanos')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    LavamanosConPedestal.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos con Pedestal')
    LavamanosParaSobrePoner.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos para Sobre Poner')
    LavamanosParaEmpotrar.value = datosObtenidos.filter(h => h.tipo === 'Lavamanos para Empotrar')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarLavamanos()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un manual asignado.")
  window.open(`http://localhost:3000/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su manual?')) {
    try {
      await fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' })
      LavamanosConPedestal.value = LavamanosConPedestal.value.filter(item => item.id !== id)
      LavamanosParaSobrePoner.value = LavamanosParaSobrePoner.value.filter(item => item.id !== id)
      LavamanosParaEmpotrar.value = LavamanosParaEmpotrar.value.filter(item => item.id !== id)
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
  if (seccion === 'Lavamanos con Pedestal') tipoSeleccionadoParaModal.value = 'Lavamanos con Pedestal'
  else if (seccion === 'Lavamanos para Sobre Poner') tipoSeleccionadoParaModal.value = 'Lavamanos para Sobre Poner'
  else if (seccion === 'Lavamanos para Empotrar') tipoSeleccionadoParaModal.value = 'Lavamanos para Empotrar'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />
    

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Manuales de Lavamanos" descripcion="Seleccione el modelo de herraje descargar su manual." />

      <Cargador v-if="cargando" mensaje="Cargando Lavamanos..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Lavamanos con Pedestal" 
          :productos="paraLavamanosConPedestal" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Lavamanos para Sobre Poner" 
          :productos="paraLavamanosParaSobrePoner" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />

        <SeccionTarjetas 
          tituloSeccion="Lavamanos para Empotrar" 
          :productos="paraLavamanosParaEmpotrar" 
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Lavamanos"
      :tipo="tipoSeleccionadoParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarLavamanos"
    />

  </div>
</template>