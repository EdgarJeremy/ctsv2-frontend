import React from "react";
import {Modal, ModalHeader, ModalBody, FormGroup, Input, ModalFooter, Button} from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";

export default class NextPopup extends React.Component {

    state = {
        done: false,
        ready: false,
        next: { resp_users: [] }
    }

    _initialize(p = this.props) {
        this.props.models.authenticated.pendaftaran_get_next_step(p.id_pendaftaran).then((next) => {
            if(next.status) {
                this.setState({ next: next.data, ready: true });
            } else {
                swal({
                    title: "Konfirmasi Selesai",
                    text: "Semua langkah pengerjaan sudah dilewati. Konfirmasi pendaftaran ini bahwa sudah selesai di step terakhir ini?",
                    icon: "info",
                    buttons: [
                        "Tidak, tunda penyelesaian",
                        "Ya, selesaikan"
                    ]
                }).then((isConfirm) => {
                    if(isConfirm) {
                        this.props.models.authenticated.pendaftaran_done(p.id_pendaftaran).then((data) => {
                            if(data.status) {
                                swal({
                                    title: "Pendaftaran Selesai",
                                    text: "Pendaftaran sudah diselesaikan",
                                    icon: "success"
                                }).then(() => {
                                    this.props.updateParent();
                                    this.props.onSuccess();
                                });
                            }
                        }).catch(this.props._apiReject);
                    } else {
                        this.props.onCancel();
                    }
                    this.setState({ready: false});
                });
            }
        }).catch(this.props._apiReject);
    }

    _onSubmit(e) {
        e.preventDefault();
        const data = helper.inspect(new FormData(e.target));
        this.props.models.authenticated.pendaftaran_set_to_next_step(data).then((data) => {
            this.setState({ready: false, done: true}, () => {
                const s = this.props.onSuccess();
                if(s) {
                    s.then(() => this.setState({ done: false }));
                } else {
                    this.setState({ done: false });
                }
                this.props.updateParent();
            });
        }).catch(this.props._apiReject);
    }

    componentWillReceiveProps(p) {
        if(p.id_pendaftaran && p.open)
            this._initialize(p);
    }

    render() {
        return(
            (this.state.ready) ?
            <Modal isOpen={this.props.open && !this.state.done} className="modal-success">
                <ModalHeader>Proses selanjutnya - {this.state.next.nama_step}</ModalHeader>
                <form onSubmit={this._onSubmit.bind(this)}>
                    <ModalBody>
                        Pilih pengurus untuk step berikutnya <hr />
                        <FormGroup>
                            <Input type="select" name="id_pengguna">
                                {this.state.next.resp_users.map((item,i) => {
                                    return(
                                        <option key={i} value={item.id_pengguna}>{item.nama_pengguna}</option>
                                    )
                                })}
                            </Input>
                            {(this.props.id_pendaftaran) ? <Input type="hidden" name="id_pendaftaran" value={this.props.id_pendaftaran} /> : ""}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" disabled={!this.state.ready}>Lanjutkan</Button>{' '}
                        <Button color="secondary" onClick={() => { this.props.onCancel(); this.setState({ready: false})}}>Tunda</Button>
                    </ModalFooter>
                </form>
            </Modal> : ""
        )
    }

}