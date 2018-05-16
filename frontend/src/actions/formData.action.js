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

function getLoanData(results) {
  return {
    type: actionTypes.SEARCH,
    payload: {
      results
    }
  }
}

export function searchLoan(results) {
  return dispatch => dispatch(getLoanData(results))
}
export function changedFormData(field, value) {
  return dispatch => dispatch(formDataChanged(field, value))
}

export function resetFormData() {
  return dispatch => dispatch(formDataReset())
}
