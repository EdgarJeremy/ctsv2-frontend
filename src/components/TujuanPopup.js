import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";

export default class TujuanPopup extends React.Component {

    state = {
        form_data: {
            id_tujuan: "",
            nama_tujuan: "",
            deskripsi: ""
        }
    }

    _onSubmit(e) {
        e.preventDefault();
        const formData = helper.inspect(new FormData(e.target));
        if(!this.props.edit) {
            this.props.models.authenticated.tujuan_create(formData).then((data) => {
                if(data.status) {
                    swal("Data Tersimpan", "Tujuan baru berhasil disimpan", "success");
                    this.props.onSuccess();
                } else {
                    swal("Terjadi Kesalahan", data.message, "error");
                }
            }).catch(this.props._apiReject);
        } else {
            this.props.models.authenticated.tujuan_edit(formData).then((data) => {
                if(data.status) {
                    swal("Data Terupdate", "Data tujuan berhasil diupdate", "success");
                    this.props.onSuccess();
                } else {
                    swal("Terjadi Kesalahan", data.message, "error");
                }
            })
        }
    }

    componentWillReceiveProps(p) {
        if(p.edit && p.open) {
            this.props.models.authenticated.tujuan_show(p.id_tujuan).then((data) => {
                let {form_data} = this.state;
                form_data = data.data;
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
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.nama_tujuan} type="text" name="nama_tujuan" placeholder="Nama Tujuan..." required />
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
                                    <Input onChange={this._onChange.bind(this)} value={this.state.form_data.deskripsi ? this.state.form_data.deskripsi : ""} type="textarea" name="deskripsi" placeholder="Tentang tujuan.." />
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