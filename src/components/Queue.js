import React, { Component } from 'react';
import { Table, Button, Card, CardBody, ButtonGroup, UncontrolledTooltip } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { IoIosDocument, IoIosClipboard, IoIosRedo, IoMdClose, IoMdCheckmark } from 'react-icons/io'
import moment from 'moment';
import _ from 'lodash';
import 'moment/locale/id';
import PreviewDocuments from './PreviewDocuments';

export default class Queue extends Component {
  state = {
    queues: {
      count: 1,
      rows: []
    },
    user: {
      name: '',
      id: '',
      type: ''
    },
    loading: false,
    id: 0
  }

  getQueues = (refresh = true) => {
    const { biviModels: { Queue } } = this.props;
    if (refresh) this.setState({ loading: true })
    Queue.collection({
      limit: 15, offset: 0, include:
        [{ model: 'Purpose', attributes: ['name', 'id'] }],
      // { model: 'Document', attributes: ['name', 'id', 'data'] }],
      order: [['time', 'asc'], ['id', 'asc']],
      where: { date: new Date(), status: 'Belum Datang' }
    }).then(queue => {
      const queues = _.groupBy(queue.rows, 'time');
      this.setState({ queues: { count: queue.count, rows: queues }, loading: false })
    });
  }

  componentDidMount = () => {
    this.getQueues(true)
    moment.locale('id');
    const { biviSocket } = this.props;
    biviSocket.on('UPDATE_LIST', () => this.getQueues(false));
    biviSocket.on('NEW_QUEUE', () => this.getQueues(false));
    biviSocket.on('QUEUE_CALLED', () => this.getQueues(false));
    biviSocket.on('QUEUE_ARRIVED', () => this.getQueues(false));
  }

  updateQueue = (q, id) => {
    this.props.onSelect(id ? q : null);
    q.update({ called: id }).then(() => this.getQueues(false));
  }

  updateStatus = (q, status) => {
    q.update({ status }).then(() => this.getQueues());
  }

  preview = id => this.setState({ id }, () => this.previewDocs.open());

  render() {
    if (this.state.type === 'administrator') return (<Redirect to="/dashboard/main" />)
    return (
      <div>
        {this.props._biviuserdata.id ? (
          <div className="card-body">
            <h5 className="m-0">Antrian (Logged in as : {this.props._biviuserdata.name})</h5>
            <hr />
            {Object.keys(this.state.queues.rows).length === 0 && !this.state.loading && <Card className="text-white bg-dark border-0 shadow-sm">
              <CardBody><h5 className="text-center m-0">Tidak ada antrian hari ini</h5></CardBody>
            </Card>}
            {!this.state.loading && Object.keys(this.state.queues.rows).sort().map((time, i) => (
              <Card className="my-2 bg-dark text-white border-0 shadow" key={i}>
                <CardBody><h5 className="m-0">{time}</h5></CardBody>
                <Table size="sm" responsive={true} dark className="text-white" hover striped>
                  <thead>
                    <tr>
                      <th className="pl-3">No. antrian</th>
                      <th>Nama</th>
                      <th>Tujuan</th>
                      <th>Tanggal - Jam</th>
                      <th>NIK</th>
                      <th>No. Telp</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <React.Fragment key={i}>
                      {this.state.queues.rows[time].map((que, index) => (<Tr
                        selected={this.props.selected}
                        updateStatus={this.updateStatus}
                        data={que} user={this.props._biviuserdata}
                        onClick={this.updateQueue}
                        q={time}
                        rows={this.state.queues.rows}
                        previewDocuments={this.preview}
                        index={index}
                        key={index} />
                      ))}
                    </React.Fragment>
                  </tbody>
                </Table>
              </Card>
            ))}
          </div>
        ) : (
          <div className="card-body">
            <h5 className="m-0">Sesi user antrian tidak ditemukan. Silakan logout dan login kembali.</h5>
          </div>
        )}

        <PreviewDocuments ref={ref => this.previewDocs = ref} models={this.props.biviModels} id={this.state.id} />
      </div>
    )
  }
}

const Tr = props => (
  <tr>
    <React.Fragment>
      <td className="pl-3">{props.data.queue_number}</td>
      <td>{props.data.name.toUpperCase()}</td>
      <td>{props.data.purpose.name}</td>
      <td>{moment(props.data.date).format('DD MMMM YYYY')} - {props.data.time}</td>
      <td>{props.data.nik}</td>
      <td>{props.data.phone}</td>
      <td>
        <ButtonGroup size="sm">
          <Button onClick={() => props.previewDocuments(props.data.id)} id={`document${props.data.id}`} size="sm" color="light"><IoIosDocument /></Button>
          <UncontrolledTooltip placement="left-start" target={`document${props.data.id}`}>Dokumen {props.data.name}</UncontrolledTooltip>
          {props.data.called === 0 &&
            <React.Fragment>
              <Button disabled={props.selected !== null} id={`call${props.data.id}`} onClick={() => props.onClick(props.data, props.user.id)} color="primary" size="sm"><IoIosClipboard /></Button>
              <UncontrolledTooltip placement="right" target={`call${props.data.id}`}>Panggil {props.data.name}</UncontrolledTooltip>
            </React.Fragment>
          }
          {(props.data.called !== 0 && props.data.called !== props.user.id) &&
            <React.Fragment>
              <Button disabled id={`called${props.data.id}`} size="sm" color="primary"><IoIosClipboard /></Button>
              <UncontrolledTooltip placement="right-end" target={`called${props.data.id}`}>Sudah dipanggil</UncontrolledTooltip>
            </React.Fragment>
          }
        </ButtonGroup>&nbsp;&nbsp;
        {props.data.called !== 0 && props.data.called === props.user.id &&
          <React.Fragment>
            <Button size="sm" id={`uncheck${props.data.id}`} className="rounded-pill" color="danger" onClick={() => props.updateStatus(props.data, 'Tidak Datang')}><IoMdClose /></Button>&nbsp;&nbsp;
            <UncontrolledTooltip placement="top" target={`uncheck${props.data.id}`}>Tidak Datang</UncontrolledTooltip>
            <Button size="sm" id={`check${props.data.id}`} className="rounded-pill" onClick={() => props.updateStatus(props.data, 'Datang')} color="warning" size="sm"><IoMdCheckmark /></Button>&nbsp;&nbsp;
            <UncontrolledTooltip placement="top" target={`check${props.data.id}`}>Datang</UncontrolledTooltip>
            <Button size="sm" id={`reset${props.data.id}`} className="rounded-pill" onClick={() => props.onClick(props.data, 0)} color="dark" size="sm"><IoIosRedo /></Button>
            <UncontrolledTooltip placement="top" target={`reset${props.data.id}`}>Reset</UncontrolledTooltip>
          </React.Fragment>
        }
      </td>
    </React.Fragment>
  </tr>
)
