<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from "@/components/Sidebar.vue"
import HeaderVista from "@/components/HeaderVista.vue"
import Cargador from "@/components/Cargador.vue"
import SeccionTarjetas from "@/components/SeccionTarjetas.vue"
import ModalAgregarProducto from "@/components/ModalAgregarProducto.vue" 
import imgGriferias from '@/assets/images/GRIFERIAS.png'

// Variables de estado basadas en la nueva división
const bidet = ref([])
const ducha = ref([])
const lavamanos = ref([])
const cocinas = ref([])
const fluxometros = ref([])
const llavesTemporizadas = ref([])

const cargando = ref(true)
const esAdmin = ref(false)

// Estado del Modal
const mostrarModal = ref(false)
const tipoSeleccionadoParaModal = ref('') 
const clasificacionSeleccionadaParaModal = ref('Ficha')

const cargarGriferias = async () => {
  try {
    const respuesta = await fetch('https://api.instructivos.venceramica.com/api/productos/Griferias')
    if (!respuesta.ok) throw new Error('Error al conectar con el servidor')
    
    const datosObtenidos = await respuesta.json()

    // Filtrado según la nueva categorización
    bidet.value = datosObtenidos.filter(g => g.tipo === 'Bidet'&& g.clasificacion === 'Ficha')
    ducha.value = datosObtenidos.filter(g => g.tipo === 'Ducha'&& g.clasificacion === 'Ficha')
    lavamanos.value = datosObtenidos.filter(g => g.tipo === 'Lavamanos'&& g.clasificacion === 'Ficha')
    cocinas.value = datosObtenidos.filter(g => g.tipo === 'Cocinas'&& g.clasificacion === 'Ficha')
    fluxometros.value = datosObtenidos.filter(g => g.tipo === 'Fluxómetros'&& g.clasificacion === 'Ficha')
    llavesTemporizadas.value = datosObtenidos.filter(g => g.tipo === 'Llaves Temporizadas'&& g.clasificacion === 'Ficha')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  const usuario = localStorage.getItem('usuarioLogueado')
  if (usuario) esAdmin.value = true 
  cargarGriferias()
})

const procesarDescarga = (archivoPdf) => {
  if (!archivoPdf) return alert("Este producto aún no tiene un instructivo asignado.")
  window.open(`https://api.instructivos.venceramica.com/api/descargar/${archivoPdf}`, '_blank')
}

const eliminarProducto = async (id) => {
  if(confirm('¿Estás seguro de que deseas eliminar este producto y su instructivo?')) {
    try {
      await fetch(`https://api.instructivos.venceramica.com/api/productos/${id}`, { method: 'DELETE' })
      
      bidet.value = bidet.value.filter(item => item.id !== id)
      ducha.value = ducha.value.filter(item => item.id !== id)
      lavamanos.value = lavamanos.value.filter(item => item.id !== id)
      cocinas.value = cocinas.value.filter(item => item.id !== id)
      fluxometros.value = fluxometros.value.filter(item => item.id !== id)
      llavesTemporizadas.value = llavesTemporizadas.value.filter(item => item.id !== id)
    } catch (error) {
      console.error("Error:", error)
    }
  }
}

const editarProducto = (producto) => {
  console.log("Editar:", producto.nombre)
}

const abrirFormularioAgregar = (seccion) => {
  if (seccion === 'Para Bidet') tipoSeleccionadoParaModal.value = 'Bidet'
  else if (seccion === 'Para Ducha') tipoSeleccionadoParaModal.value = 'Ducha'
  else if (seccion === 'Para Lavamanos') tipoSeleccionadoParaModal.value = 'Lavamanos'
  else if (seccion === 'Para Cocinas') tipoSeleccionadoParaModal.value = 'Cocinas'
  else if (seccion === 'Fluxómetros') tipoSeleccionadoParaModal.value = 'Fluxómetros'
  else if (seccion === 'Llaves Temporizadas') tipoSeleccionadoParaModal.value = 'Llaves Temporizadas'
  clasificacionSeleccionadaParaModal.value = 'Ficha' 
  mostrarModal.value = true
}
</script>

<template>
  <div class="flex h-screen w-full bg-gray-50 font-sans overflow-hidden">
    <Sidebar />

    <main class="flex-1 w-full h-full overflow-y-auto pt-20 px-6 pb-12 md:p-12 relative">
      <HeaderVista titulo="Fichas Técnicas de Griferías" descripcion="Seleccione el modelo de grifería para ver o descargar su ficha." rutaVolver="/fichas"/>

      <Cargador v-if="cargando" mensaje="Cargando griferías..." />

      <div v-else>
        <!-- Agrupación Visual: PARA BAÑOS -->
        <div class="mb-8 border-l-4 border-[#CE1126] pl-4">
          <p class="text-2xl font-bold text-gray-800 mb-6 uppercase">Para Baños</p>
          
          <SeccionTarjetas 
            class="ml-5"
            tituloSeccion="Para Bidet" 
            :productos="bidet" 
            :imagen="imgGriferias"
            :estaLogueado="esAdmin"
            @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar" 
          />

          <SeccionTarjetas 
            class="ml-5"
            tituloSeccion="Para Ducha" 
            :productos="ducha" 
            :imagen="imgGriferias"
            :estaLogueado="esAdmin"
            @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
          />

          <SeccionTarjetas 
            class="ml-5"
            tituloSeccion="Para Lavamanos" 
            :productos="lavamanos" 
            :imagen="imgGriferias"
            :estaLogueado="esAdmin"
            @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
          />
        </div>

        <!-- Categorías Independientes -->
        <SeccionTarjetas 
          tituloSeccion="Para Cocinas" 
          :productos="cocinas" 
          :imagen="imgGriferias"
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />

        <SeccionTarjetas 
          tituloSeccion="Fluxómetros" 
          :productos="fluxometros" 
          :imagen="imgGriferias"
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />

        <SeccionTarjetas 
          tituloSeccion="Llaves Temporizadas" 
          :productos="llavesTemporizadas" 
          :imagen="imgGriferias"
          :estaLogueado="esAdmin"
          @descargar="procesarDescarga" @eliminar="eliminarProducto" @editar="editarProducto" @agregar="abrirFormularioAgregar"
        />
      </div>
    </main>

    <ModalAgregarProducto 
      :mostrar="mostrarModal"
      categoria="Griferias"
      :tipo="tipoSeleccionadoParaModal"
      :clasificacion-inicial="clasificacionSeleccionadaParaModal"
      @cerrar="mostrarModal = false"
      @guardado="cargarGriferias"
    />
  </div>
</template>