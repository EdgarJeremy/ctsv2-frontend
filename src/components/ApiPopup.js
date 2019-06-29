import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Table } from "reactstrap";
import swal from "sweetalert";

export default class ApiPopup extends React.Component {

  state = {
    form_data: {
      name: '',
      url: '',
      return_values: [''],
    }
  }

  _onSubmit(e) {
    e.preventDefault();
    const { form_data } = this.state;
    if (!this.props.api) {
      this.props.models.Api.create(form_data).then((api) => {
        swal('Data Tersimpan', `Sumber ${api.name} berhasil dibuat`, 'success')
          .then(() => this.setState({
            form_data: {
              name: '',
              url: '',
              return_values: [''],
            }
          }))
          .then(this.props.onSuccess)
      }).catch(this.props._apiReject);
    } else {
      this.props.api.update(form_data).then((api) => {
        swal('Data Terupdate', `Sumber ${api.name} berhasil diupdate`, 'success').then(this.props.onSuccess);
      }).catch(this.props._apiReject);
    }
  }

  componentWillReceiveProps(p) {
    if (p.edit && p.open) {
      let { form_data } = this.state;
      form_data = p.api.toJSON();
      this.setState({ form_data });
    }
  }

  _onChange(e, v) {
    let { name, value } = e.target;
    let { form_data } = this.state;
    form_data[name] = value;
    this.setState({ form_data });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open} className="modal-success">
          <ModalHeader toggle={this.props.toggle}>{(this.props.edit) ? "Edit Sumber" : "Tambah Sumber Baru"}</ModalHeader>
          <form onSubmit={this._onSubmit.bind(this)}>
            <ModalBody>
              <FormGroup>
                <label>Nama Sumber</label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-info-circle"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input onChange={this._onChange.bind(this)} value={this.state.form_data.name} type="text" name="name" placeholder="Nama Sumber..." required />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <label>URL</label>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fa fa-link"></i>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input onChange={this._onChange.bind(this)} value={this.state.form_data.url} type="text" name="url" placeholder="URL..." required />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <label>Field Kembalian</label>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Nama Field</th>
                      <th>Hapus</th>
                    </tr>
                    {
                      this.state.form_data.return_values.map((q, i) => (
                        <tr key={i}>
                          <td>
                            <Input type="text" value={this.state.form_data.return_values[i]} onChange={(e) => {
                              const { form_data } = this.state;
                              form_data.return_values[i] = e.target.value;
                              this.setState({
                                form_data
                              });
                            }} required/>
                          </td>
                          <td><Button onClick={() => {
                            const { form_data } = this.state;
                            form_data.return_values.splice(i, 1);
                            this.setState({
                              form_data
                            });
                          }} disabled={this.state.form_data.return_values.length === 1} color="danger" block><i className="fa fa-close"></i></Button></td>
                        </tr>
                      ))
                    }
                  </thead>
                </Table>
                <Button onClick={() => {
                  const { form_data } = this.state;
                  form_data.return_values.push('');
                  this.setState({ form_data });
                }} color="primary" type="button" block><i className="fa fa-plus"></i></Button>
                <hr />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="success">Simpan</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    )
  }

}
