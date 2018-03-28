// @flow
import { fetchStuff } from './stuff.action'
export const submitFindLoan = (mfi, loanType, productType, versionNumber) => ({
  type: 'submitFindLoan',
  payload: {
    mfi,
    loanType,
    productType,
    versionNumber
  }
})

export const backFindLoan = {
  type: 'backFindLoan'
}

export { fetchStuff }
