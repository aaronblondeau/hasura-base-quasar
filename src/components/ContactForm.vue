<template>
  <q-form ref="contactForm">
    <q-input
      filled
      v-model="name"
      type="text"
      label="Name"
      class="q-mt-sm"
      :rules="[
        (val) => (val && val.length > 0) || 'Name must be filled in.',
      ]"
      :disable="sending"
    >
    </q-input>

    <q-input
      filled
      v-model="email"
      type="email"
      label="Email"
      lazy-rules
      :rules="[
        (val) => (val && val.length > 0) || 'Email must be filled in.',
      ]"
      :disable="sending"
    />

    <q-input
      v-model="message"
      label="Message"
      filled
      type="textarea"
      :disable="sending"
      :rules="[
        (val) => (val && val.length > 0) || 'Message must be filled in.',
      ]"
    />

    <q-banner class="q-mt-md bg-green text-white" v-if="sent">
      Your message has been sent! We will get back to you as soon as possible.
    </q-banner>

    <q-banner class="q-mt-md bg-red text-white" v-if="error">
      {{ error }}
    </q-banner>

    <q-btn
      v-if="!sent"
      class="q-mt-md"
      color="primary"
      label="Send"
      icon="send"
      :loading="sending"
      @click="send" />

  </q-form>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { QForm } from 'quasar'
import { useContactFormSubmissionStore } from 'src/stores/contact-form-submission'
import { useAuthStore } from 'src/stores/auth'
import { extractErrorMessage } from 'src/lib/notifyError'

const contactFormSubmission = useContactFormSubmissionStore()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const message = ref('')
const sending = ref(false)
const sent = ref(false)
const error = ref('')
const contactForm = ref<QForm | null>(null)

async function send () {
  contactForm.value?.validate().then(async (success) => {
    if (success) {
      error.value = ''
      sending.value = true
      try {
        await contactFormSubmission.submitContactForm(name.value, email.value, message.value)
        sent.value = true
      } catch (e) {
        error.value = extractErrorMessage(e)
      } finally {
        sending.value = false
      }
    }
  })
}

onMounted(() => {
  if (authStore.user) {
    email.value = authStore.user.email || ''
    name.value = authStore.user.display_name || ''
  }
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      email.value = newUser.email || ''
      name.value = newUser.display_name || ''
    }
  }
)
</script>
