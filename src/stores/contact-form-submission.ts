import { defineStore } from 'pinia'
import { graphql, graphqlGenerateVariableDeclarations, graphqlGenerateVariablesObject } from 'src/lib/graphql'
import { useAuthStore } from './auth'

export const useContactFormSubmissionStore = defineStore('contact-form-submission', () => {
  const authStore = useAuthStore()
  async function submitContactForm (name: string, email: string, message: string) {
    const variables = {
      name,
      email,
      message
    }

    const variableTypes = {
      name: 'String',
      email: 'String!',
      message: 'String'
    }

    const response = await graphql(`
      mutation createContactFormSubmission(${graphqlGenerateVariableDeclarations(variableTypes)}) {
        insert_contact_form_submissions(objects: {${graphqlGenerateVariablesObject(variables)}}) {
          affected_rows
      }
    }`, variables, authStore.token)
    if (response && response.insert_contact_form_submissions) {
      return response.insert_contact_form_submissions
    }
  }

  return {
    submitContactForm
  }
})
