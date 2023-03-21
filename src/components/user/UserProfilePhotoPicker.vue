<template>
  <div>
    <div v-if="authStore.user && authStore.user.avatar_file_key && !image64">
      <q-img
        :src="authStore.userAvatarKeyToUrl(authStore.user.avatar_file_key)"
        spinner-color="white"
        style="max-width: 400px"
        class="q-mb-md"
      />
    </div>
    <div v-if="!authStore.user?.avatar_file_key">
      No Profile Picture
    </div>
    <div v-if="image64">
      <q-img
        :src="image64"
        spinner-color="white"
        style="max-width: 400px"
        class="q-mb-md"
      />
    </div>
    <div v-if="!image64 && !authStore.user?.avatar_file_key">
      <PhotoPickerWeb ref="picker" @select="photoSelected" @clear="photoCleared" />
    </div>
    <div>
      <q-btn v-if="profilePic" label="Save" :loading="saveWait" :disable="saveWait" @click="save" />
      <q-btn v-if="profilePic" label="Reset" :disable="saveWait" @click="resetPhoto" />
      <q-btn v-if="authStore.user?.avatar_file_key" label="Remove" :disable="removeWait" @click="removePhoto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import notifyError from '../../lib/notifyError'
import { useAuthStore } from 'src/stores/auth'
import { Notify } from 'quasar'
import PhotoPickerWeb from 'src/components/PhotoPickerWeb.vue'

const picker = ref<typeof PhotoPickerWeb | null>(null)
const authStore = useAuthStore()
const image64 = ref<string | null>(null)
const profilePic = ref<File | null>(null)
const saveWait = ref(false)
const removeWait = ref(false)

function getBase64 (file: File) : Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

function resetPhoto () {
  if (picker.value) {
    picker.value.reset()
  }
  photoCleared()
}

function photoCleared () {
  image64.value = null
  profilePic.value = null
}

async function photoSelected (file: File) {
  if (file) {
    profilePic.value = file
    image64.value = await getBase64(file)
  } else {
    photoCleared()
  }
}

async function removePhoto () {
  removeWait.value = true
  try {
    await authStore.removeProfilePicture()
  } catch (error) {
    notifyError(error)
  } finally {
    removeWait.value = false
  }
}

async function save () {
  saveWait.value = true
  try {
    if (authStore.user && profilePic.value) {
      // Upload file
      await authStore.updateProfilePicture(profilePic.value)

      resetPhoto()

      Notify.create({
        type: 'positive',
        position: 'top',
        message: 'Profile photo has been updated!'
      })
      photoCleared()
    }
  } catch (error) {
    notifyError(error)
  } finally {
    saveWait.value = false
  }
}
</script>
