import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from "moment";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class FullFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span><a href="#cts">Control Tracking System</a> &copy; {moment().format("Y")} Dinas Kependudukan dan Pencatatan Sipil</span>
        <span className="ml-auto">Developed by <a href="http://tagconn.net">TagConn Development Team</a></span>
      </React.Fragment>
    );
  }
}

FullFooter.propTypes = propTypes;
FullFooter.defaultProps = defaultProps;

export default FullFooter;
