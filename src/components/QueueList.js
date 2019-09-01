import React, { Component } from 'react';
import { Card, Table } from 'reactstrap';
import moment from 'moment';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';
import io from 'socket.io-client';
import 'moment/locale/id'

export default class QueueLists extends Component {
  state = {
    queues: {
      count: 1,
      rows: []
    },
    loading: false,
  }

  componentDidMount = () => {
    const biviAdapter = new SiriusAdapter('http://antriancapil.manadokota.go.id', 80, localStorage);
    const socket = io(`http://antriancapil.manadokota.go.id:80`);
    biviAdapter.connect().then((factories) => {
      moment.locale('id');
      this.getQueues(true, factories);
      socket.on('UPDATE_LIST', () => this.getQueues(false, factories));
      socket.on('NEW_QUEUE', () => this.getQueues(false, factories));
      socket.on('QUEUE_CALLED', () => this.getQueues(false, factories));
      socket.on('QUEUE_ARRIVED', () => this.getQueues(false, factories));
    }).catch(this.props._apiReject);
  };

  getQueues = (loading = false, models) => {
    const { Queue } = models;
    if (loading) this.setState({ loading: true });
    Queue.collection({
      limit: 25, offset: 0, where: { date: moment(new Date()).format('YYYY-MM-DD') }, orderBy: [['time', 'DESC']], include: [{
        model: 'Purpose',
        attributes: ['id', 'name']
      }]
    }).then(queues => this.setState({ queues, loading: false }));
  }

  render() {
    return (
      <div>
        <div className="">
          <Card style={{ height: '100%' }} className="border-0 shadow overflow-scroll">
            <div className="p-3">
              <h3 className="m-0 text-center">Pengantri</h3>
              <h5 className="m-0 text-center">Hari {moment().format('dddd, DD MMMM YYYY')}</h5>
              <p className="m-0 text-center">Jumlah pengantri : {this.state.queues.count}</p>
            </div>
            <Table bordered striped>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NIK</th>
                  <th>Nomor Pengantri</th>
                  <th>Jam</th>
                  <th>Tujuan</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.loading && this.state.queues.rows.map((row, i) => (<Tr key={i} index={i + 1} {...row} />))}
                {!this.state.loading && this.state.queues.rows.length === 0 &&
                  <tr>
                    <td colSpan={document.getElementsByTagName('th').length}>
                      <h4 className="m-0 text-center">Tidak ada antrian</h4>
                    </td>
                  </tr>
                }
              </tbody>
            </Table>
          </Card>
        </div>
      </div>
    )
  }
}

const Tr = props => (
  <tr>
    <td>{props.index}</td>
    <td>{props.name.toUpperCase()}</td>
    <td>{props.nik}</td>
    <td>{props.queue_number}</td>
    <td>{props.time}</td>
    <td>{props.purpose.name}</td>
  </tr>
)
