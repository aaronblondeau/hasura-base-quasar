<template>
  <q-page padding>
    <div v-if="!auth.authenticated">
      TODO - Logged Out Home Content
    </div>
    <div v-if="auth.authenticated" class="q-pa-md">
      TODO - Logged In Home Content
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth'

const auth = useAuthStore()
</script>
