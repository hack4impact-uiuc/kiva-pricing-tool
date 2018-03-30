import initialState from './initialState'
import { FIND_LOAN_SUBMIT, FIND_LOAN_BACK } from './../actions/actionTypes'
export default function formDataReducer(state = initialState.formData, action) {
  console.log(action.type)
  switch (action.type) {
    case FIND_LOAN_SUBMIT:
      console.log('MEGHA THIS IS ALL YOUR FAULT')
      return [
        ...state,
        {
          mfi: action.payload.mfi,
          loanType: action.payload.loanType,
          productType: action.payload.productType,
          versionNum: action.payload.versionNum
        }
      ]
    case FIND_LOAN_BACK:
      return [
        ...state,
        {
          mfi: null,
          loanType: null,
          productType: null,
          versionNum: null
        }
      ]
    default:
      console.log('kgjsdfhjfldd')
      return state
  }
}
