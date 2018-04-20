import initialState from './initialState'
import { FIELD_CHANGED, RESET } from './../actions/actionTypes'

export default function formDataReducer(state = initialState.formData, action) {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,

        [action.payload.field]: action.payload.value
      }
    case RESET:
      return {}
    default:
      return state
  }
}
