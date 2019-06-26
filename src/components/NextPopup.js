import React from "react";
import Loadable from "react-loading-overlay";
import { Modal, ModalHeader, ModalBody, Collapse, ModalFooter, Button, Card, CardHeader, CardBody } from "reactstrap";

export default class NextPopup extends React.Component {

  state = {
    ready: false,
    done: false,
    next_card: false,
    pending_card: false,
    next_step_name: '',
    pending_step_name: '',
    next_users: [],
    pending_users: []
  }

  componentDidMount() {
    this._prepare();
  }

  _prepare() {
    const { registration: { purpose_id }, step_number } = this.props.track;
    this.props.models.Step.collection({
      attributes: ['id'],
      where: {
        purpose_id: purpose_id,
        step: parseInt(step_number, 10) + 1
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
    }).catch(this.props._apiReject);
  }

  _fetchStepData() {
    const { registration: { purpose_id }, step_number } = this.props.track;
    // fetch next step
    this.props.models.Step.collection({
      attributes: ['name'],
      where: {
        purpose_id: purpose_id,
        step: parseInt(step_number, 10) + 1
      },
      limit: 1,
      include: [{
        attributes: ['name', 'level', 'pending_user'],
        model: 'User',
        where: {
          pending_user: false
        }
      }]
    }).then((data) => {
      const step = data.rows[0];
      this.setState({
        next_step_name: step.name,
        next_users: step.users
      });
    })
    // fetch current (for pending) step
    .then(this.props.models.Step.collection.bind(this.props.models.Step, {
      attributes: ['name'],
      where: {
        purpose_id: purpose_id,
        step: parseInt(step_number, 10)
      },
      limit: 1,
      include: [{
        attributes: ['name', 'level', 'pending_user'],
        model: 'User',
        where: {
          pending_user: true
        }
      }]
    }))
    .then((data) => {
      if(data.count > 0) {
        const step = data.rows[0];
        this.setState({
          ready: true,
          pending_step_name: step.name,
          pending_users: step.users
        }, () => {
          console.log(this.state);
        });
      } else {
        this.setState({
          ready: true
        }, () => {
          console.log(this.state);
        });
      }
    }).catch(this.props._apiReject);
  }

  render() {
    return (
      <Modal isOpen={true} className="modal-success">
        <ModalHeader>Proses selanjutnya</ModalHeader>
        {this.state.ready ? (
          this.state.done ? (
            <div>
              <h4>Proses sudah sampai pada step terakhir. Selesaikan?</h4>
              <Button block>SELESAIKAN</Button>
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
                    </CardBody>
                  </Collapse>
                </Card>
                <hr style={{ marginTop: 10, marginBottom: 10 }} />
                <p style={{ textAlign: 'center', margin: 0 }}><b>ATAU</b></p>
                <hr style={{ marginTop: 10, marginBottom: 10 }} />
                <Card>
                  <CardHeader style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => {
                    this.setState({ next_card: false, pending_card: !this.state.pending_card });
                  }}>
                    <h5 style={{ margin: 0 }}>Tunda ke pengurus step saat ini</h5>
                  </CardHeader>
                  <Collapse isOpen={this.state.pending_card}>
                    <CardBody>
                    </CardBody>
                  </Collapse>
                </Card>
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
          )}
        <ModalFooter>
          <Button color="danger" onClick={this.props.onCancel} block>BATAL</Button>
        </ModalFooter>
      </Modal>
    )
  }

}
