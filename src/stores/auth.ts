import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { graphql } from 'src/gql'
import { client } from 'src/lib/graphql'
import { parseISO } from 'date-fns'
import { api } from 'boot/axios'

export interface User {
  id: string,
  email: string,
  display_name?: string,
  avatar_file_key?: string,
  email_verified: boolean,
  created_at: Date,
  updated_at: Date
}

// For generating profile picture urls
const filesBaseUrl = import.meta.env.VITE_NODE_BASE_URL || 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth:token') || '')
  const id = ref(localStorage.getItem('auth:id') || '')
  const user = ref<User | null>(null)

  watch(() => token.value, (newToken: string) => {
    localStorage.setItem('auth:token', newToken)
  })

  watch(() => id.value, (newId: string) => {
    localStorage.setItem('auth:id', newId)
    if (!id.value) {
      user.value = null
    } else {
      syncUser()
    }
  })

  async function syncUser () {
    if (id.value && token.value) {
      user.value = await getUser(id.value)
    } else {
      user.value = null
    }
  }

  syncUser()

  async function register (email: string, password: string, passwordConfirm: string) : Promise<void> {
    if (password !== passwordConfirm) {
      throw new Error('Password and confirmation do not match!')
    }

    const result = await client.mutation(graphql(`
    mutation register($email: String!, $password: String!) {
      register(email: $email, password: $password) {
        token
        id
      }
    }`), { email, password })
    if (result.error) {
      throw result.error
    }

    if (result.data?.register?.id && result.data?.register?.token) {
      // Note, set token first so that syncUser() can use it
      token.value = result.data.register.token
      id.value = result.data.register.id
    } else {
      throw new Error('Registration failed!')
    }
  }

  async function getUser (id: string) : Promise<User | null> {
    const result = await client.query(graphql(`
      query GetUser($id: uuid!) {
        users_by_pk(id: $id) {
          id
          email
          display_name
          avatar_file_key
          email_verified
          created_at
          updated_at
        }
      }
    `), {
      id
    }, { cachePolicy: 'network-only', requestPolicy: 'network-only' })
    if (result.error) {
      throw result.error
    }
    if (result.data && result.data.users_by_pk) {
      return payloadToUser(result.data.users_by_pk)
    }
    return null
  }

  function payloadToUser (payload: any) : User {
    return {
      id: payload.id,
      email: payload.email,
      display_name: payload.display_name,
      avatar_file_key: payload.avatar_file_key,
      email_verified: payload.email_verified,
      created_at: parseISO(payload.created_at),
      updated_at: parseISO(payload.updated_at)
    }
  }

  async function login (email: string, password: string) : Promise<void> {
    const result = await client.mutation(graphql(`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          token
        }
      }
    `), {
      email,
      password
    })
    if (result.error) {
      throw result.error
    }
    if (result.data?.login && result.data?.login.id) {
      // Note, set token first so that syncUser() can use it
      token.value = result.data.login.token
      id.value = result.data.login.id
    } else {
      throw new Error('Login failed!')
    }
  }

  function logout () {
    id.value = ''
    token.value = ''
  }

  async function sendPasswordReset (email: string) : Promise<void> {
    const result = await client.mutation(graphql(`
      mutation SendPasswordResetEmail($email: String!) {
        sendPasswordResetEmail(email: $email)
      }
    `), {
      email
    })
    if (result.error) {
      throw result.error
    }
  }

  async function sendVerification () : Promise<void> {
    if (token.value) {
      const result = await client.mutation(graphql(`
        mutation ResendVerificationEmail {
          resendVerificationEmail
        }
      `), {})
      if (result.error) {
        throw result.error
      }
    }
  }

  async function updateDisplayName (newDisplayName: string) : Promise<void> {
    if (token.value) {
      // Update display_name
      const result = await client.mutation(graphql(`mutation UpdateDisplayName($id: uuid!, $display_name: String!) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {display_name: $display_name}) {
          display_name
        }
      }`), {
        id: id.value,
        display_name: newDisplayName
      })
      if (result.error) {
        throw result.error
      }
      await syncUser()
    } else {
      throw new Error('Authentication required.')
    }
  }

  function userAvatarKeyToUrl (key: string) : string {
    return filesBaseUrl + '/files/user-avatar/' + key
  }

  async function updateProfilePicture (photoFile: File) : Promise<void> {
    if (token.value) {
      // post multipart/form-data to /files/user-avatar
      const form = new FormData()
      form.append('avatar', photoFile)
      await api.post('/files/user-avatar', form, {
        headers: {
          Authorization: 'Bearer ' + token.value
        }
      })
      await syncUser()
    } else {
      throw new Error('Authentication required.')
    }
  }

  async function removeProfilePicture () : Promise<void> {
    if (token.value) {
      // Update avatar_file_key
      const result = await client.mutation(graphql(`mutation RemoveProfilePicture($id: uuid!, $avatar_file_key: String) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {avatar_file_key: $avatar_file_key}) {
          avatar_file_key
        }
      }`), {
        id: id.value,
        avatar_file_key: null
      })
      if (result.error) {
        throw result.error
      }
      await syncUser()
    } else {
      throw new Error('Authentication required.')
    }
  }

  async function updateEmail (newEmail: string, password: string) : Promise<void> {
    if (token.value) {
      const result = await client.mutation(graphql(`mutation ChangeEmail($newEmail: String!, $password: String!) {
        changeEmail(newEmail: $newEmail, password: $password)
      }`), {
        newEmail,
        password
      })
      if (result.error) {
        throw result.error
      }
      await syncUser()
    } else {
      throw new Error('Authentication required')
    }
  }

  async function changePassword (oldPassword: string, newPassword: string) {
    if (token.value) {
      const result = await client.mutation(graphql(`mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
        changePassword(newPassword: $newPassword, oldPassword: $oldPassword)
      }`), {
        newPassword,
        oldPassword
      })
      if (result.error) {
        throw result.error
      }
      logout()
    } else {
      throw new Error('Authentication required')
    }
  }

  async function destroyAccount (password: string) {
    if (token.value) {
      const result = await client.mutation(graphql(`mutation DestroyUser($password: String!) {
        destroyUser(password: $password)
      }`), {
        password
      })
      if (result.error) {
        throw result.error
      }
      logout()
    } else {
      throw new Error('Authentication required.')
    }
  }

  async function verifyEmail (code: string) {
    const result = await client.mutation(graphql(`mutation VerifyEmail($code: String!) {
      verifyEmail(code: $code)
    }`), {
      code
    })
    if (result.error) {
      throw result.error
    }
    await syncUser()
  }

  async function resetPassword (code: string, email: string, newPassword: string) {
    const result = await client.mutation(graphql(`mutation ResetPassword($code: String!, $email: String!, $newPassword: String!) {
      resetPassword(code: $code, email: $email, newPassword: $newPassword)
    }`), {
      code,
      email,
      newPassword
    })
    if (result.error) {
      throw result.error
    }
  }

  const authenticated = computed(() => {
    return !!token.value
  })

  return {
    // state properties
    token,
    id,
    user,
    // actions
    register,
    login,
    logout,
    getUser,
    sendPasswordReset,
    sendVerification,
    updateDisplayName,
    updateEmail,
    changePassword,
    updateProfilePicture,
    removeProfilePicture,
    destroyAccount,
    userAvatarKeyToUrl,
    syncUser,
    verifyEmail,
    resetPassword,
    // getters
    authenticated
  }
})
