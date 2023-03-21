import { request, gql } from 'graphql-request'
import _ from 'lodash'

export const graphql = async (query: any, variables: any, token = '') => {
  try {
    if (!variables) {
      variables = null
    }

    let headers: any = null
    if (token) {
      headers = { Authorization: 'Bearer ' + token }
    }

    const result : any = await request((import.meta.env.VITE_HASURA_BASE_URL || 'http://localhost:8080') + '/v1/graphql', gql`${query}`, variables, headers)
    if (_.has(result, 'errors')) {
      throw new Error(result.errors[0].message)
    }
    return result
  } catch (error) {
    // Re-throw errors as a normal Error/message
    if (_.has(error, 'response.errors.0.message')) {
      console.log(error)
      throw new Error((error as any).response.errors[0].message)
    }
    throw (error)
  }
}

export const graphqlGenerateVariableDeclarations = (variableTypes: any) => {
  const declarations = []
  for (const key of _.keys(variableTypes)) {
    declarations.push(`$${key}: ${variableTypes[key]}`)
  }
  return declarations.join(', ')
}

export const graphqlGenerateVariablesObject = (variables: any) => {
  const objectFields = []
  for (const key of _.keys(variables)) {
    objectFields.push(`${key}: $${key}`)
  }
  return objectFields.join(', ')
}
