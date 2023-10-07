<template>
  <q-page v-if="authStore.user">
    <div class="q-pa-md text-center">
      <h4>Profile</h4>
    </div>
    <div class="q-pa-md">
      <q-input
        filled
        v-model="authStore.user.id"
        type="text"
        label="User Id"
        readonly
        />
    </div>
    <div class="q-pa-md">
      <q-input
        filled
        v-model="displayName"
        type="text"
        label="DisplayName"
        />
      <q-btn
        color="primary"
        label="Save"
        @click="updateDisplayName"
        :loading="updateDisplayNameWait"
        :disable="updateDisplayNameWait || !displayNameChanged"
        />
    </div>

    <div class="q-pa-md">
      <q-input
        filled
        v-model="email"
        type="text"
        label="Email"
        />
      <q-input
        filled
        v-model="emailChangePassword"
        type="password"
        label="Password (Required to Change Email)"
        />
      <q-btn
        color="primary"
        label="Save"
        @click="updateEmail"
        :loading="updateEmailWait"
        :disable="updateEmailWait || !emailChanged"
        />
    </div>

    <div class="q-pa-md">
      <q-btn
        icon="key"
        label="Change Password"
        @click="showChangePasswordDialog = true"
        />

      <q-dialog v-model="showChangePasswordDialog">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Change Password</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-input
            filled
            v-model="oldPassword"
            :type="hideOldPassword ? 'password' : 'text'"
            label="Old Password"
            :rules="[
              (val) => (val && val.length > 0) || 'Password must be filled in.',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="hideOldPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hideOldPassword = !hideOldPassword"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="newPassword"
            :type="hideNewPassword ? 'password' : 'text'"
            label="New Password"
            @keyup.enter="changePassword"
            :rules="[
              (val) => (val && val.length > 0) || 'Password must be filled in.',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="hideNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="hideNewPassword = !hideNewPassword"
              />
            </template>
          </q-input>

          <q-btn
            color="primary"
            label="Save"
            @click="changePassword"
            :loading="changePasswordWait"
            :disable="changePasswordWait"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>

    <div class="q-pa-md">
      <h5>Profile Picture</h5>
      <UserProfilePhotoPicker />
    </div>

    <div class="q-pa-md">
      <h5>Danger Zone</h5>
      <q-btn
        icon="delete"
        color="red"
        label="Destroy Account"
        @click="showDestroyAccountDialog = true"
        />

      <q-dialog v-model="showDestroyAccountDialog">
        <q-card>
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Destroy Account</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <p>
              Your AppName account and all the data it contains will be permanently destroyed.
            </p>

            <q-input
              filled
              v-model="destroyPassword"
              :type="hideDestroyPassword ? 'password' : 'text'"
              label="Password"
              :rules="[
                (val) => (val && val.length > 0) || 'Password must be filled in.',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="hideDestroyPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="hideDestroyPassword = !hideDestroyPassword"
                />
              </template>
            </q-input>

            <q-btn
              color="red"
              label="Destroy Account"
              @click="destroyAccount"
              :loading="destroyAccountWait"
              :disable="destroyAccountWait"
              />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import notifyError from 'src/lib/notifyError'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'
import UserProfilePhotoPicker from 'components/user/UserProfilePhotoPicker.vue'

const router = useRouter()
const authStore = useAuthStore()

const updateDisplayNameWait = ref(false)
const displayName = ref(authStore.user?.display_name || '')

const updateEmailWait = ref(false)
const email = ref(authStore.user?.email || '')
const emailChangePassword = ref('')

const showChangePasswordDialog = ref(false)
const changePasswordWait = ref(false)
const hideOldPassword = ref(true)
const oldPassword = ref('')
const hideNewPassword = ref(true)
const newPassword = ref('')
const showDestroyAccountDialog = ref(false)
const destroyAccountWait = ref(false)
const hideDestroyPassword = ref(true)
const destroyPassword = ref('')

const emailChanged = computed(() => {
  return email.value !== authStore.user?.email
})

const displayNameChanged = computed(() => {
  return displayName.value !== authStore.user?.display_name
})

async function updateDisplayName () {
  try {
    updateDisplayNameWait.value = true
    await authStore.updateDisplayName(displayName.value)
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Display name has been updated.'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    updateDisplayNameWait.value = false
  }
}

async function changePassword () {
  try {
    changePasswordWait.value = true
    await authStore.changePassword(oldPassword.value, newPassword.value)
    showChangePasswordDialog.value = false
    router.push({ name: 'login', query: { next: '/profile' } })
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Password has been updated. Please login with new password.'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    changePasswordWait.value = false
  }
}

async function updateEmail () {
  try {
    updateEmailWait.value = true
    await authStore.updateEmail(email.value, emailChangePassword.value)
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Email has been updated.  Please check inbox for verification message!'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    updateEmailWait.value = false
  }
}

async function destroyAccount () {
  try {
    destroyAccountWait.value = true
    await authStore.destroyAccount(destroyPassword.value)
    router.push({ name: 'login', query: { next: '/profile' } })
    Notify.create({
      type: 'positive',
      position: 'top',
      message: 'Your account and all data it contained has been permanently destroyed!'
    })
  } catch (error) {
    notifyError(error)
  } finally {
    destroyAccountWait.value = false
  }
}
</script>
