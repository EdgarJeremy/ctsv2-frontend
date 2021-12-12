import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import PasswordPopup from '../../components/PasswordPopup';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class FullHeader extends Component {

  state = {
    passwordPopup: false
  }

  _onLogout() {
    this.props.authProvider.remove().then(() => {
      this.props.history.replace("/login");
    });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: process.env.PUBLIC_URL + 'assets/img/brand/logo.png', width: "90%", height: "80%", padding: 5, alt: 'CoreUI Logo' }}
          minimized={{ src: process.env.PUBLIC_URL + 'assets/img/brand/logo.png', width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i>
              <Badge pill color="danger">{this.props.pendingCount ? this.props.pendingCount : ""}</Badge>
            </NavLink>
          </NavItem> */}
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'/favicon.png'} className="img-avatar" alt="admin@bootstrapmaster.com" />
              <span className="d-md-down-none">{this.props.userdata.name} ({this.props.userdata.level})</span>
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Konfigurasi</strong></DropdownItem>
              <DropdownItem onClick={() => this.setState({ passwordPopup: true })}><i className="fa fa-wrench"></i> Ubah sandi</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={this._onLogout.bind(this)} ><i className="fa fa-sign-out"></i> Keluar</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile />
        <PasswordPopup
          {...this.props}
          open={this.state.passwordPopup}
          onCancel={() => this.setState({ passwordPopup: false })}
        />
      </React.Fragment>
    );
  }
}

FullHeader.propTypes = propTypes;
FullHeader.defaultProps = defaultProps;

export default FullHeader;
