const formDataReducer = (state = [], action) => {
  switch (action.type) {
    case 'submitFindLoan':
      return [
        ...state,
        {
          mfi: action.mfi,
          loanType: action.loanType,
          productType: action.productType,
          versionNum: action.versionNum
        }
      ]
    case 'backFindLoan':
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
      return state
  }
}

export default formDataReducer
