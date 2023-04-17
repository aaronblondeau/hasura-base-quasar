<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <h2 class="text-center">Reset Password</h2>
      <q-form ref="resetForm">
        <q-input
          filled
          v-model="email"
          type="email"
          label="Email"
          lazy-rules
          :disable="resetWait"
          :rules="[
            (val) => (val && val.length > 0) || 'Email must be filled in.',
          ]"
        />

        <q-input
          filled
          v-model="newPassword"
          :type="showPassword ? 'text' : 'password'"
          label="New Password"
          @keyup.enter="doReset"
          class="q-mt-sm"
          :disable="resetWait"
          :rules="[
            (val) => (val && val.length > 0) || 'Password must be filled in.',
            (val) => (val && val.length >= 6) || 'Password must be at least 6 characters.',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </q-form>

      <q-banner
        v-if="error"
        class="text-white bg-red"
        >
        {{ error }}
      </q-banner>

      <div class="q-mt-md">
        <q-btn
          color="primary"
          label="Reset Password"
          @click="doReset"
          class="full-width"
          :loading="resetWait"
          :disable="resetWait"
          />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRouter } from 'vue-router'
import { extractErrorMessage } from 'src/lib/notifyError'
import { Notify, QForm } from 'quasar'

const router = useRouter()

const authStore = useAuthStore()

const resetWait = ref(false)
const code = ref(router.currentRoute.value.params.code as string)
const email = ref('')
const newPassword = ref('')
const error = ref('')
const showPassword = ref(false)
const resetForm = ref<QForm | null>(null)

async function doReset () {
  try {
    const valid = await resetForm.value?.validate()
    if (valid) {
      resetWait.value = true
      await authStore.resetPassword(code.value, email.value, newPassword.value)
      Notify.create({
        message: 'Your password has been reset!',
        color: 'green',
        position: 'top',
        timeout: 5000
      })
      router.replace({ name: 'login' })
    }
  } catch (err) {
    let errorMessage = extractErrorMessage(err)
    if (errorMessage === 'No users found') {
      errorMessage = 'Invalid code (you may have already verified your email address)'
    }
    error.value = errorMessage
  } finally {
    resetWait.value = false
  }
}
</script>
