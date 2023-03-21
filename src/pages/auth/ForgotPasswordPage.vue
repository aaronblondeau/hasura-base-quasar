<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form ref="forgotPasswordForm">
        <h3 class="text-h3 text-center">Password Reset</h3>

        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Email must be filled in.',
          ]" />

          <q-banner v-if="errorMessage" inline-actions class="text-white bg-red q-mt-md">
            {{ errorMessage }}
          </q-banner>

          <q-banner v-if="successMessage" inline-actions class="text-white bg-green q-mt-md">
            {{ successMessage }}
          </q-banner>

          <div>
            <q-btn v-if="!successMessage" color="primary" label="Send Link" @click="sendPasswordReset" :loading="wait" class="full-width q-mt-md" />
          </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { QForm } from 'quasar'

const email = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const wait = ref(false)
const forgotPasswordForm = ref<QForm | null>(null)

const auth = useAuthStore()
const router = useRouter()

async function sendPasswordReset () {
  forgotPasswordForm.value?.validate().then(async (success) => {
    if (success) {
      errorMessage.value = ''
      successMessage.value = ''
      wait.value = true
      try {
        await auth.sendPasswordReset(email.value)
        successMessage.value = 'A password reset link has been emailed to you.'
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          errorMessage.value = error.message
        } else {
          errorMessage.value = error + ''
        }
      } finally {
        wait.value = false
      }
    }
  })
}
</script>
