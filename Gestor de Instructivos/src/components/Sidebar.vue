<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()

// Variables reactivas para el estado de la sesión
const isLoggedIn = ref(false)
const nombreUsuario = ref('')

// Se ejecuta al cargar el Sidebar
onMounted(() => {
  // CORRECCIÓN: Usamos 'usuarioLogueado' que es la llave que usamos en el resto de la app
  const dataUsuario = localStorage.getItem('usuarioLogueado')
  
  if (dataUsuario) {
    // Si existe, activamos la sesión
    isLoggedIn.value = true
    
    try {
      // Intentamos leer el objeto (si guardaste { name: "Juan", ... } en el login)
      const user = JSON.parse(dataUsuario)
      nombreUsuario.value = user.name || 'Administrador'
    } catch (e) {
      // Si en el login guardaste solo un texto (ej: "true"), mostramos "Administrador" por defecto
      nombreUsuario.value = 'Administrador'
    }
  } else {
    // Si no existe (entró como invitado)
    isLoggedIn.value = false
  }
})

// Función para cerrar la sesión
const cerrarSesion = () => {
  isOpen.value = false // Cierra el menú en móviles
  
  // 1. Borramos los datos del usuario usando LA MISMA LLAVE
  localStorage.removeItem('usuarioLogueado')
  isLoggedIn.value = false
  nombreUsuario.value = ''
  
  // 2. Redirigimos de vuelta a la pantalla de Login
  router.push('/')
}
</script>

<template>
  <!-- Botón de Hamburguesa (Afuera, visible solo cuando el menú está cerrado) -->
  <button 
    v-if="!isOpen"
    @click="isOpen = true" 
    class="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#CE1126] text-white rounded-md shadow-md focus:outline-none hover:bg-[#AB1A2D] transition-all duration-300 animacion-entrada"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  <!-- Fondo oscuro con efecto borroso -->
  <Transition name="fade">
    <div 
      v-if="isOpen" 
      @click="isOpen = false" 
      class="fixed inset-0 bg-black/40 backdrop-blur-md z-30 md:hidden"
    ></div>
  </Transition>

  <!-- Contenedor Lateral (Sidebar) -->
  <aside 
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    class="fixed inset-y-0 left-0 z-40 w-72 md:w-[20%] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out md:translate-x-0 md:static flex flex-col h-[100dvh]"
  >
    <!-- Cabecera -->
    <div class="bg-[#CE1126] flex items-center justify-center h-20 md:h-24 shadow-md px-4 relative flex-shrink-0">
      <img 
        src="../assets/logoVenceramica-removebg-preview.png" 
        alt="Logo Venceramica" 
        class="h-full w-auto max-h-16 object-contain scale-225 drop-shadow-md mb-3 relative z-10" 
      />
      
      <!-- Botón X (Adentro de la cabecera del sidebar, alineado a la derecha) -->
      <button 
        @click="isOpen = false"
        class="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/10 hover:bg-black/20 text-white rounded-md transition-colors z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Enlaces de Navegación Principales -->
    <nav class="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
      
      <!-- Inicio -->
      <router-link 
        to="/inicio" 
        @click="isOpen = false"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-[#AB1A2D] transition-all duration-300 font-semibold text-xl"
        active-class="bg-red-50 text-[#CE1126] shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Inicio
      </router-link>
      
      <!-- Manuales -->
      <router-link 
        to="/manuales" 
        @click="isOpen = false"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-[#AB1A2D] transition-all duration-300 font-semibold text-xl"
        active-class="bg-red-50 text-[#CE1126] shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Manuales
      </router-link>

      <!-- Fichas -->
      <router-link 
        to="/fichas" 
        @click="isOpen = false"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-[#AB1A2D] transition-all duration-300 font-semibold text-xl"
        active-class="bg-red-50 text-[#CE1126] shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        Fichas
      </router-link>
    </nav>

    <!-- Zona Inferior con LÍNEA DIVISORIA MÁS MARCADA -->
    <div class="px-4 py-6 border-t-2 border-gray-200 bg-gray-50/80 space-y-3">
      
      <!-- Web Oficial -->
      <a 
        href="https://venceramica.com" 
        target="_blank" 
        rel="noopener noreferrer"
        @click="isOpen = false"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl text-[#CE1126] hover:bg-white hover:text-[#AB1A2D] hover:shadow-sm transition-all duration-300 font-semibold text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        Sitio Web Oficial
      </a>

      <!-- Invitado -->
      <router-link 
        v-if="!isLoggedIn"
        to="/" 
        @click="isOpen = false"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-800 hover:text-white transition-all duration-300 font-semibold text-sm bg-white border border-gray-200 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Iniciar Sesión
      </router-link>

      <!-- Usuario Logueado -->
      <button 
        v-else
        @click="cerrarSesion"
        class="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-[#CE1126] hover:text-white hover:border-[#CE1126] transition-all duration-300 font-semibold text-sm text-left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="truncate">Cerrar Sesión</span>
      </button>
      
    </div>
  </aside>
</template>


<style scoped>
/* Transición suave para la aparición del efecto borroso y la capa oscura */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>