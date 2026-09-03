<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import imgLogo from '@/assets/logoVenceramica-removebg-preview.png'
import imgFondo from '@/assets/images/IMG_INICIO.jpg'

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)
const isGuestLoading = ref(false)

// Ping preventivo al abrir la página web
onMounted(() => {
  fetch('https://api.instructivos.venceramica.com/').catch(() => {})
})

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const response = await fetch('https://api.instructivos.venceramica.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      localStorage.setItem('usuarioLogueado', JSON.stringify({
        name: data.user.name,
        role: data.user.role,
        email: data.user.email
      }))

      if (data.user.role === 'admin') {
        successMessage.value = `¡Acceso concedido! Bienvenido Administrador: ${data.user.name}`
      } else {
        successMessage.value = `¡Acceso concedido! Bienvenido ${data.user.name}`
      }

      setTimeout(() => {
        router.push('/inicio')
      }, 500)

    } else {
      errorMessage.value = data.message || 'Error al iniciar sesión'
    }
  } catch (error) {
    errorMessage.value = 'Error de conexión con el servidor.'
  } finally {
    isLoading.value = false
  }
}

const handleGuest = async () => {
  errorMessage.value = ''
  successMessage.value = 'Iniciando conexión con el servidor...'
  isGuestLoading.value = true

  localStorage.removeItem('usuarioLogueado')

  try {
    await fetch('https://api.instructivos.venceramica.com/')
    
    successMessage.value = 'Servidor listo. Redirigiendo...'
    setTimeout(() => {
      router.push('/inicio')
    }, 500)
  } catch (error) {
    errorMessage.value = 'El servidor está tardando más de lo normal.'
    setTimeout(() => {
      router.push('/inicio')
    }, 2000)
  } finally {
    isGuestLoading.value = false
  }
}

</script>

<template>
  <div class="flex flex-col-reverse md:flex-row min-h-screen font-sans">

    <!-- LADO IZQUIERDO: Login -->
    <div class="w-full md:w-[40%] bg-white flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
      <div class="max-w-md w-full mx-auto">

        <h2 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
        <p class="text-gray-500 mb-8">Por favor, ingresa a tu cuenta o entra como invitado.</p>

        <!-- Mensajes de Alerta -->
        <div v-if="errorMessage" class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          {{ successMessage }}
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-900">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" placeholder="usuario@correo.com"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              required />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-900">Contraseña</label>
            <input type="password" id="password" v-model="password" placeholder="••••••••"
              class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CE1126] focus:border-[#CE1126] transition-colors"
              required />
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full hover:cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#CE1126] hover:bg-[#AB1A2D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CE1126] transition-colors disabled:bg-red-300">
            {{ isLoading ? 'Verificando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-8 flex items-center ">
          <div class="flex-grow border-t border-gray-300 "></div>
          <span class="flex-shrink-0 px-4 text-sm text-gray-500">O continuar sin cuenta</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Botón de Invitado -->
        <button @click="handleGuest" type="button" :disabled="isGuestLoading || isLoading"
          class="mt-6 hover:cursor-pointer w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isGuestLoading ? 'Conectando...' : 'Entrar como Invitado' }}
        </button>
      </div>
    </div>

    <!-- LADO DERECHO: Fondo degradado + Imagen ligeramente difuminada + Logo al frente -->
    <div class="relative w-full md:w-[60%] bg-gray-900 flex items-center justify-center p-12 min-h-[30vh] md:min-h-screen overflow-hidden">
 
      <!-- IMAGEN DE FONDO CON BLUR SUAVE -->
      <img 
        :src="imgFondo" 
        alt="Fondo Vencerámica" 
        class="absolute inset-0 w-full h-full object-cover imagen-desvanecida pointer-events-none select-none"
        draggable="false"
      />

      <!-- Capa oscura para contraste -->
      <div class="absolute inset-0 bg-black/40 capa-desvanecida"></div>

      <!-- CONTENIDO EN PRIMER PLANO -->
      <div class="relative z-10 flex flex-col items-center justify-center text-center logo-desvanecido">
        <img 
          :src="imgLogo" 
          alt="Logo Vencerámica" 
          class="w-64 md:w-96 max-w-full h-auto object-contain drop-shadow-2xl"
          draggable="false"
        />
      </div>

    </div>

  </div>
</template>

<style scoped>
.imagen-desvanecida {
  opacity: 0;
  filter: blur(4px);
  transform: scale(1.02);
  animation: fadeInBlur 2s ease-in-out forwards;
}

.capa-desvanecida {
  opacity: 0;
  animation: fadeIn 2s ease-in-out forwards;
}

.logo-desvanecido {
  opacity: 0;
  transform: translateY(15px);
  animation: fadeUp 1.5s ease-out 0.3s forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeInBlur {
  0% {
    opacity: 0;
    filter: blur(4px);
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    filter: blur(4px);
    transform: scale(1.02);
  }
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