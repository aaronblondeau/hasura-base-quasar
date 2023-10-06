import { defineStore } from 'pinia'
import { graphql } from 'src/gql'
import { client } from 'src/lib/graphql'

export const useContactFormSubmissionStore = defineStore('contact-form-submission', () => {
  async function submitContactForm (name: string, email: string, message: string) {
    const result = await client.mutation(graphql(`
    mutation SubmitContactForm($name: String!, $email: String!, $message: String!) {
      insert_contact_form_submissions(objects: {email: $email, message: $message, name: $name}) {
        affected_rows
      }
    }
    `), { name, email, message })
    if (result.error) {
      throw result.error
    }
  }

  return {
    submitContactForm
  }
})
