// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import stuff from './stuff.reducer'
import colors from './colors.reducer'
import formDataReducer from './formDataReducer'

const rootReducer = combineReducers({
  stuff,
  colors,
  formDataReducer,
  router: routerReducer
})

export default rootReducer
