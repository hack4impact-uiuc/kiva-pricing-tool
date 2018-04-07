// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import formDataReducer from './formDataReducer'
import * as actionTypes from './../actions/actionTypes'

const appReducer = combineReducers({
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
