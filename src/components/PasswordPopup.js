import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

export default class PasswordPopup extends React.Component {
    state = {
        now: '',
        nw: '',
        error: '',
        success: ''
    };

    _apply() {
        const { now, nw } = this.state;
        this.props.models.authenticated.pengguna_password({
            currPassword: now,
            newPassword: nw
        }).then((res) => {
            if(res.status) {
                this.setState({ now: '', nw: '', error: '', success: 'Kata sandi berhasil diubah' });
            } else {
                this.setState({ success: '', error: res.message });
            }
        });
    }

    render() {
        const { now, nw, success, error } = this.state;
        return (
            <Modal isOpen={this.props.open} className="modal-default">
                <ModalHeader>Ubah Sandi</ModalHeader>
                <ModalBody>
                    <label><b>Kata Sandi Sekarang</b></label>
                    <input onChange={(e) => this.setState({ now: e.target.value })} value={now} type="password" className="form-control" />
                    <label><b>Kata Sandi Baru</b></label>
                    <input onChange={(e) => this.setState({ nw: e.target.value })} value={nw} type="password" className="form-control" />
                    <hr />
                    {success && <div className="alert alert-success" role="alert">{success}</div>}
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                </ModalBody>
                <ModalFooter>
                    <button onClick={this._apply.bind(this)} className="btn btn-outline-primary">Terapkan</button>
                    <button className="btn btn-outline-warning" onClick={() => this.props.onCancel()}>Tutup</button>
                </ModalFooter>
            </Modal>
        )
    }
}