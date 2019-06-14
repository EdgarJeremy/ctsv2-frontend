import React from "react";
import {Modal, ModalHeader, ModalBody, Table, Card, CardHeader, CardBody} from "reactstrap";
import moment from "moment";
import "moment/locale/id.js";
import _ from "lodash";

export default class DetailPopup extends React.Component {

    state = {
        ready: false,
        tracks: []
    }

    constructor(props) {
        super(props);
        moment.locale("id");
    }

    _initialize(p = this.props) {
        if(p.log) {
            this.props.models.authenticated.pendaftaran_one_done(p.id_pendaftaran).then((tracks) => {
                this.setState({tracks: tracks.data, ready: true});
            }).catch(this.props._apiReject);
        } else {
            this.props.models.authenticated.pendaftaran_one_track(p.id_pendaftaran).then((tracks) => {
                this.setState({tracks: tracks.data, ready: true});
            }).catch(this.props._apiReject);
        }
    } 

    componentWillReceiveProps(p) {
        if(p.id_pendaftaran)
            this._initialize(p);
    }

    render() {
        return(
            (this.state.ready) ?
            <Modal isOpen={this.props.open} className="modal-primary modal-lg modal-wide">
                <ModalHeader toggle={this.props.toggle}>Detail Pendaftaran</ModalHeader>
                <ModalBody className="lay">
                    <Card>
                        <CardHeader>
                            Informasi Pendaftar
                        </CardHeader>
                        <CardBody>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Nama Pendaftar</th>
                                        <th>NIK Pendaftar</th>
                                        <th>Tujuan Pendaftaran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{this.state.tracks[0].nama_pendaftar}</td>
                                        <td>{this.state.tracks[0].nik_pendaftar}</td>
                                        <td>{this.state.tracks[0].tujuan}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader>
                            Jejak Berkas
                        </CardHeader>
                        <CardBody>
                            <section id="conference-timeline">
                                <div className="timeline-start">Mulai</div>
                                <div className="conference-center-line"></div>
                                <div className="conference-timeline-content">
                                
                                    {this.state.tracks.map((item, i) => {
                                        let duration = "Sedang Diproses";
                                        if(this.state.tracks[i+1]) {
                                            let start = item.waktu;
                                            let end = this.state.tracks[i+1].waktu;
                                            let days = moment(end).diff(start, 'days');
                                            let hours = moment(end).diff(start, 'hours') % 24;
                                            let minutes = moment(end).diff(start, 'minutes') % 60;
                                            let seconds = moment(end).diff(start, "seconds");
                                            duration = ((days > 0) ? days + ' Hari ' : '') + ((hours > 0) ? hours + ' Jam ' : '') + ((minutes > 0) ? minutes + ' Menit ' : ''); 
                                            duration = _.isEmpty(duration) ? seconds + " Detik" : duration;
                                        } else if(this.props.log) {
                                            let start = item.waktu;
                                            let end = item.waktu_selesai;
                                            let days = moment(end).diff(start, 'days');
                                            let hours = moment(end).diff(start, 'hours') % 24;
                                            let minutes = moment(end).diff(start, 'minutes') % 60;
                                            let seconds = moment(end).diff(start, "seconds");
                                            duration = ((days > 0) ? days + ' Hari ' : '') + ((hours > 0) ? hours + ' Jam ' : '') + ((minutes > 0) ? minutes + ' Menit ' : ''); 
                                            duration = _.isEmpty(duration) ? seconds + " Detik" : duration;
                                        }
                                        return (
                                            <div key={i} className="timeline-article">
                                                <div className="content-left-container">
                                                    <div className="content-left">
                                                        <p><b>{item.nama_step}</b> <br /><small>{item.deskripsi_step || "Tidak ada deskripsi"}</small><span className="article-number">{item.nomor_step}</span></p>
                                                    </div>
                                                </div>
                                                <div className="content-right-container">
                                                    <div className="content-right">
                                                        <b>Waktu mulai diurus</b><br />
                                                        { moment(item.waktu).format("Do MMMM YYYY, h:mm:ss a") }<br />
                                                        <b>Pengurus berkas</b><br />
                                                        {item.nama_pengurus}<br />
                                                        <b>Waktu pengerjaan</b><br />
                                                        {duration}<br />
                                                        <b>Deskripsi / Alasan Ketertundaan</b><br />
                                                        {item.deskripsi_track}
                                                    </div>
                                                </div>
                                                <div className="meta-date">
                                                    <span className="date">{item.nomor_step}</span>
                                                    <span className="month">STEP</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                
                                </div>
                                <div className="timeline-end">{this.props.log ? "Selesai" : "Dalam Proses"}</div>
                            </section>
                        </CardBody>
                    </Card>
                    
                    
                </ModalBody>
            </Modal> : ""
        )
    }

}