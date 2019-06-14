import React from 'react';
import {
    Row,
    Col, 
    Card,
    CardBody,
    CardHeader,
    FormGroup,
    Input,
    Label,
    CardFooter,
    Button,
    ListGroup,
    ListGroupItem,
    Progress
} from "reactstrap";
import helper from "../../services/helper";
import Loadable from "react-loading-overlay";
import swal from "sweetalert";
import NextPopup from '../../components/NextPopup';
import _ from "lodash";

export default class Baru extends React.Component {

    initial = {
        tujuan: [],
        syarat: [],
        syaratN: [],
        ready: false,
        requesting: false,
        modalNext: false,
        next: { resp_users: [] },
        id_pendaftaran: null,
        deskripsi: ""
    }

    state = {...this.initial};

    componentWillMount() {
        this._initialization();
    }

    _initialization() {
        this.props.models.authenticated.tujuan_index().then((data) => {
            this.setState({tujuan: data.data.data, ready: true});
        }).catch(this.props._apiReject);
    }

    _pilihanChange(e) {
        let {value} = e.target;
        this.setState({deskripsi: ""});
        if(value) {
            this.setState({requesting: true});
            this.props.models.authenticated.tujuan_get_syarat(value).then((data) => {
                this.setState({syarat: data.data, syaratN: [...data.data], requesting: false, deskripsi: ""});
            }).catch(this.props._apiReject);
        } else this.setState({syarat: []});
    }

    _onSubmit(e) {
        e.preventDefault();
        const data = helper.inspect(new FormData(e.target));
        const errors = [];
        console.log(data);
        if(data.nik.length > 16 || data.nik.length < 16) {
            errors.push('NIK Pendaftar');
        }
        if(data.nik_pemohon.length > 16 || data.nik_pemohon.length < 16) {
            errors.push('NIK Pemohon');
        }
        if(data.nomor_kk.length > 0) {
            if(data.nomor_kk.length > 16 || data.nomor_kk.length < 16) {
                errors.push('Nomor KK');
            }
        }
        if(errors.length) {
            swal('Error', `Panjang ${errors.join(',')} harus 16 karakter`);
        } else {
            this.props.models.authenticated.pendaftaran_create(data).then((res) => {
                this.setState({id_pendaftaran: res.data.insert_id, modalNext: true});
            }).catch(this.props._apiReject);
        }
    }

    _reInitialize() {
        this._main_form.reset();
        this.setState({...this.initial, ready: true});
        this._initialization();
    }

    getDeskripsi() {
        let invalids = [];
        let msg = "";
        for(let i = 0; i < this.state.syaratN.length; i++) {
            if(_.isEmpty(this.state.syaratN[i])) {
                invalids.push(this.state.syarat[i]);
            }
        }
        if(invalids.length)
            msg = "Dokumen yang belum lengkap : \n";
        return msg + invalids.map((item, i) => {
            return item.nama_syarat;
        }).join("\n");
    }

    _getKK(e) {
        let {value} = e.target;
        if(value) {
            this.props.models.external.ambil_keluarga(value).then((data) => {
                if(!_.isEmpty(data.data)) {
                    this.nama_kepala_keluarga.value = data.data.kepala_keluarga.NAMA_LGKP;
                    this.nama_kepala_keluarga.readOnly = true;
                } else {
                    this.nama_kepala_keluarga.value = "";
                    this.nama_kepala_keluarga.readOnly = false;
                }
            }).catch(this.props._apiReject);
        }
    }

    _getNIK(e) {
        let {value} = e.target;
        if(value) {
            this.setState({requesting: true});
            this.props.models.external.ambil_penduduk(value).then((data) => {
                if(data.status === true) {
                    this.nama.value = data.data.NAMA_LGKP;
                    this.nama.readOnly = true;
                    this.nomor_kk.value = data.data.NO_KK;
                    this._getKK({target: {
                        value: data.data.NO_KK
                    }});
                    this.setState({requesting: false});
                } else {
                    this.nama.value = "";
                    this.nama.readOnly = false;
                    this.nomor_kk.value = "";
                    this.nama_kepala_keluarga.value = "";
                    this.nama_kepala_keluarga.readOnly = false;
                    this.setState({requesting: false});
                }
            }).catch(this.props._apiReject);
        }
    }

    _preventOver16(e) {
        if(isNaN(e.target.value * 1)) {
            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
        }
        if(e.target.value.length > 16) {
            e.target.value = e.target.value.substring(0, e.target.value.length - 1);
        }
    }

    render() {
        return (
            (this.state.ready) ?
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12">
                        <form ref={(e) => this._main_form = e} onSubmit={this._onSubmit.bind(this)}>
                            <Card>
                                <CardHeader>
                                    <strong>Formulir Pendaftaran</strong>
                                </CardHeader>
                                <CardBody>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>NIK Pemohon</Label>
                                                    <input onChange={this._preventOver16} className="form-control" type="text" name="nik_pemohon" placeholder="Nomor Induk Kependudukan Pemohon.." required/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Nama Pemohon</Label>
                                                    <input className="form-control" type="text" name="nama_pemohon" placeholder="Nama Pemohon.." required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Tujuan</Label>
                                                    <Input onChange={this._pilihanChange.bind(this)} type="select" name="id_tujuan" required>
                                                        <option value="">Pilih Tujuan</option>
                                                        {this.state.tujuan.map((item, i) => 
                                                            <option key={i} value={item.id_tujuan}>{item.nama_tujuan} - {item.deskripsi}</option>
                                                        )}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        {(this.state.syarat.length) ? 
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Syarat</Label>
                                                    <ListGroup>
                                                        {this.state.syarat.map((item,i) => 
                                                            <ListGroupItem key={i}>
                                                                <input checked={!_.isEmpty(this.state.syaratN[i])} onChange={(e) => { 
                                                                    if(!e.target.checked) {
                                                                        let {syaratN} = this.state;
                                                                        syaratN[i] = null;
                                                                        this.setState({ syaratN }, () => this.setState({ deskripsi: this.getDeskripsi()}));
                                                                    } else {
                                                                        let {syaratN} = this.state;
                                                                        syaratN[i] = {...item};
                                                                        this.setState({ syaratN }, () => this.setState({ deskripsi: this.getDeskripsi()}));
                                                                    }
                                                                    console.log(this.state);
                                                                }} type="checkbox" id={"checkbox"+i} />{" "}
                                                                <label htmlFor={"checkbox"+i}>{item.nama_syarat}</label>
                                                            </ListGroupItem>
                                                        )}
                                                    </ListGroup>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        : ""}
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>NIK Pendaftar</Label>
                                                    <input onChange={this._preventOver16} className="form-control" type="text" name="nik" placeholder="Nomor Induk Kependudukan Pemohon.." required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Nama Pendaftar</Label>
                                                    <input className="form-control" ref={(e) => this.nama = e} type="text" name="nama_pendaftar" placeholder="Nama pendaftar.." required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Nomor KK</Label>
                                                    <input onChange={this._preventOver16} className="form-control" ref={(e) => this.nomor_kk = e} type="text" name="nomor_kk" placeholder="Nomor Kartu Keluarga.." />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Nama Kepala Keluarga</Label>
                                                    <input className="form-control" ref={(e) => this.nama_kepala_keluarga = e} type="text" name="nama_kepala_keluarga" placeholder="Nama Kepala Keluarga.." />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Tanggal Pengambilan Berkas</Label>
                                                    <input className="form-control" ref={(e) => this.tanggal_pengambilan = e} type="date" name="tanggal_pengambilan" placeholder="Tanggal Pengambilan.." required />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12">
                                                <FormGroup>
                                                    <Label>Deskripsi</Label>
                                                    <Input rows="10" type="textarea" name="deskripsi" placeholder="Masukkan deskripsi/komentar tentang pendaftaran ini" value={this.state.deskripsi} onChange={(e) => this.setState({deskripsi: e.target.value})}/>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Progress hidden={!this.state.requesting} animated color="success" value="100" className="mb-1">
                                            Mengambil data...
                                        </Progress>
                                </CardBody>
                                <CardFooter>
                                    <div className="form-actions">
                                        <Button type="submit" color="primary">Simpan</Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </form>
                    </Col>
                </Row>
                <NextPopup 
                    {...this.props}
                    open={this.state.modalNext} 
                    id_pendaftaran={this.state.id_pendaftaran} 
                    onSuccess={() => {
                        return swal({
                            title: "Konfirmasi",
                            text: "Pendaftaran berhasil dikirim ke pengurus pada langkah selanjutnya",
                            icon: "success"
                        }).then(this._reInitialize.bind(this));
                    }}
                    onCancel={() => {
                        return swal({
                            title: "Apa anda yakin?",
                            text: "Pendaftaran sudah tersimpan namun dalam status pending pada step pendaftaran. Anda bisa melanjutkan pendaftaran ke step selanjutnya dengan mengklik tombol selanjutnya pada halaman daftara pendaftaran diproses",
                            icon: "warning",
                            buttons: [
                                "Tidak, kembali ke formulir proses",
                                "Ya, tunda proses pendaftaran"
                            ],
                            dangerMode: true
                        }).then((isConfirm) => {
                            if(isConfirm) {
                                swal({
                                    title: "Konfirmasi",
                                    text: "Pendaftaran tersimpan dalam status pending",
                                    icon: "success"
                                }).then(this._reInitialize.bind(this));
                            }
                        });
                    }}/>
            </div> :
            <Loadable
                spinnerSize="100px"
                className="loading-full"
                active={true}
                spinner
                color="#000000"
                text="Memuat data.."/>
        )
    }

}