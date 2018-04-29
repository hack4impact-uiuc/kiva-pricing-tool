// @flow
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
// import 'typeface-raleway'
// import 'typeface-montserrat'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import { ToastContainer, ToastMessage } from 'react-toastr'

import configureStore, { history } from './store/configureStore'
import {
  Navbar,
  APRRateDisplay,
  APRInputs,
  NewLoan,
  IntroPage,
  FindLoan,
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
        <Route path="/newloan" component={NewLoan} />
        <Route path="/findloan" component={FindLoan} />
        <Route path="/partnerlist" component={AdminPartners} />
        <Route path="/themelist" component={AdminThemes} />
        <Route path="/output" component={APRRateDisplay} />
        <Route path="/form1" component={APRInputs} />
      </div>
    </ConnectedRouter>
  </Provider>,
  (document.getElementById('root'): any)
)

registerServiceWorker()
