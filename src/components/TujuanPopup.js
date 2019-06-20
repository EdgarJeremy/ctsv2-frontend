import React from "react";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";

export default class TujuanPopup extends React.Component {

    initial = {
        form_data: {
            name: "",
            description: "",
            form: [{
                name: '',
                type: 'text'
            }]
        }
    }

    state = {
        form_data: Object.assign({}, this.initial.form_data)
    }

    _onSubmit(e) {
        e.preventDefault();
        const formData = this.state.form_data;
        if (!this.props.purpose) {
            this.props.models.Purpose.create(formData).then((purpose) => {
                this.setState({ form_data: Object.assign({}, this.initial.form_data) });
                swal('Data Tersimpan', `Tujuan ${purpose.name} berhasil disimpan`, 'success').then(this.props.onSuccess);
            }).catch(this.props._apiReject);
        } else {
            this.props.purpose.update(formData).then((purpose) => {
                this.setState({ form_data: Object.assign({}, this.initial.form_data) });
                swal('Data Terupdate', `Tujuan ${purpose.name} berhasil diupdate`, 'success').then(this.props.onSuccess);
            }).catch(this.props._apiReject);
        }
    }

    componentWillReceiveProps(p) {
        if (p.edit && p.open) {
            let { form_data } = this.state;
            form_data = p.purpose.toJSON();
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
                    <ModalHeader toggle={this.props.toggle}>{(this.props.edit) ? "Edit Tujuan" : "Tambah Tujuan Baru"}</ModalHeader>
                    <form onSubmit={this._onSubmit.bind(this)}>
                        <input onChange={this._onChange.bind(this)} value={this.state.form_data.id_tujuan} type="hidden" name="id_tujuan" />
                        <ModalBody>
                            <FormGroup>
                                <label>Nama Tujuan</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-user"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.name} type="text" name="name" placeholder="Nama Tujuan..." required />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label>Deskripsi</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-quote-right"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.description ? this.state.form_data.description : ''} type="textarea" name="description" placeholder="Tentang tujuan.." />
                                </InputGroup>
                            </FormGroup>
                            <hr />
                            <FormGroup>
                                <label>Form</label>
                                <InputGroup>
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nama Input</th>
                                                <th>Tipe Input</th>
                                                <th>Hapus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.form_data.form.map((f, i) => (
                                                    <tr key={i}>
                                                        <th scope="row">{i + 1}</th>
                                                        <td>
                                                            <Input type="text" name="form.name" placeholder="Nama Input" value={this.state.form_data.form[i].name} onChange={(e) => {
                                                                const { form_data } = this.state;
                                                                form_data.form[i].name = e.target.value;
                                                                this.setState({ form_data });
                                                            }} />
                                                        </td>
                                                        <td>
                                                            <Input type="select" name="select" value={this.state.form_data.form[i].type} onChange={(e) => {
                                                                const { form_data } = this.state;
                                                                form_data.form[i].type = e.target.value;
                                                                this.setState({ form_data });
                                                            }} required>
                                                                <option value="text">Text</option>
                                                                <option value="textarea">TextArea</option>
                                                                <option value="number">Number</option>
                                                                <option value="date">Date</option>
                                                                <option value="checkbox">CheckBox</option>
                                                                <option value="file">File</option>
                                                            </Input>
                                                        </td>
                                                        <td>
                                                            <Button disabled={this.state.form_data.form.length === 1} color="danger" type="button" onClick={() => {
                                                                const { form_data } = this.state;
                                                                form_data.form.splice(i, 1);
                                                                this.setState({ form_data });
                                                            }}><i className="fa fa-times fa-lg"></i></Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                    <Button color="primary" type="button" onClick={(e) => {
                                        const { form_data } = this.state;
                                        form_data.form.push({
                                            name: '',
                                            type: 'text'
                                        });
                                        this.setState({ form_data });
                                    }}>Tambah Input</Button>
                                </InputGroup>
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