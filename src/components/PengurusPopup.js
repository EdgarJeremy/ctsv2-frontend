import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";

export default class PengurusPopup extends React.Component {

    state = {
        form_data: {
            id_pengguna: "",
            nama_pengguna: "",
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
        if(!this.props.edit) {
            this.props.models.authenticated.pengguna_create(formData).then((data) => {
                if(data.status) {
                    swal("Data Tersimpan", "Pengurus baru berhasil disimpan", "success");
                    this.props.onSuccess();
                } else {
                    swal("Terjadi Kesalahan", data.message, "error");
                }
            }).catch(this.props._apiReject);
        } else {
            this.props.models.authenticated.pengguna_edit(formData).then((data) => {
                if(data.status) {
                    swal("Data Terupdate", "Data pengurus berhasil diupdate", "success");
                    this.props.onSuccess();
                } else {
                    swal("Terjadi Kesalahan", data.message, "error");
                }
            })
        }
    }

    componentWillReceiveProps(p) {
        if(p.edit && p.open) {
            this.props.models.authenticated.pengguna_show(p.id_pengguna).then((data) => {
                let {form_data} = this.state;
                form_data = data.data;
                form_data.password = "";
                this.setState({form_data});
            }).catch(this.props._apiReject);
        }
    }

    _onChange(e,v) {
        let {name, value} = e.target;
        let {form_data} = this.state;
        form_data[name] = value;
        this.setState({form_data});
    }

    render() {
        return(
            <div className="animated fadeIn">
                <Modal isOpen={this.props.open} className="modal-success">
                    <ModalHeader toggle={this.props.toggle}>{(this.props.edit) ? "Edit Pengurus" : "Tambah Pengurus Baru"}</ModalHeader>
                    <form onSubmit={this._onSubmit.bind(this)}>
                        <input onChange={this._onChange.bind(this)} value={this.state.form_data.id_pengguna} type="hidden" name="id_pengguna" />
                        <ModalBody>
                            <FormGroup>
                                <label>Nama Pengurus</label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fa fa-user"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.nama_pengguna} type="text" name="nama_pengguna" placeholder="Nama Pengguna..." required />
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