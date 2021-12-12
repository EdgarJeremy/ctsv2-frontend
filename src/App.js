import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.css';
// Styles
// Import Flag Icons Set
import 'flag-icon-css/css/flag-icon.min.css';
// Import Font Awesome Icons Set
import 'font-awesome/css/font-awesome.min.css';
// Import Simple Line Icons Set
import 'simple-line-icons/css/simple-line-icons.css';
// Import Main styles for this application
import './scss/style.css'
// import '../node_modules/@coreui/styles/scss/_dropdown-menu-right.scss';
// import "../node_modules/sweetalert/dist/sweetalert.css";

// Containers
import { Full } from './containers';
// Pages
import { Login } from './views/Pages';
import Loadable from "react-loading-overlay";

// import { renderRoutes } from 'react-router-config';
import io from 'socket.io-client';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';
import TVView from './components/TVView';

const integrated_source = localStorage.getItem('integrated_source');
let [protocol, url, port = 80] = integrated_source ? integrated_source.split(':') : [];

const adapter = new SiriusAdapter(process.env.REACT_APP_API_HOST, process.env.REACT_APP_API_PORT, localStorage, 'cts');
const biviAdapter = new SiriusAdapter(url, port, localStorage, 'bivi');

console.log(integrated_source);
class App extends Component {

  state = {
    ready: false,
    models: null,
    authProvider: null,
    biviModels: null,
    biviAuthProvider: null,
    err: null
  }

  socket = null;
  biviSocket = null;

  componentDidMount() {
    this.socket = io(process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT);
    this.biviSocket = io(integrated_source);
    this.socket.on('connect', async () => {
      try {
        const models = await adapter.connect();
        const authProvider = await adapter.getAuthProvider();
        const biviModels = await biviAdapter.connect();
        const biviAuthProvider = await biviAdapter.getAuthProvider();
        this.setState({ ready: true, models, authProvider, biviModels, biviAuthProvider });
      } catch (e) {
        this.setState({
          ready: true,
          err: e
        });
      }
    });
  }

  render() {
    const { ready, models, authProvider } = this.state;
    return (
      ready ? <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" render={(p) => <Login {...p} models={models} authProvider={authProvider} biviModels={this.state.biviModels} biviAuthProvider={this.state.biviAuthProvider} />} />
          <Route path="/tv" name="TV View" render={(p) => <TVView {...p} models={models} authProvider={authProvider} biviModels={this.state.biviModels} biviAuthProvider={this.state.biviAuthProvider} socket={this.socket} biviSocket={this.biviSocket} />} />
          <Route path="/" name="Home" render={(p) => <Full {...p} models={models} authProvider={authProvider} biviModels={this.state.biviModels} biviAuthProvider={this.state.biviAuthProvider} socket={this.socket} biviSocket={this.biviSocket} />} />
        </Switch>
      </HashRouter> :
        <Loadable
          spinnerSize="100px"
          className="loading-full"
          active={true}
          spinner
          color="#000000"
          text="Memuat data.." />
    );
  }
}

export default App;
