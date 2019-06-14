import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Table, Row } from 'reactstrap';
import Loadable from "react-loading-overlay";
import PengurusPopup from "../../components/PengurusPopup";
import swal from "sweetalert";

export default class Pengurus extends React.Component {

    state = {
        ready: false,
        pengguna: [],
        totalpengguna: 0,
        searchValue: "",
        limit: 15,
        offset: 0,
        page: 1,
        totalPage: 0,
        modalTambah: false,
        modalEdit: false,
        selected: null
    }

    componentWillMount() {
        this._initialize();
    }

    _initialize() {
        this.props.models.authenticated.pengguna_index(this.state.limit, this.state.offset, this.state.searchValue).then((data) => {
            this.setState({
                pengguna: data.data.data, 
                ready: true, 
                totalpengguna: data.data.total,
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

    _openEdit(id_pengguna) {
        this.setState({selected: id_pengguna, modalEdit: true});
    }

    _onDelete(id_pengguna, nama_pengguna) {
        swal({
            title: "Anda yakin?",
            text: `Anda akan menghapus pengguna dengan nama ${nama_pengguna} dari sistem?`,
            buttons: [
                "Tidak",
                "Ya"
            ],
            icon: "warning"
        }).then((isConfirm) => {
            if(isConfirm) {
                this.props.models.authenticated.pengguna_delete(id_pengguna).then((data) => {
                    if(data.status === true) {
                        swal("Konfirmasi", "Pengurus berhasil dihapus dari sistem", "success");
                    } else {
                        swal("Error", data.message || `Pengurus terdeteksi masih menghandle sebuah dokumen. Pastikan pengerjaan sudah selesai sebelum menghapus pengurusnya \n\n\n${data.error}`, "error");
                    }
                    this._initialize();
                }).catch(this.props._apiReject);  
            }
        });
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
                    <Col xs="12" sm="12">
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Daftar pengurus
                            </CardHeader>
                            <CardBody>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                                    </InputGroupAddon>
                                    <Input type="text" value={this.state.searchValue} onChange={this._onSearch.bind(this)} id="input1-group2" name="input1-group2" placeholder="Nama pengurus.." />
                                </InputGroup>
                                <hr />
                                <button onClick={this._openAdd.bind(this)} type="button" className="btn btn-success">
                                    <i className="icons icon-user-follow"></i>&nbsp;Tambah Pengurus
                                </button>
                                <hr/>
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>Nama pengurus</th>
                                            <th>Username</th>
                                            <th>Level</th>
                                            <th>Status</th>
                                            <th>Deskripsi</th>
                                            <th>Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.pengguna.length !== 0 ?
                                            this.state.pengguna.map((item,i) => {
                                                return(
                                                    <tr key={i}>
                                                        <td>{item.nama_pengguna}</td>
                                                        <td>{item.username}</td>
                                                        <td>{item.level}</td>
                                                        <td>{item.status ? "Aktif" : "Nonaktif"}</td>
                                                        <td>{item.deskripsi}</td>
                                                        <td>
                                                            <button type="button" className="btn btn-outline-primary">
                                                                <i className="fa fa-eye"></i>&nbsp;Detail
                                                            </button>{' '}
                                                            <button onClick={() => this._openEdit(item.id_pengguna)} type="button" className="btn btn-outline-info">
                                                                <i className="fa fa-edit"></i>&nbsp;Edit
                                                            </button>{' '}
                                                            <button onClick={() => this._onDelete(item.id_pengguna, item.nama_pengguna)} type="button" className="btn btn-outline-danger">
                                                                <i className="fa fa-trash"></i>&nbsp;Hapus
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            }) :
                                            <tr>
                                                <td colSpan="6" className="text-center">Tidak ada data yang ditemukan</td>
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
                </Row>
                <PengurusPopup 
                    {...this.props} 
                    open={this.state.modalTambah} 
                    toggle={() => this.setState({modalTambah: false})}
                    onSuccess={() => {
                        this.setState({modalTambah: false});
                        this._initialize();
                    }} />
                <PengurusPopup 
                    {...this.props} 
                    edit={true}
                    id_pengguna={this.state.selected}
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