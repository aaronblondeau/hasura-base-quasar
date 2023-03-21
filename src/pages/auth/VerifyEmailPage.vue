<template>
  <q-page padding>
    <div v-if="verifyWait" class="text-center q-ma-lg">
      <q-spinner
        color="primary"
        size="3em"
      />
    </div>
    <q-banner
      v-if="error"
      class="text-white bg-red"
      >
      {{ error }}
    </q-banner>
    <q-banner
      v-if="success"
      class="text-white bg-green"
      >
      Your email address has been verified!
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import { extractErrorMessage } from 'src/lib/notifyError'
const router = useRouter()

const authStore = useAuthStore()

const verifyWait = ref(false)
const code = ref(router.currentRoute.value.params.code as string)
const error = ref('')
const success = ref(false)

async function performVerification () {
  try {
    verifyWait.value = true
    await authStore.verifyEmail(code.value)
    success.value = true
  } catch (err) {
    let errorMessage = extractErrorMessage(err)
    if (errorMessage === 'No users found') {
      errorMessage = 'Invalid code (you may have already verified your email address)'
    }
    error.value = errorMessage
  } finally {
    verifyWait.value = false
  }
}

onMounted(() => {
  performVerification()
})
</script>
