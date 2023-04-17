import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { graphql } from 'src/lib/graphql'
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

    const response = await graphql(`
      mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
          id
          token
        }
      }
    `,
    {
      email,
      password
    })
    if (response.register && response.register.id) {
      // Note, set token first so that syncUser() can use it
      token.value = response.register.token
      id.value = response.register.id
    } else {
      throw new Error('Registration failed!')
    }
  }

  async function getUser (id: string) : Promise<User | null> {
    const response = await graphql(`
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
    `,
    {
      id
    }, token.value)
    if (response && response.users_by_pk) {
      return payloadToUser(response.users_by_pk)
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
    const response = await graphql(`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          id
          token
        }
      }
    `,
    {
      email,
      password
    })
    if (response.login && response.login.id) {
      // Note, set token first so that syncUser() can use it
      token.value = response.login.token
      id.value = response.login.id
    } else {
      throw new Error('Login failed!')
    }
  }

  function logout () {
    id.value = ''
    token.value = ''
  }

  async function sendPasswordReset (email: string) : Promise<void> {
    await graphql(`
      mutation SendPasswordResetEmail($email: String!) {
        sendPasswordResetEmail(email: $email)
      }
    `,
    {
      email
    })
  }

  async function sendVerification () : Promise<void> {
    if (token.value) {
      await graphql(`
        mutation ResendVerificationEmail {
          resendVerificationEmail
        }
      `,
      null, token.value)
    }
  }

  async function updateDisplayName (newDisplayName: string) : Promise<void> {
    if (token.value) {
      // Update display_name
      await graphql(`mutation UpdateDisplayName($id: uuid!, $display_name: String!) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {display_name: $display_name}) {
          display_name
        }
      }`
      , {
        id: id.value,
        display_name: newDisplayName
      }, token.value)
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
      await graphql(`mutation UpdateDisplayName($id: uuid!, $avatar_file_key: String!) {
        update_users_by_pk(pk_columns: {id: $id}, _set: {avatar_file_key: $avatar_file_key}) {
          avatar_file_key
        }
      }`
      , {
        id: id.value,
        avatar_file_key: null
      }, token.value)
      await syncUser()
    } else {
      throw new Error('Authentication required.')
    }
  }

  async function updateEmail (newEmail: string, password: string) : Promise<void> {
    if (token.value) {
      await graphql(`mutation ChangeEmail($newEmail: String!, $password: String!) {
        changeEmail(newEmail: $newEmail, password: $password)
      }`, {
        newEmail,
        password
      }, token.value)
      await syncUser()
    } else {
      throw new Error('Authentication required')
    }
  }

  async function changePassword (oldPassword: string, newPassword: string) {
    if (token.value) {
      await graphql(`mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
        changePassword(newPassword: $newPassword, oldPassword: $oldPassword)
      }`, {
        newPassword,
        oldPassword
      }, token.value)
      logout()
    } else {
      throw new Error('Authentication required')
    }
  }

  async function destroyAccount (password: string) {
    if (token.value) {
      await graphql(`mutation DestroyUser($password: String!) {
        destroyUser(password: $password)
      }`, {
        password
      }, token.value)
      logout()
    } else {
      throw new Error('Authentication required.')
    }
  }

  async function verifyEmail (code: string) {
    await graphql(`mutation VerifyEmail($code: String!) {
      verifyEmail(code: $code)
    }`, {
      code
    })
    await syncUser()
  }

  async function resetPassword (code: string, email: string, newPassword: string) {
    await graphql(`mutation ResetPassword($code: String!, $email: String!, $newPassword: String!) {
      resetPassword(code: $code, email: $email, newPassword: $newPassword)
    }`, {
      code,
      email,
      newPassword
    })
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
