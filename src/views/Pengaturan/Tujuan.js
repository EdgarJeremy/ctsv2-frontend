import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Table, Row } from 'reactstrap';
import Loadable from "react-loading-overlay";
import TujuanPopup from "../../components/TujuanPopup";
import swal from "sweetalert";

export default class Tujuan extends React.Component {

    state = {
        ready: false,
        tujuan: [],
        totaltujuan: 0,
        searchValue: "",
        limit: 15,
        offset: 0,
        page: 1,
        totalPage: 0,
        modalTambah: false,
        modalEdit: false,
        selected: null,
        selection: null,
        syarat: []
    }

    componentWillMount() {
        this._initialize();
    }

    _initialize() {
        this.props.models.authenticated.tujuan_index(this.state.limit, this.state.offset, this.state.searchValue).then((data) => {
            this.setState({
                tujuan: data.data.data, 
                ready: true, 
                totaltujuan: data.data.total,
                totalPage: Math.ceil(data.data.total / this.state.limit)
            });
        }).catch(this.props._apiReject);
    }

    _onSearch(e) {
        this.setState({searchValue: e.target.value}, () => {
            this._initialize();
        });
    }

    _setPage(page) {
        this.setState({page, offset: (page - 1) * this.state.limit}, () => {
            this._initialize();
        });
    }

    _openAdd() {
        this.setState({modalTambah: true});
    }

    _openEdit(id_tujuan) {
        this.setState({selected: id_tujuan, modalEdit: true});
    }

    _onDelete(id_tujuan, nama_tujuan) {
        swal({
            title: "Anda yakin?",
            text: `Anda akan menghapus tujuan dengan nama ${nama_tujuan} dari sistem?`,
            buttons: [
                "Tidak",
                "Ya"
            ],
            icon: "warning"
        }).then((isConfirm) => {
            if(isConfirm) {
                this.props.models.authenticated.tujuan_delete(id_tujuan).then((data) => {
                    if(data.status === true) {
                        swal("Konfirmasi", "Tujuan berhasil dihapus dari sistem", "success");
                    } else {
                        swal("Error", data.message || `Tujuan terdeteksi masih terdaftar dalam sebuah dokumen. Pastikan pengerjaan sudah selesai sebelum menghapus tujuan terkait. \n\n\n${data.error}`, "error");
                    }
                    this._initialize();
                }).catch(this.props._apiReject);  
            }
        });
    }

    _onSelect(id_tujuan, nama_tujuan) {
        if(id_tujuan === this.state.selection) {
            this.setState({selection: null});
        } else {
            this.setState({selection: id_tujuan}, () => {
                this._getSyarat();
            });
        }
    }

    _getSyarat() {
        this.props.models.authenticated.tujuan_get_syarat(this.state.selection).then((data) =>{
            this.setState({syarat: data.data});
        }).catch(this.props._apiReject);
    }

    _tambahSyarat() {
        let {syarat} = this.state;
        syarat.push({
            id_tujuan: this.state.selection,
            nama_syarat: "",
            deskripsi: ""
        });
        this.setState({syarat});
    }

    _kurangSyarat(idx) {
        let {syarat} = this.state;
        syarat.splice(idx, 1);
        this.setState({syarat});
    }

    _simpanSyarat() {
        this.props.models.authenticated.tujuan_set_syarat({
            id_tujuan: this.state.selection,
            syarat: this.state.syarat
        }).then((data) => {
            if(data.status === true) {
                swal("Konfirmasi", "Syarat terupdate", "success");
            } else {
                swal("Error", data.message || data.error, "error");
            }
        }).catch(this.props._apiReject);
    }

    _onChangeSyarat(e, idx) {
        let {name, value} = e.target;
        let {syarat} = this.state;
        syarat[idx][name] = value;
        this.setState({syarat});
    }

    render() {
        let links = [];
        for(let i = 0; i < this.state.totalPage;i++) {
            links.push(
                <PaginationItem key={i} active={(this.state.page === i+1)}>
                    <PaginationLink onClick={() => this._setPage(i+1)} tag="button">{i+1}</PaginationLink>
                </PaginationItem>
            );
        }
        return(
            (this.state.ready) ?
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="12" md="7" lg="7">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Daftar tujuan
                            </CardHeader>
                            <CardBody>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                                    </InputGroupAddon>
                                    <Input type="text" value={this.state.searchValue} onChange={this._onSearch.bind(this)} id="input1-group2" name="input1-group2" placeholder="Nama tujuan.." />
                                </InputGroup>
                                <hr />
                                <button ref={(e) => this.e = e} onClick={this._openAdd.bind(this)} type="button" className="btn btn-success">
                                    <i className="icons icon-plus"></i>&nbsp;Tambah Tujuan
                                </button>
                                <hr/>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>Nama tujuan</th>
                                            <th>Deskripsi</th>
                                            <th>Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.tujuan.length !== 0 ?
                                            this.state.tujuan.map((item,i) => {
                                                return(
                                                    <tr key={i}>
                                                        <td>{item.nama_tujuan}</td>
                                                        <td>{item.deskripsi}</td>
                                                        <td>
                                                            <button onClick={() => this._openEdit(item.id_tujuan)} type="button" className="btn btn-outline-info">
                                                                <i className="fa fa-edit"></i>&nbsp;Edit
                                                            </button>{' '}
                                                            <button onClick={() => this._onDelete(item.id_tujuan, item.nama_tujuan)} type="button" className="btn btn-outline-danger">
                                                                <i className="fa fa-trash"></i>&nbsp;Hapus
                                                            </button>{' '}
                                                            <button onClick={() => this._onSelect(item.id_tujuan, item.nama_tujuan)} type="button" className={`btn ${((this.state.selection === item.id_tujuan) ? "btn-success" : "btn-outline-success")}`}>
                                                                <i className="fa fa-gear"></i>&nbsp;Atur
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) :
                                            <tr>
                                                <td colSpan="3" className="text-center">Tidak ada data yang ditemukan</td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>

                                {(this.state.totalPage > 1) ? 
                                    <Pagination>
                                        <PaginationItem onClick={(this.state.page === 1) ? undefined : () => this._setPage(this.state.page - 1)} disabled={this.state.page === 1}><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                                            {links}
                                        <PaginationItem onClick={(this.state.page === this.state.totalPage) ? undefined : () => this._setPage(this.state.page + 1)} disabled={this.state.page === this.state.totalPage} ><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                                    </Pagination>
                                    : ""}
                                
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="12" md="5" lg="5">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Syarat
                            </CardHeader>
                            <CardBody>
                                {(this.state.selection) ?
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Dokumen</th>
                                                <th>Deskripsi</th>
                                                <th>Hapus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.syarat.map((item,i) => (
                                                <tr key={i}>
                                                    <td>
                                                        <Input type="text" name="nama_syarat" value={this.state.syarat[i].nama_syarat} onChange={(e) => this._onChangeSyarat(e, i)} />
                                                    </td>
                                                    <td>
                                                        <Input type="textarea" name="deskripsi" value={this.state.syarat[i].deskripsi || ""} onChange={(e) => this._onChangeSyarat(e, i)} />
                                                    </td>
                                                    <td>
                                                        <button onClick={() => this._kurangSyarat(i)} className="btn btn-danger"><i className="fa fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td colSpan="3"><button onClick={this._tambahSyarat.bind(this)} className="btn btn-block btn-outline-success"><i className="fa fa-plus"></i> Tambah</button></td>
                                            </tr>
                                            <tr>
                                                <td colSpan="3"><button onClick={this._simpanSyarat.bind(this)} className="btn btn-block btn-outline-primary"><i className="fa fa-save"></i> Simpan</button></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                : 
                                <div className="hint-container">
                                    <h3 className="text-center">Pilih salah satu tujuan untuk diatur syaratnya</h3>
                                    <hr />
                                    <img alt="Hint" className="hint-img" src={require("../../images/syarat-hint.png")} />
                                </div>}
                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <TujuanPopup
                    {...this.props} 
                    open={this.state.modalTambah} 
                    toggle={() => this.setState({modalTambah: false})}
                    onSuccess={() => {
                        this.setState({modalTambah: false});
                        this._initialize();
                    }} />
                <TujuanPopup 
                    {...this.props} 
                    edit={true}
                    id_tujuan={this.state.selected}
                    open={this.state.modalEdit} 
                    toggle={() => this.setState({modalEdit: false})}
                    onSuccess={() => {
                        this.setState({modalEdit: false});
                        this._initialize();
                    }} />
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