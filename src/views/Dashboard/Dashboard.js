import React, { Component } from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      recap: []
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  _getAllRecap() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return axios.get(process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT + '/api/registrations/all_recap', {
      headers: {
        'x-access-token': accessToken,
        'x-refresh-token': refreshToken
      },
      params: {
        user_id: this.props._userdata.id
      }
    }).then((res) => {
      const at = res.headers['x-access-token'];
      const rt = res.headers['x-refresh-token'];
      if (at && rt) {
        localStorage.setItem('accessToken', at);
        localStorage.setItem('refreshToken', rt);
      }
      return res.data;
    });
  }

  componentDidMount() {
    this._getAllRecap().then((data) => {
      this.setState({ recap: data });
    }).catch(this.props._apiReject);
  }

  render() {

    return (
      <div className="animated fadeIn">
        <div>
          <h4>Rekap Pekerjaan</h4><br />
          <Table responsive striped>
            <thead>
              <tr>
                <th>Tujuan</th>
                <th>Sedang Dikerjakan</th>
                <th>Selesai Dikerjakan</th>
                <th>Total Pendaftaran Masuk</th>
              </tr>
            </thead>
            <tbody>
              {this.state.recap.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.onwork}</td>
                  <td>{r.incoming - r.onwork}</td>
                  <td>{r.incoming}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Dashboard;
