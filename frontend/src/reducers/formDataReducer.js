import initialState from './initialState'
import {
  FIND_LOAN_SUBMIT,
  FIND_LOAN_BACK,
  NEW_LOAN_CONT
} from './../actions/actionTypes'

export default function formDataReducer(state = initialState.formData, action) {
  console.log(action.payload)
  switch (action.type) {
    case FIND_LOAN_SUBMIT:
      return {
        ...state,

        mfi: action.payload.mfi,
        loanType: action.payload.loanType,
        productType: action.payload.productType,
        versionNum: action.payload.versionNumber
      }
      break
    case FIND_LOAN_BACK:
      return {
        ...state,

        mfi: null,
        loanType: null,
        productType: null,
        versionNum: null
      }
      break
    case NEW_LOAN_CONT:
      return {
        ...state,

        mfi: action.payload.mfi,
        loanType: action.payload.loanType,
        productType: action.payload.productType
      }
    default:
      return state
  }
}
