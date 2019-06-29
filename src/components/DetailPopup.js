import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Card, CardHeader, CardBody } from "reactstrap";
import moment from "moment";
import Steps, { Step } from 'rc-steps';

import Loadable from "react-loading-overlay";
import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import "moment/locale/id.js";

export default class DetailPopup extends React.Component {

  state = {
    ready: false,
    steps: [],
    tracks: [],
  }

  constructor(props) {
    super(props);
    moment.locale("id");
  }

  componentDidMount() {
    this._init();
  }

  _init() {
    const { registration } = this.props;
    this.props.models.Step.collection({
      attributes: ['id', 'name', 'step', 'description'],
      where: {
        purpose_id: registration.purpose_id
      },
      order: [['step', 'asc']]
    }).then((data) => {
      this.setState({ steps: data.rows });
    }).then(
      this.props.models.Track.collection.bind(this.props.models.Track, {
        attributes: ['id', 'description', 'user_id', 'step_id'],
        where: {
          registration_id: registration.id
        },
        include: [{
          model: 'User',
          attributes: ['id', 'name', 'level', 'pending_user']
        }]
      })
    ).then((data) => {
      this.setState({ tracks: data.rows, ready: true });
    })
      .catch(this.props._apiReject);
  }

  _findHandledBy(step_id) {
    const users = [];
    this.state.tracks.forEach((t, i) => {
      if (t.step_id === step_id) users.push(t.user);
    });
    return users;
  }

  render() {
    return (
      <Modal isOpen={true} className="modal-primary modal-lg modal-wide">
        <ModalHeader toggle={this.props.toggle}>Detail Jejak Pendaftaran</ModalHeader>
        {this.state.ready ? (

          <ModalBody className="lay">
            <Card>
              <CardHeader>
                Informasi Pendaftaran
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <td><b>NAMA PEMOHON</b></td>
                      <td>{this.props.registration.name}</td>
                    </tr>
                    <tr>
                      <td><b>NIK PEMOHON</b></td>
                      <td>{this.props.registration.nik}</td>
                    </tr>
                    {this.props.registration.purpose.form.map((f, i) => (
                      <tr key={i}>
                        <td><b>{f.name}</b></td>
                        <td>{this.props.registration.data[f.name]}</td>
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                  </tbody>
                </Table>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                Jejak Berkas
  </CardHeader>
              <CardBody>
                <Steps icons={{ finish: <i className="fa fa-check"></i> }} current={this.props.registration.step.step - 1}>
                  {this.state.steps.map((s, i) => (
                    <Step key={i} title={s.name} description={
                      <div className="step-desc">
                        <b>Deskripsi : </b>
                        <p>{s.description ? s.description : '--'}</p>
                        <b>Pengurus : </b>
                        <ol>
                          {this._findHandledBy(s.id).map((u, i) => (
                            <li key={i}>{u.name} ({u.pending_user ? 'PENDING' : 'REGULAR'})</li>
                          ))}
                        </ol>
                      </div>
                    } />
                  ))}
                </Steps>
              </CardBody>
            </Card>
            <ModalFooter>
              <Button color="danger" onClick={this.props.onCancel} block>TUTUP</Button>
            </ModalFooter>
          </ModalBody>
        ) : (
            <Loadable
              spinnerSize="100px"
              style={{ height: 200 }}
              background="#ffffff"
              active={true}
              spinner
              color="#000000"
              text="Menyiapkan.." />
          )}

      </Modal>
    )
  }

}
