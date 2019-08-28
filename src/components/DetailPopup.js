import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import moment from "moment";
import { List, Item } from 'react-step-component'

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
        attributes: ['id', 'description', 'user_id', 'step_id', 'created_at', 'updated_at'],
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
      if (t.step_id === step_id) users.push({
        user: t.user,
        time: {
          created_at: t.created_at,
          updated_at: t.updated_at
        },
        description: t.description
      });
    });
    return users;
  }

  _findRootTime(step_id) {
    let time = {};
    for (let i = 0; i < this.state.tracks.length; i++) {
      const t = this.state.tracks[i];
      if (t.step_id === step_id) {
        time = {
          created_at: t.created_at,
          updated_at: t.updated_at
        }
        break;
      }
    }
    return time;
  }

  _composeTime(time) {
    if (!time) return {};
    if (moment(time).isSame(new Date(), 'day')) {
      return {
        absolute: moment(time).format('HH:mm:ss'),
        relative: moment(time).startOf('minute').fromNow().toUpperCase()
      }
    } else {
      return {
        absolute: moment(time).format('DD MMM YY').toUpperCase(),
        relative: moment(time).startOf('minute').fromNow().toUpperCase(),
      }
    }
  }

  _getTotalTime(s, nU, nS) {
    if (nU) {
      const d = moment.duration(moment(moment(nU.time.created_at)).diff(s));
      return d;
    } else if (nS) {
      const tS = this._findRootTime(nS.id);
      if(tS.created_at) {
        const d = moment.duration(moment(moment(tS.created_at)).diff(s));
        return d;
      } else return;
    } else {
      return moment.duration(moment(moment(this.props.registration.updated_at)).diff(s));
    }
  }

  render() {
    return (
      <Modal isOpen={true} className="modal-primary modal-lg modal-wide">
        <ModalHeader toggle={this.props.toggle}>Detail Jejak Pendaftaran</ModalHeader>
        {this.state.ready ? (
          <div>
            <ModalBody className="lay">
              <div className="row">
                <div className="col-md-5">
                  <List>
                    {
                      this.state.steps.map((s, i) => (
                        <div key={i}>
                          <Item.Wrapper state={
                            this.props.registration.step ?
                              (
                                s.step < this.props.registration.step.step ?
                                  "done" : (
                                    this.props.registration.step.step === s.step ?
                                      "waiting" : null
                                  )
                              ) : "done"
                          } end={i === this.state.steps.length - 1 && this._findHandledBy(s.id).length === 0}>
                            <Item.Left>
                              <b className="track-step">{s.name.toUpperCase()}</b>
                              <span className="track-sm">{s.description.toUpperCase()}</span>
                            </Item.Left>
                            <Item.Center content={(
                              this.props.registration.step ? (s.step < this.props.registration.step.step ?
                                <i className="fa fa-check"></i> : <b>{s.step}</b>
                              ) : <i className="fa fa-check"></i>
                            )} />
                            <Item.Right>
                              <b>{this._composeTime(this._findRootTime(s.id).created_at).absolute}</b>
                              <span className="track-sm">{this._composeTime(this._findRootTime(s.id).created_at).relative}</span>
                            </Item.Right>
                          </Item.Wrapper>
                          {
                            this._findHandledBy(s.id).map((u, j) => (
                              <Item.Wrapper key={j} active={this.props.registration.step ? (this.props.registration.step.step === s.step && j === this._findHandledBy(s.id).length - 1): false} state={
                                this.props.registration.step ?
                                  (
                                    s.step < this.props.registration.step.step ?
                                      "done" : (
                                        this.props.registration.step.step === s.step ?
                                          "waiting" : null
                                      )
                                  ) : "done"
                              } end={i === this.state.steps.length - 1}>
                                <Item.Left>
                                  <b className="track-user">{u.user.name.toUpperCase()}</b>
                                  <span className="track-sm">({u.user.level.toUpperCase()} - {u.user.pending_user ? 'PENDING' : 'REGULAR'})</span>
                                  <span className="track-sm">P.S: {u.description ? u.description : '-'}</span>
                                </Item.Left>
                                <Item.Center size="sm" />
                                <Item.Right>
                                  <b className="track-time">{this._composeTime(u.time.created_at).absolute}</b>
                                  <span className="track-sm">{this._composeTime(u.time.created_at).relative}</span>
                                  <span className="track-sm">{(function () {
                                    const d = this._getTotalTime(u.time.created_at, this._findHandledBy(s.id)[j + 1], this.state.steps[i + 1]);
                                    if (d) {
                                      if (d.days()) {
                                        return (
                                          <div>
                                            <i className="fa fa-check"></i> {d.days()} hari {d.hours()} jam {d.minutes()} menit
                                          </div>
                                        )
                                      } else if (d.hours()) {
                                        return (
                                          <div>
                                            <i className="fa fa-check"></i> {d.hours()} jam {d.minutes()} menit
                                          </div>
                                        )
                                      } else if (d.minutes()) {
                                        return (
                                          <div>
                                            <i className="fa fa-check"></i> {d.minutes()} menit
                                          </div>
                                        )
                                      } else {
                                        return (
                                          <div>
                                            <i className="fa fa-check"></i> selama beberapa detik
                                          </div>
                                        )
                                      }
                                    } else return '- menunggu -'
                                  }).call(this)}</span>
                                </Item.Right>
                              </Item.Wrapper>
                            ))
                          }
                        </div>
                      ))
                    }
                  </List>
                </div>
                <div className="col-md-7">
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
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.props.onCancel} block>TUTUP</Button>
            </ModalFooter>
          </div>
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
