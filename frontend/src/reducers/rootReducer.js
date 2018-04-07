// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import stuff from './stuff.reducer'
import colors from './colors.reducer'
import formDataReducer from './formDataReducer'
import * as actionTypes from './../actions/actionTypes'

const appReducer = combineReducers({
  // stuff,
  colors,
  formDataReducer,
  router: routerReducer
})

const rootReducer = (state, action) => {
  if (action.type === actionTypes.RESET) {
    state = undefined
  }

  return appReducer(state, action)
}

export default rootReducer
