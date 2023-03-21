<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar ref="toolbar" class="bg-purple-9">
        <q-avatar>
          <img src="~src/assets/quasar-logo-vertical.svg">
        </q-avatar>
        <q-toolbar-title>
          <router-link :to="{name: 'home'}" style="text-decoration: none; color: white;">
            AppName
          </router-link>
        </q-toolbar-title>

        <q-btn stretch flat label="Pricing" class="gt-sm" :to="{name: 'pricing'}" />
        <q-btn stretch flat label="About" class="gt-sm" :to="{name: 'about'}" />
        <q-btn stretch flat label="Contact" class="gt-sm" :to="{name: 'contact'}" />

        <!-- Not LoggedIn = Login Button -->
        <q-btn stretch flat label="Login" :to="{name: 'login'}" v-if="!authStore.authenticated" />

        <!-- LoggedIn = Menu -->
        <q-btn-dropdown v-if="authStore.authenticated" stretch flat>
          <template v-slot:label>
            <q-avatar v-if="authStore.user && authStore.user.avatar_file_key">
              <img
                :src="authStore.userAvatarKeyToUrl(authStore.user.avatar_file_key)"
              />
            </q-avatar>
            <q-avatar v-else icon="account_circle" />
          </template>
          <q-list>
            <q-item>
              <q-btn stretch flat label="Profile" v-if="authStore.authenticated" :to="{name: 'profile'}" />
            </q-item>
            <q-item>
              <q-btn stretch flat label="Logout" v-if="authStore.authenticated" @click="performLogout" />
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn-dropdown stretch flat class="lt-md" dropdown-icon="more_vert">
          <q-list>
            <q-item>
              <q-btn stretch flat label="Pricing" :to="{name: 'pricing'}" />
            </q-item>
            <q-item>
              <q-btn stretch flat label="About" :to="{name: 'about'}" />
            </q-item>
            <q-item>
              <q-btn stretch flat label="Contact" :to="{name: 'contact'}" />
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <EmailVerificationCheckBanner />
      <router-view />
    </q-page-container>

    <q-footer elevated v-if="authStore.authenticated" class="bg-red-6">
      <!-- <q-toolbar class="row">
        <div class="col text-center">
          <q-btn stretch flat label="Tests" :to="{name: 'tests'}" class="gt-xs" />
          <q-btn stretch flat icon="tests" :to="{name: 'tests'}" class="lt-sm">
            <q-tooltip>
              Tests
            </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar> -->
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import EmailVerificationCheckBanner from 'components/EmailVerificationCheckBanner.vue'

const authStore = useAuthStore()
const router = useRouter()

async function performLogout () {
  await authStore.logout()
  router.push({ name: 'home' })
}
</script>
