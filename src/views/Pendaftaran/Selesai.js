import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Table, Row } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import Loadable from "react-loading-overlay";
import NextPopup from '../../components/NextPopup';
import DetailPopup from "../../components/DetailPopup";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import ReportPopup from '../../components/ReportPopup';

export default class Selesai extends React.Component {

    state = {
        ready: false,
        pendaftaran: [],
        totalPendaftaran: 0,
        searchValue: "",
        allEntry: true,
        limit: 15,
        offset: 0,
        page: 1,
        totalPage: 0,
        modalNext: false,
        selectedNext: null,
        modalDetail: false,
        selectedDetail: null,
        startDate: moment(new Date()).format(moment.HTML5_FMT.DATE),
        endDate: moment(new Date()).format(moment.HTML5_FMT.DATE),
        tujuan: [],
        selectedTujuan: "",
        modalRekap: false
    }

    componentWillMount() {
        this._initialize();
        this.props.models.authenticated.tujuan_index().then((res) => {
            this.setState({
                tujuan: res.data.data
            });
        });
    }

    _initialize() {
        this.props.models.authenticated.pendaftaran_all_done(this.state.limit, this.state.offset, this.state.searchValue, this.state.startDate, this.state.endDate, !this.state.allEntry, this.state.selectedTujuan).then((data) => {
            this.setState({
                pendaftaran: data.data.data,
                ready: true,
                totalPendaftaran: data.data.total,
                totalPage: Math.ceil(data.data.total / this.state.limit)
            });
        }).catch(this.props._apiReject);
    }

    _onSearch(e) {
        this.setState({ searchValue: e.target.value }, () => {
            this._initialize();
        });
    }

    _setPage(page) {
        this.setState({ page, offset: (page - 1) * this.state.limit }, () => {
            this._initialize();
        });
    }

    _openNext(id_pendaftaran) {
        this.setState({ selectedNext: id_pendaftaran, modalNext: true });
    }

    _openDetail(id_pendaftaran) {
        this.setState({ selectedDetail: id_pendaftaran, modalDetail: true });
    }

    _handleDateRange(e, selectionRange) {
        this.setState({
            startDate: selectionRange.startDate.format(moment.HTML5_FMT.DATE),
            endDate: selectionRange.endDate.format(moment.HTML5_FMT.DATE)
        }, this._initialize.bind(this));
        console.log(selectionRange.startDate.format(moment.HTML5_FMT.DATE));
    }

    _handleEntryChange() {
        this.setState({ allEntry: !this.state.allEntry }, () => {
            this._initialize();
        });
    }

    _handleTujuanChange(e) {
        this.setState({ selectedTujuan: e.target.value }, () => {
            this._initialize();
        });
    }

    render() {
        let links = [];
        for (let i = 0; i < this.state.totalPage; i++) {
            links.push(
                <PaginationItem key={i} active={(this.state.page === i + 1)}>
                    <PaginationLink onClick={() => this._setPage(i + 1)} tag="button">{i + 1}</PaginationLink>
                </PaginationItem>
            );
        }
        return (
            (this.state.ready) ?
                <div className="animated fadeIn">
                    <Row>
                        <Col xs="12" sm="12">
                            <Card>
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i> Daftar pendaftaran dalam proses
                            </CardHeader>
                                <CardBody>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                                        </InputGroupAddon>
                                        <Input type="text" value={this.state.searchValue} onChange={this._onSearch.bind(this)} id="input1-group2" name="input1-group2" placeholder="Nama atau NIK pendaftar.." />
                                    </InputGroup>
                                    <hr />
                                    <div className="btn-group btn-group-md">
                                        <button className="btn btn-outline-primary"><i className="fa fa-print"></i> Cetak</button>
                                        <button className="btn btn-outline-primary" onClick={() => this.setState({ modalRekap: true })}><i className="fa fa-file"></i> Rekap</button>
                                    </div>
                                    <hr />
                                    <div className="ctrl-table">
                                        <div className="ctrl-table-item">
                                            <span className="ctrl-table-label">Jumlah Dokumen</span>
                                            <div>{this.state.pendaftaran.length} dokumen</div>
                                        </div>
                                        <div className="ctrl-table-item">
                                            <span className="ctrl-table-label">Jangka waktu</span>
                                            <div>
                                                <DateRangePicker onApply={this._handleDateRange.bind(this)}>
                                                    <button className="btn btn-outline-success"><i className="fa fa-calendar"></i> {this.state.startDate} s/d {this.state.endDate}</button>
                                                </DateRangePicker>
                                            </div>
                                        </div>
                                        {this.props._userdata.level === 'Front Office' ? (
                                            <div className="ctrl-table-item">
                                                <span className="ctrl-table-label">Semua Dokumen</span><br />
                                                <AppSwitch className={'mx-1'} variant={'pill'} color={'primary'} checked={this.state.allEntry} onClick={this._handleEntryChange.bind(this)} />
                                            </div>
                                        ) : null}
                                        <div className="ctrl-table-item">
                                            <span className="ctrl-table-label">Tujuan</span>
                                            <select className="form-control" value={this.state.selectedTujuan} onChange={this._handleTujuanChange.bind(this)}>
                                                <option value="">Semua</option>
                                                {this.state.tujuan.map((t) => (
                                                    <option key={t.id_tujuan} value={t.id_tujuan}>{t.nama_tujuan}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <Table responsive striped>
                                        <thead>
                                            <tr>
                                                <th>Nama pendaftar</th>
                                                <th>NIK pendaftar</th>
                                                <th>Tujuan</th>
                                                <th>Posisi berkas</th>
                                                <th>Pengurus</th>
                                                <th>Waktu berkas tiba</th>
                                                <th>Tanggal pengambilan</th>
                                                <th>Nama Pemohon</th>
                                                <th>NIK Pemohon</th>
                                                <th>Tindakan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.pendaftaran.length !== 0 ?
                                                this.state.pendaftaran.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <td>{item.nama_pendaftar}</td>
                                                            <td>{item.nik_pendaftar}</td>
                                                            <td>{item.tujuan}</td>
                                                            <td>{item.nama_step} - <Badge color={item.id_pengurus !== this.props._userdata.id_pengguna ? "success" : "danger"}>Step {item.nomor_step}</Badge></td>
                                                            <td>{item.nama_pengurus}</td>
                                                            <td>{moment(item.waktu).format("Do MMM YYYY, h:mm:ss a")}</td>
                                                            <td>{moment(item.tanggal_pengambilan).format("Do MMM YYYY")}</td>
                                                            <td>{item.nama_pemohon}</td>
                                                            <td>{item.nik_pemohon}</td>
                                                            <td>
                                                                <button onClick={() => this._openDetail(item.id_pendaftaran)} type="button" className="btn btn-outline-primary">
                                                                    <i className="fa fa-eye"></i>&nbsp;Detail
                                                            </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }) :
                                                <tr>
                                                    <td colSpan="10" className="text-center">Tidak ada data yang ditemukan</td>
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
                    <NextPopup
                        {...this.props}
                        open={this.state.modalNext}
                        id_pendaftaran={this.state.selectedNext}
                        onSuccess={() => { this.setState({ selectedNext: null, modalNext: false }); this._initialize() }}
                        onCancel={() => this.setState({ selectedNext: null, modalNext: false })} />
                    <DetailPopup
                        {...this.props}
                        log={true}
                        open={this.state.modalDetail}
                        id_pendaftaran={this.state.selectedDetail}
                        toggle={() => this.setState({ modalDetail: !this.state.modalDetail, selectedDetail: null })}
                    />
                    <ReportPopup
                        {...this.props}
                        open={this.state.modalRekap}
                        onCancel={() => this.setState({ modalRekap: false })}
                    />
                </div> :
                <Loadable
                    spinnerSize="100px"
                    className="loading-full"
                    active={true}
                    spinner
                    color="#000000"
                    text="Memuat data.." />
        )
    }

}