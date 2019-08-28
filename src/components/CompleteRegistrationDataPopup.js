import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import swal from 'sweetalert';

export default class CompleteRegistrationDataPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = { registration: props.registration };
    console.log(props);
  }

  render() {
    return (
      <Modal isOpen={true} className="modal-warning modal-lg">
        <ModalHeader toggle={this.props.toggle}>Lengkapi Data Pendaftaran</ModalHeader>
        <div>
          <ModalBody className="lay">
            {this.state.registration.purpose.form.map((f, i) => (
              <div key={i}>
                <b>{f.name}</b><br />
                {f.type !== 'file' && <Input type={f.type} placeholder={f.name} value={this.state.registration.data[f.name]} onChange={(e) => {
                  const val = e.target.value;
                  const { registration } = this.state;
                  registration.data[f.name] = val;
                  this.setState({ registration });
                }} />}<br />
              </div>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={() => {
              this.state.registration.update({
                ...this.state.registration.toJSON()
              }).then(() => {
                swal('Konfirmasi', 'Pendaftaran berhasil dilengkapi', 'success').then(() => this.props.onSuccess());
              }).catch(this.props._apiReject);
            }}>SIMPAN</Button><Button color="danger" onClick={this.props.onCancel}>TUTUP</Button>
          </ModalFooter>
        </div>
      </Modal>
    )
  }

}
