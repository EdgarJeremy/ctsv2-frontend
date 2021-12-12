import React from "react";
import Loadable from "react-loading-overlay";
import { Modal, ModalHeader, ModalBody, Collapse, ModalFooter, Button, Card, CardHeader, CardBody, Input } from "reactstrap";
import swal from "sweetalert";

export default class NextPopup extends React.Component {

  state = {
    ready: false,
    done: false,
    next_card: false,
    pending_card: false,
    next_step: null,
    pending_step: null,
    next_users: [],
    selected_next_user: '',
    pending_users: [],
    selected_pending_user: '',
    done_card: false,
    reason: '',
    continue_description: '',
    pending_description: '',
    current_track: null
  }

  componentDidMount() {
    this._prepare();
  }

  _prepare() {
    const { registration: { id, purpose_id, step_id, step: { step } } } = this.props;
    this.props.models.Track.collection({
      attributes: ['id'],
      where: {
        registration_id: id,
        step_id: step_id
      }
    }).then((res) => {
      this.setState({ current_track: res.rows[0] });
      this.props.models.Step.collection({
        attributes: ['id'],
        where: {
          purpose_id: purpose_id,
          step: parseInt(step, 10) + 1
        },
        limit: 1
      }).then((nextSteps) => {
        if (nextSteps.count === 0) {
          this.setState({
            ready: true,
            done: true
          });
        } else {
          this._fetchStepData();
        }
      });
    }).catch(this.props._apiReject);
  }

  _fetchStepData() {
    const { registration: { purpose_id, step: { step } } } = this.props;
    // fetch next step
    this.props.models.Step.collection({
      attributes: ['name', 'step', 'description'],
      where: {
        purpose_id: purpose_id,
        step: parseInt(step, 10) + 1
      },
      limit: 1,
      include: [{
        attributes: ['id', 'name', 'level', 'pending_user'],
        model: 'User',
        where: {
          pending_user: false
        }
      }]
    }).then((data) => {
      const step = data.rows[0];
      this.setState({
        next_step: step,
        next_users: step.users,
        selected_next_user: step.users[0].id
      });
    })
      // fetch current (for pending) step
      .then(this.props.models.Step.collection.bind(this.props.models.Step, {
        attributes: ['name', 'step', 'description'],
        where: {
          purpose_id: purpose_id,
          step: parseInt(step, 10)
        },
        limit: 1,
        include: [{
          attributes: ['id', 'name', 'level', 'pending_user'],
          model: 'User',
          where: {
            pending_user: {
              $eq: true
            },
            id: {
              $ne: this.props._userdata.id
            }
          }
        }]
      }))
      .then((data) => {
        if (data.count > 0) {
          const step = data.rows[0];
          this.setState({
            ready: true,
            pending_step: step,
            pending_users: step.users,
            selected_pending_user: step.users[0].id
          });
        } else {
          this.setState({
            ready: true
          });
        }
      }).catch(this.props._apiReject);
  }

  _onContinue() {
    const { next_step, selected_next_user, continue_description } = this.state;
    const { registration } = this.props;
    this.state.current_track.update({
      description: continue_description
    }).then(() => {
      this.props.models.Track.create({
        description: '',
        step_id: next_step.id,
        registration_id: registration.id,
        user_id: selected_next_user
      }).then((newTrack) => {
        return registration.update({
          ...registration.toJSON(),
          step_id: next_step.id,
          user_id: selected_next_user
        }).then((r) => {
          swal('Berhasil diproses', 'Pendaftaran berhasil terproses', 'success').then(() => {
            this.props.onSuccess();
          });
        });
      })
    }).catch(this.props._apiReject);
  }

  _onPending() {
    const { selected_pending_user, pending_description } = this.state;
    const { registration } = this.props;
    this.state.current_track.update({
      description: pending_description
    }).then(() => {
      this.props.models.Track.create({
        description: '',
        step_id: registration.step.id,
        registration_id: registration.id,
        user_id: selected_pending_user
      }).then((newTrack) => {
        return registration.update({
          ...registration.toJSON(),
          step_id: registration.step.id,
          user_id: selected_pending_user
        }).then((r) => {
          swal('Berhasil', 'Pendaftaran berhasil ditunda', 'success').then(() => {
            this.props.onSuccess();
          });
        });
      });
    }).catch(this.props._apiReject);
  }

  _onDone(incomplete = false) {
    const { registration } = this.props;
    registration.update({
      ...registration.toJSON(),
      step_id: null,
      user_id: null,
      incomplete: incomplete,
      reason: this.state.reason
    }).then((r) => {
      swal('Berhasil', 'Pendaftaran berhasil diselesaikan', 'success').then(() => {
        this.props.onSuccess();
      });
    }).catch(this.props._apiReject);
  }

  render() {
    return (
      <Modal isOpen={true} className="modal-success">
        <ModalHeader>Proses selanjutnya</ModalHeader>
        {this.state.ready ? (
          this.state.done ? (
            <div style={{
              padding: 15,
              textAlign: 'center'
            }}>
              <h5>Proses sudah sampai pada step terakhir. Selesaikan?</h5><hr />
              <Button onClick={() => this._onDone(false)} color="success" block>SELESAIKAN</Button>
            </div>
          ) : (
              <ModalBody>
                <Card style={{ margin: 0 }}>
                  <CardHeader style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                    this.setState({ pending_card: false, next_card: !this.state.next_card });
                  }}>
                    <h5 style={{ margin: 0 }}>Lanjutkan ke pengurus step berikutnya</h5>
                  </CardHeader>
                  <Collapse isOpen={this.state.next_card}>
                    <CardBody>
                      <p>Pilih pengurus untuk step: {this.state.next_step.name}</p>
                      <Input type="select" onChange={(e) => {
                        this.setState({ selected_next_user: e.target.value });
                      }} value={this.state.selected_next_user}>
                        {this.state.next_users.map((u, i) => (
                          <option key={i} value={u.id}>{u.name} - {u.level}</option>
                        ))}
                      </Input><br />
                      <Input type="textarea" onChange={(e) => {
                        this.setState({ continue_description: e.target.value });
                      }} value={this.state.continue_description} placeholder="Catatan" /><br />
                      <Button disabled={!this.state.selected_next_user} color="success" onClick={this._onContinue.bind(this)} block><i className="fa fa-send"></i> KIRIM</Button>
                    </CardBody>
                  </Collapse>
                </Card>
                <hr style={{ marginTop: 10, marginBottom: 10 }} />
                <p style={{ textAlign: 'center', margin: 0 }}><b>ATAU</b></p>
                <hr style={{ marginTop: 10, marginBottom: 10 }} />
                {this.props._userdata.pending_user ? (
                  <Card>
                    <CardHeader style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                      this.setState({ next_card: false, done_card: !this.state.done_card });
                    }}>
                      <h5 style={{ margin: 0 }}>Selesaikan karena suatu alasan</h5>
                    </CardHeader>
                    <Collapse isOpen={this.state.done_card}>
                      <CardBody>
                        <Input type="textarea" placeholder="Alasan..." value={this.state.reason} onChange={(e) => this.setState({ reason: e.target.value })} />
                        <Button onClick={() => this._onDone(true)} color="success" block>SELESAIKAN</Button>
                      </CardBody>
                    </Collapse>
                  </Card>
                ) : (
                    <Card>
                      <CardHeader style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                        this.setState({ next_card: false, pending_card: !this.state.pending_card });
                      }}>
                        <h5 style={{ margin: 0 }}>Tunda ke pengurus step saat ini</h5>
                      </CardHeader>
                      <Collapse isOpen={this.state.pending_card}>
                        <CardBody>
                          {this.state.pending_users.length ? (
                            <div>
                              <p>Tunda ke pengurus step: {this.state.pending_step.name}</p>
                              <Input type="select" onChange={(e) => {
                                this.setState({ selected_pending_user: e.target.value });
                              }} value={this.state.selected_pending_user}>
                                {this.state.pending_users.map((u, i) => (
                                  <option key={i} value={u.id}>{u.name}</option>
                                ))}
                              </Input><br />
                              <Input type="textarea" onChange={(e) => {
                                this.setState({ pending_description: e.target.value });
                              }} value={this.state.pending_description} placeholder="Catatan" /><br />
                              <Button disabled={!this.state.selected_pending_user} color="success" onClick={this._onPending.bind(this)} block><i className="fa fa-arrow-down"></i> TUNDA</Button>
                            </div>
                          ) : (
                              <h6>Tidak ada pengurus dokumen pending yang ditugaskan di step ini</h6>
                            )}
                        </CardBody>
                      </Collapse>
                    </Card>
                  )}
              </ModalBody>
            )

        ) : (
            <Loadable
              spinnerSize="100px"
              style={{ height: 200 }}
              background="#ffffff"
              active={true}
              spinner
              color="#000000"
              text="Menyiapkan.." />
          )
        }
        <ModalFooter>
          <Button color="danger" onClick={this.props.onCancel} block>BATAL</Button>
        </ModalFooter>
      </Modal >
    )
  }

}
