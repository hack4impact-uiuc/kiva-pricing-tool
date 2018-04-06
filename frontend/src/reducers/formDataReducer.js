import initialState from './initialState'
import { FIELD_CHANGED } from './../actions/actionTypes'

export default function formDataReducer(state = initialState.formData, action) {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,

        [action.payload.field]: action.payload.value
      }
    default:
      return state
  }
}
