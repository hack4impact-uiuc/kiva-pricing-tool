// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import stuff from './stuff.reducer'
import colors from './colors.reducer'
import loanSearchReducer from './loanSearchReducer'

const rootReducer = combineReducers({
  // stuff,
  colors,
  loanSearchReducer,
  router: routerReducer
})

export default rootReducer
