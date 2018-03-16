// @flow
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'

import configureStore, { history } from './store/configureStore'
import {
  Colors,
  Navbar,
  APRRateDisplay,
  FormOne,
  MVPNewLoan
} from './components'
import registerServiceWorker from './registerServiceWorker'
import './styles/index.css'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Navbar />
        <Route exact path="/" component={App} />
        <Route path="/newloan" component={MVPNewLoan} />
        <Route path="/output" component={APRRateDisplay} />
        <Route path="/form1" component={FormOne} />
      </div>
    </ConnectedRouter>
  </Provider>,
  (document.getElementById('root'): any)
)

registerServiceWorker()
