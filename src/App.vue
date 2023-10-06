<template>
  <router-view />
</template>

<script setup lang="ts">
import { provideClient } from '@urql/vue'
import { client } from 'src/lib/graphql'

provideClient(client)
</script>
