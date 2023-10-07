import { Client, cacheExchange, fetchExchange } from '@urql/vue'
import { useAuthStore } from '../stores/auth'

export const client = new Client({
  url: (import.meta.env.VITE_HASURA_BASE_URL || 'http://localhost:8080') + '/v1/graphql',
  fetchOptions: () => {
    const authStore = useAuthStore()
    const token = authStore.token
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  },
  exchanges: [cacheExchange, fetchExchange]
})
