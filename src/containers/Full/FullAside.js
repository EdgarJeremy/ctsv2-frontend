import React, { Component } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import swal from "sweetalert";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class FullAside extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      pengguna: []
    };
  }

  _onReceiveAllOnline(online) {
    // let { pengguna } = this.state;
    // pengguna.forEach((pg, i) => {
    //   pengguna[i].online = false;
    //   online.forEach((on, j) => {
    //     if (pg.id_pengguna === on.id_pengguna) {
    //       pengguna[i].online = true;
    //       pengguna[i].socketid = on.socketid;
    //     }
    //   });
    // });
    // pengguna.sort((a, b) => {
    //   if (a.online < b.online) return 1;
    //   if (a.online > b.online) return -1;
    //   return 0;
    // });
    // this.setState({ pengguna }, () => {
    //   this.props.onReceiveAllOnline(online);
    // });
  }

  componentWillMount() {
    // this.props.socket.off("on_receive_all_online");
    // this.props.socket.on("on_receive_all_online", this._onReceiveAllOnline.bind(this));

    // this.props.models.authenticated.pengguna_index(9999999, 0).then((pengguna) => {
    //   let rmIndex = null;
    //   pengguna.data.data.forEach((item, i) => {
    //     if (item.id_pengguna === this.props.userdata.id_pengguna) {
    //       rmIndex = i;
    //     }
    //   });
    //   pengguna.data.data.splice(rmIndex, 1);
    //   this.setState({ pengguna: pengguna.data.data }, () => {
    //     this.props.socket.emit("get_all_online");
    //   });
    // }).catch((err) => swal("Error", err.toString(), "error"));
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1');
              }}>
              <i className="icon-speech"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2');
              }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1" className="p-3">
            {(this.state.pengguna.map((item, i) => (
              <div key={i}>
                <div className="message item" onClick={(e) => this.props.addChat(item)}>
                  <div className="py-3 pb-5 mr-3 float-left">
                    <div className="avatar">
                      {/* <img src={"/favicon.png"} className="img-avatar" alt="username here" /> */}
                      <div className="fake-pic">
                        <i className="icon icon-user"></i>
                      </div>
                      <span className={"avatar-status " + ((item.online ? "badge-success" : "badge-default"))}></span>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">{item.online ? "Online" : "Offline"}</small>
                    {/* <small className="text-muted float-right mt-1">1:52 PM</small> */}
                  </div>
                  <div className="text-truncate font-weight-bold">{item.nama_pengguna}</div>
                  <small>{item.level}</small>
                </div>
                <hr />
              </div>
            )))}
          </TabPane>
          <TabPane tabId="2" className="p-3">
            {/* <h6>Settings</h6>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Option 1</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'} />
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 2</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} size={'sm'} />
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 3</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'} disabled />
                <div>
                  <small className="text-muted">Option disabled.</small>
                </div>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 4</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'} />
              </div>
            </div>

            <hr />
            <h6>System Utilization</h6>

            <div className="text-uppercase mb-1 mt-4">
              <small><b>CPU Usage</b></small>
            </div>
            <Progress className="progress-xs" color="info" value="25" />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>Memory Usage</b></small>
            </div>
            <Progress className="progress-xs" color="warning" value="70" />
            <small className="text-muted">11444GB/16384MB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="danger" value="95" />
            <small className="text-muted">243GB/256GB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 2 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="success" value="10" />
            <small className="text-muted">25GB/256GB</small> */}
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

FullAside.propTypes = propTypes;
FullAside.defaultProps = defaultProps;

export default FullAside;
