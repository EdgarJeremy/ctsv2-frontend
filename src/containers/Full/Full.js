import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import "react-notifications/lib/notifications.css";
import { NotificationContainer, NotificationManager } from "react-notifications";

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import FullAside from './FullAside';
import FullFooter from './FullFooter';
import FullHeader from './FullHeader';
import Loadable from "react-loading-overlay"
// import getModels from "../../services/model";
import swal from "sweetalert";
// import socket from "../../components/Socket";

import sfx from "../../components/Sfx";
import Chat from "../../components/Chat";

class Full extends Component {

  state = {
    ready: false,
    childReady: false,
    userdata: {},
    biviuserdata: {},
    models: null,
    pendingCount: null,
    chats: []
  }

  current_child = null;

  componentWillMount() {
    this._cekStatus();
    // socket.off("update");
    // socket.on("update", this._onSocketUpdate.bind(this));
    // socket.on("incoming_chat", this._onIncomingChat.bind(this));

    // getModels().then((models) => {
    //   this.setState({ models }, () => {
    //     this._cekStatus();
    //     this._getPendingCount();
    //   });
    // });
  }

  _onReceiveAllOnline(online) {
    // let { chats } = this.state;
    // chats.forEach((chat, i) => {
    //   chats[i].to.online = false;
    //   chats[i].to.socketid = null;
    //   online.forEach((on, j) => {
    //     if (chat.to.id_pengguna === on.id_pengguna) {
    //       chats[i].to.online = true;
    //       chats[i].to.socketid = on.socketid;
    //     }
    //   });
    // });
    // this.setState({ chats });
  }

  _onIncomingChat(data) {
    // if (!this._chatExists(data.from)) sfx.play();
    // data.from.online = true;
    // this._addChat(data.from);
  }

  _chatExists(metadata) {
    // let { chats } = this.state;
    // let ada = false;
    // chats.forEach((chat, i) => {
    //   chats[i].open = false;
    //   if (chats[i].to.id_pengguna === metadata.id_pengguna) ada = true
    // });
    // return ada;
  }

  _addChat(metadata) {
    // let { chats } = this.state;
    // if (!this._chatExists(metadata)) {
    //   chats.push({
    //     to: { ...metadata },
    //     open: true
    //   });
    //   this.setState({ chats });
    // } else {
    //   chats.forEach((chat, i) => {
    //     chats[i].open = false;
    //     if (chats[i].to.id_pengguna === metadata.id_pengguna) chats[i].open = true;
    //   });
    //   this.setState({ chats });
    // }
  }

  _onSocketUpdate(data) {
    // if (this.current_child)
    //   if (this.current_child.onSocketUpdate)
    //     this.current_child.onSocketUpdate(data);
    // this._getPendingCount();
    NotificationManager.info("Cek daftar masuk. Ada pendaftaran yang harus anda urus", "Pendaftaran baru");
    sfx.play();
  }

  _cekStatus() {
    // this.state.models.api.cek_status().then((data) => {
    //   if (!data.status) this.props.history.replace("/login");
    //   else this.setState({ userdata: data.data, ready: true });
    // });
    this.props.authProvider.get().then((user) => {
      this.props.socket.off('NEW_TRACK');
      this.props.socket.on('NEW_TRACK', (data) => {
        if (data.user_id === user.id) {
          this._onSocketUpdate(data);
          this._getPendingCount();
        }
      });
      this.props.biviAuthProvider.get().then((biviUser) => {
        this.setState({ userdata: user, biviuserdata: biviUser, ready: true }, () => {
          this._getPendingCount();
        });
      }).catch(() => {
        this.setState({ userdata: user, ready: true }, () => {
          this._getPendingCount();
        });
      });
    }).catch((err) => {
      this.props.history.replace('/login');
    });
  }

  _getPendingCount() {
    // this.state.models.authenticated.pendaftaran_count_pending().then((data) => {
    //   if (data.status === true)
    //     this.setState({ pendingCount: data.data.total });
    // }).catch(this.props._apiReject);
    this.props.models.Registration.collection({
      attributes: ['id'],
      where: {
        user_id: this.state.userdata.id
      }
    }).then((d) => {
      this.setState({ pendingCount: d.count });
    });
  }

  componentDidUpdate(prevProps) {
    // if (this.props.location !== prevProps.location) {
    //   this._cekStatus();
    // }
  }

  _handleReject(e) {
    let msg = '';
    if (e.errors) {
      msg = e.errors.map((e) => e.msg).join('\n');
    } else {
      msg = e.message;
    }
    swal("Terjadi Kesalahan", msg, "error");
  }

  _updateParent() {
    // this._getPendingCount();
  }

  render() {
    return (
      (this.state.ready) ?
        <div className="app">
          <AppHeader fixed>
            <FullHeader userdata={this.state.userdata} pendingCount={this.state.pendingCount} {...this.props} />
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <AppSidebarNav navConfig={navigation(this.state.userdata)} {...this.props} />
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <Container className="main-container" fluid>
                <AppBreadcrumb appRoutes={routes} />
                <div className="container-mod">
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component updateParent={this._updateParent.bind(this)} ref={(c) => this.current_child = c} {...this.props} _userdata={this.state.userdata} _biviuserdata={this.state.biviuserdata} _apiReject={this._handleReject.bind(this)} {...props} />
                      )} />)
                        : (null);
                    },
                    )}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </div>
              </Container>
              <AppFooter>
                <FullFooter />
              </AppFooter>
              <div className="chat chat-container">
                {(this.state.chats.map((chat, i) => (
                  <Chat
                    notificationManager={NotificationManager}
                    key={i}
                    // socket={socket}
                    models={this.state.models}
                    me={this.state.userdata.id_pengguna}
                    to={chat.to}
                    open={this.state.chats[i].open}
                    toggle={() => {
                      let { chats } = this.state;
                      if (!chats[i].open) {
                        chats.forEach((chat, i) => chats[i].open = false);
                      }
                      chats[i].open = !chats[i].open;
                      this.setState({ chats });
                    }}
                    remove={() => {
                      let { chats } = this.state;
                      chats.splice(i, 1);
                      this.setState({ chats });
                    }}></Chat>
                )))}
              </div>
            </main>
            <AppAside fixed>
              <FullAside onReceiveAllOnline={this._onReceiveAllOnline.bind(this)} addChat={this._addChat.bind(this)} notificationManager={NotificationManager} /*socket={socket}*/ userdata={this.state.userdata} models={this.state.models} />
            </AppAside>
          </div>
          <NotificationContainer />
        </div> :
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

export default Full;
