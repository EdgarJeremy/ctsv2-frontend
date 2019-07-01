import React from 'react';
import { Table, Badge } from 'reactstrap';
import moment from 'moment';

moment.locale('id');

export default class TVView extends React.Component {

  state = {
    registrations: []
  }

  componentDidMount() {
    this._fetchRegistration();
  }

  _fetchRegistration() {
    this.props.models.Registration.collection({
      attributes: ['id', 'name', 'nik', 'data', 'created_at', 'purpose_id', 'step_id'],
      where: {
        created_at: {
          $gte: (new Date((new Date()).setHours(0,0,0,0)))
        }
      },
      include: [{
        model: 'Step',
        attributes: ['id', 'name', 'step', 'description'],
      }, {
        model: 'User',
        attributes: ['id', 'name', 'level']
      }, {
        model: 'Purpose',
        attributes: ['id', 'name', 'form']
      }],
      order: [['created_at', 'desc']]
    }).then((data) => {
      this.setState({
        registrations: data.rows,
      });
    });
  }

  render() {
    return (
      <div style={{
        padding: 20,
        textAlign: 'center'
       }}>
        <h3>Pendaftaran Kepengurusan Dokumen Per-Tanggal {moment().format('D MMMM YYYY')}</h3>
        <hr />
        <Table responsive striped>
          <thead>
            <tr>
              <th>#</th>
              <th>NAMA PEMOHON</th>
              <th>TUJUAN</th>
              <th>PENGURUS SAAT INI</th>
              <th>STEP SAAT INI</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.registrations.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t.name.toUpperCase()}</td>
                  <td>{t.purpose.name.toUpperCase()}</td>
                  <td>{t.user ? t.user.name.toUpperCase() : 'LOKET PENYERAHAN'}</td>
                  <td><Badge color="success">{t.step ? t.step.name.toUpperCase() : 'SELESAI'}</Badge></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    )
  }

}
