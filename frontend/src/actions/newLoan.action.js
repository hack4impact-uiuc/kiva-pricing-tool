import * as actionTypes from './actionTypes'

function newLoanCont(mfi, loanType, productType) {
  console.log(mfi, loanType, productType)
  return {
    type: actionTypes.NEW_LOAN_CONT,
    payload: {
      mfi,
      loanType,
      productType
    }
  }
}

export function contNewLoan(mfi, loanType, productType) {
  console.log(mfi, loanType, productType)
  return dispatch => dispatch(newLoanCont(mfi, loanType, productType))
}
