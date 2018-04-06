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

export function changedFormData(field, value) {
  return dispatch => dispatch(formDataChanged(field, value))
}

export function submitFindLoan(mfi, loanType, productType, versionNumber) {
  return dispatch =>
    dispatch(formDataChanged(mfi, loanType, productType, versionNumber))
}
