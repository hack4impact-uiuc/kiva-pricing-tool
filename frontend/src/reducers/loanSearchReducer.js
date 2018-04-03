import initialState from './initialState'
import { FIND_LOAN_SUBMIT, FIND_LOAN_BACK } from './../actions/actionTypes'

export default function loanSearchReducer(
  state = initialState.formSearch,
  action
) {
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
        ...state

        // mfi: null,
        // loanType: null,
        // productType: null,
        // versionNum: null
      }
      break
    default:
      console.log('kgjsdfhjfldd')
      return state
  }
}
