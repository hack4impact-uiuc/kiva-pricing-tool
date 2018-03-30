import * as actionTypes from './actionTypes'

function findLoanSubmitted(mfi, loanType, productType, versionNumber) {
  return {
    type: actionTypes.FIND_LOAN_SUBMIT,
    payload: {
      mfi,
      loanType,
      productType,
      versionNumber
    }
  }
}

function backToIntro() {
  return { type: actionTypes.FIND_LOAN_BACK }
}

export function submitFindLoan(mfi, loanType, productType, versionNumber) {
  console.log(mfi, loanType, productType, versionNumber)
  return dispatch => {
    return findLoanSubmitted(mfi, loanType, productType, versionNumber)
  }
}

export function backClickedToIntroButMeghaDoesntApproveOfThisFunctionBecauseItsTooLong() {
  return dispatch => {
    return backToIntro()
  }
}
