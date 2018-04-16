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

// const todos = (state = [], action) => {
//   switch (action.type) {
//     case 'SUBMIT_NEW_LOAN':
//       return [
//         ...state,
//         {
//           id: action.id,
//           text: action.text,
//           completed: false
//         }
//       ]
//     case 'TOGGLE_TODO':
//       return state.map(todo =>
//         (todo.id === action.id)
//           ? {...todo, completed: !todo.completed}
//           : todo
//       )
//     default:
//       return state
//   }
// }
//
// export default todos
