<template>
  <q-file ref="picker" clearable color="teal" filled v-model="attachment" @update:model-value="generateImage64" @clear="clearImage" label="Select Picture" accept=".jpg, .png">
    <template v-slot:prepend>
      <q-icon name="cloud_upload" />
    </template>
  </q-file>
</template>

<script setup lang="ts">
import { QFile } from 'quasar'
import { ref } from 'vue'

const emit = defineEmits(['select', 'clear'])
const picker = ref<QFile | null>(null)

function clearImage () {
  emit('clear')
}

const attachment = ref(null)

async function generateImage64 () {
  if (attachment.value != null) {
    emit('select', attachment.value)
  }
}

function reset () {
  if (picker.value) {
    const fileCount = picker.value.getNativeElement().files.length
    for (let i = 0; i < fileCount; i++) {
      picker.value.removeAtIndex(i)
    }
  }
}

defineExpose({ reset })
</script>
