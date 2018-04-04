// @flow
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
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
  FormZero,
  IntroPage,
  LiveSearch,
  AdminMain,
  AdminPartners,
  AdminThemes
} from './components'
import registerServiceWorker from './registerServiceWorker'
import './styles/index.css'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Navbar />
        <Route exact path="/" component={IntroPage} />
        <Route path="/newloan" component={FormZero} />
        <Route path="/findloan" component={LiveSearch} />
        <Route path="/adminmain" component={AdminMain} />
        <Route path="/partnerlist" component={AdminPartners} />
        <Route path="/themelist" component={AdminThemes} />
        <Route path="/output" component={APRRateDisplay} />
        <Route path="/form1" component={FormOne} />
      </div>
    </ConnectedRouter>
  </Provider>,
  (document.getElementById('root'): any)
)

registerServiceWorker()
