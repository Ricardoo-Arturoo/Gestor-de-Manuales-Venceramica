<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" // <-- Importamos nuestro nuevo súper componente
import imgAccesoriosYRepuestos from '@/assets/images/ACCESORIOS Y REPUESTOS.png'


const accesorios = ref([])
const repuestos = ref([])
const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') // Guardará si es Tanque, Fluxómetro o Repuesto

const cargarAccesoriosYRepuestos = async () => {
  try {
    const respuesta = await fetch('https://api.instructivos.venceramica.com/api/productos/Accesorios%20y%20Repuestos')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    accesorios.value = datosObtenidos.filter(h => h.tipo === 'Accesorios'&& h.clasificacion === 'Instructivo')
    repuestos.value = datosObtenidos.filter(h => h.tipo === 'Repuestos'&& h.clasificacion === 'Instructivo')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarAccesoriosYRepuestos()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un instructivo asignado.")
  window.open(`https://api.instructivos.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su instructivo?')) {
    try {
      await fetch(`https://api.instructivos.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      accesorios.value = accesorios.value.filter(item => item.id !== id)
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
  if (seccion === 'Accesorios') tipoSeleccionadoParaModal.value = 'Accesorios'
  else if (seccion === 'Repuestos') tipoSeleccionadoParaModal.value = 'Repuestos'
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Instructivos de Accesorios y Repuestos" descripcion="Seleccione el modelo de accesorio o repuesto para descargar su instructivo." />

      <Cargador v-if="cargando" mensaje="Cargando Accesorios y Repuestos..." />

      <div v-else>
        <SeccionTarjetas 
          tituloSeccion="Accesorios" 
          :productos="accesorios" 
          :estaLogueado="esAdmin"
          :imagen="imgAccesoriosYRepuestos"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
        />

        <SeccionTarjetas 
          tituloSeccion="Repuestos" 
          :productos="repuestos" 
          :estaLogueado="esAdmin"
          :imagen="imgAccesoriosYRepuestos"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <!-- Usamos nuestro componente Modal reutilizable -->
    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Accesorios y Repuestos"
      :tipo="tipoSeleccionadoParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarAccesoriosYRepuestos"
    />

  </div>
</template>