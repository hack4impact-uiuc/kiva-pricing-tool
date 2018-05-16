const todos = (state = [], action) => {
  switch (action.type) {
    case 'SUBMIT_NEW_LOAN':
      return [
        ...state,
        {
          MFIPartner: action.MFIPartner,
          loanType: action.loanType,
          productType: action.productType,
          versionNum: action.versionNum
        }
      ]
    case 'BACK_NEW_LOAN':
      return [
        ...state,
        {
          MFIPartner: null,
          loanType: null,
          productType: null,
          versionNum: null
        }
      ]
    default:
      return state
  }
}

export default todos
