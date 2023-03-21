<template>
  <q-banner inline-actions class="text-white bg-orange" v-if="auth.user && !auth.user.email_verified">
    Your email address has not been verified!
    <template v-slot:action>
      <q-btn flat color="white" :label="emailSent ? 'Check Your Inbox' : 'Resend Verification Email'" :disable="resendVerificationWait || emailSent" :loading="resendVerificationWait" @click="resendVerificationEmail" />
    </template>
  </q-banner>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import notifyError from 'src/lib/notifyError'

const resendVerificationWait = ref(false)
const emailSent = ref(false)

async function resendVerificationEmail () {
  try {
    resendVerificationWait.value = true
    await auth.sendVerification()
    emailSent.value = true
  } catch (error) {
    notifyError(error)
  } finally {
    resendVerificationWait.value = false
  }
}

const auth = useAuthStore()
</script>
