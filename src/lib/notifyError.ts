import { Notify } from 'quasar'
import _ from 'lodash'

export function extractErrorMessage (error: unknown) {
  if (error instanceof Error) {
    return error.message + ''
  } else {
    if (_.has(error, 'message')) {
      return (error as { message: string }).message + ''
    } else {
      return error + ''
    }
  }
}

export default function notifyError (error: unknown) {
  console.error(error)
  Notify.create({
    type: 'negative',
    message: extractErrorMessage(error)
  })
}
