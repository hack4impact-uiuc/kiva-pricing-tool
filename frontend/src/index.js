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
import { App, Colors, Navbar, APRRateDisplay } from './components'
import registerServiceWorker from './registerServiceWorker'
import './styles/index.css'
 
ReactDOM.render(<App />, document.getElementById('root'))
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Navbar />
        <Route exact path="/" component={App} />
        <Route path="/colors" component={Colors} />
        <Route path="/output" component={APRRateDisplay} />
      </div>
    </ConnectedRouter>
  </Provider>,
  (document.getElementById('root'): any)
)

registerServiceWorker()