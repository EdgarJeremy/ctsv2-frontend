import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";

export default class PengurusPopup extends React.Component {

    state = {
        form_data: {
            name: "",
            username: "",
            password: "",
            level: "",
            status: "",
            deskripsi: ""
        }
    }

    _onSubmit(e) {
        e.preventDefault();
        const formData = helper.inspect(new FormData(e.target));
        if (!this.props.user) {
            this.props.models.User.create(formData).then((user) => {
                swal('Data Tersimpan', `Pengguna ${user.name} berhasil dibuat`, 'success').then(this.props.onSuccess);
            }).catch((err) => {
                this.props._apiReject(err.errors.errors.map((e) => e.msg).join('\n'));
            });
        } else {
            this.props.user.update(formData).then((user) => {
                swal('Data Terupdate', `Pengguna ${user.name} berhasil diupdate`, 'success').then(this.props.onSuccess);
            }).catch((err) => {
                this.props._apiReject(err.errors.errors.map((e) => e.msg).join('\n'));
            });
        }
        // if(!this.props.edit) {
        //     this.props.models.authenticated.pengguna_create(formData).then((data) => {
        //         if(data.status) {
        //             swal("Data Tersimpan", "Pengurus baru berhasil disimpan", "success");
        //             this.props.onSuccess();
        //         } else {
        //             swal("Terjadi Kesalahan", data.message, "error");
        //         }
        //     }).catch(this.props._apiReject);
        // } else {
        //     this.props.models.authenticated.pengguna_edit(formData).then((data) => {
        //         if(data.status) {
        //             swal("Data Terupdate", "Data pengurus berhasil diupdate", "success");
        //             this.props.onSuccess();
        //         } else {
        //             swal("Terjadi Kesalahan", data.message, "error");
        //         }
        //     })
        // }
    }

    componentWillReceiveProps(p) {
        if (p.edit && p.open) {
            let { form_data } = this.state;
            form_data = p.user.toJSON();
            form_data.status = form_data.status ? 1 : 0;
            form_data.password = "";
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
                    <ModalHeader toggle={this.props.toggle}>{(this.props.edit) ? "Edit Pengurus" : "Tambah Pengurus Baru"}</ModalHeader>
                    <form onSubmit={this._onSubmit.bind(this)}>
                        <ModalBody>
                            <FormGroup>
                                <label>Nama Pengurus</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-user"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.name} type="text" name="name" placeholder="Nama Pengguna..." required />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label>Username</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-user"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.username} type="text" name="username" placeholder="Username.." required />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label>Password</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-lock"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.password} type="password" name="password" placeholder="Password.." required={!this.props.edit} />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label>Level Pengurus</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-star"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.level} type="select" name="level" required>
                                        <option value=""></option>
                                        <option value="Front Office">Front Office</option>
                                        <option value="Loket">Loket</option>
                                        <option value="Kepala Dinas">Kepala Dinas</option>
                                        <option value="Kepala Bidang">Kepala Bidang</option>
                                        <option value="Kepala Sub Bagian">Kepala Sub Bagian</option>
                                        <option value="Administrator">Administrator</option>
                                    </Input>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <label>Status</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-bell"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.status} type="select" name="status" required>
                                        <option value=""></option>
                                        <option value="1">Aktif</option>
                                        <option value="0">Nonaktif</option>
                                    </Input>
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
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.deskripsi ? this.state.form_data.deskripsi : ""} type="textarea" name="deskripsi" placeholder="Tentang pengurus.." />
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