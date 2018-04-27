import initialState from './initialState'
import { FIELD_CHANGED, RESET, SEARCH } from './../actions/actionTypes'

export default function formDataReducer(state = initialState.formData, action) {
  switch (action.type) {
    case FIELD_CHANGED:
      return {
        ...state,

        [action.payload.field]: action.payload.value
      }
    case RESET:
      return initialState.formData
    case SEARCH:
      let prevState = { ...state }
      for (var key in action.payload.results) {
        prevState = {
          ...prevState,
          [key]: [action.payload.results[key]]
        }
      }
      return prevState
    default:
      return {
        ...state
      }
  }
}
