import * as actionTypes from './actionTypes'

function formDataChanged(field, value) {
  return {
    type: actionTypes.FIELD_CHANGED,
    payload: {
      field,
      value
    }
  }
}

function formDataReset() {
  return {
    type: actionTypes.RESET
  }
}

export function changedFormData(field, value) {
  return dispatch => dispatch(formDataChanged(field, value))
}

export function resetFormData() {
  return dispatch => dispatch(formDataReset())
}
