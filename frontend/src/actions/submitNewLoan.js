// submitNewLoan
// Basically add to reducers
// backNewLoan
// Basically mapStateToProps all saved info

export const submitNewLoan = (
  MFIPartner,
  loanType,
  productType,
  versionNum
) => ({
  type: 'SUBMIT_NEW_LOAN',
  MFIPartner,
  loanType,
  productType,
  versionNum
})

// let nextTodoId = 0
// export const addTodo = text => ({
//   type: 'ADD_TODO',
//   id: nextTodoId++,
//   text
// })
//
// export const setVisibilityFilter = filter => ({
//   type: 'SET_VISIBILITY_FILTER',
//   filter
// })
//
// export const toggleTodo = id => ({
//   type: 'TOGGLE_TODO',
//   id
// })
//
// export const VisibilityFilters = {
//   SHOW_ALL: 'SHOW_ALL',
//   SHOW_COMPLETED: 'SHOW_COMPLETED',
//   SHOW_ACTIVE: 'SHOW_ACTIVE'
// }
