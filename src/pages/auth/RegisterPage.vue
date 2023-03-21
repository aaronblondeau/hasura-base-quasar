<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md">
      <q-form ref="registerForm">
        <h3 class="text-h3 text-center">Register</h3>
        <div >
          <q-input
            filled
            v-model="email"
            type="email"
            label="Email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Email must be filled in.',
            ]"
          />

          <q-input
            filled
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Password"
            @keyup.enter="performRegister"
            :rules="[
              (val) => (val && val.length > 0) || 'Password must be filled in.',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <q-banner v-if="errorMessage" inline-actions class="text-white bg-red q-mt-md">
            {{ errorMessage }}
          </q-banner>

          <div class="q-mt-md">
            <h5 class="text-h5 text-center">Terms and Conditions</h5>
            <p>
              By registering for an account I consent to the collection and storage of my email address.
            </p>
            <p>
              I understand that my profile picture and username will be publicly accessible.
            </p>
            <p>
              I understand that all my personal information can deleted at any time by deleting my account.
            </p>
            <q-checkbox v-model="termsAccepted" label="I agree to the terms and conditions" />
          </div>

          <div class="q-mt-md">
            <q-btn color="black" label="Register" @click="performRegister" :disable="!termsAccepted || complete" :loading="wait" class="full-width" />
          </div>

          <div class="q-mt-md text-center">
            <router-link :to="{name: 'login'}">Login Instead?</router-link>
          </div>
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
import _ from 'lodash'

const password = ref('')
const isPwd = ref(true)
const email = ref('')
const errorMessage = ref('')
const wait = ref(false)
const registerForm = ref<QForm | null>(null)
const termsAccepted = ref(false)
const complete = ref(false)

const router = useRouter()
const authStore = useAuthStore()

async function performRegister () {
  if (registerForm.value) {
    const formIsValid = await registerForm.value.validate()
    if (formIsValid) {
      errorMessage.value = ''
      wait.value = true
      try {
        await authStore.register(email.value, password.value, password.value)
        router.push({ name: 'home' })
      } catch (error) {
        console.error(error)
        if (error instanceof Error) {
          errorMessage.value = error.message
        } else {
          if (_.has(error, 'message')) {
            errorMessage.value = (error as { message: string }).message + ''
          } else {
            errorMessage.value = error + ''
          }
        }
      } finally {
        wait.value = false
      }
    }
  }
}
</script>
