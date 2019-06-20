import React from "react";
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    InputGroup,
    InputGroupAddon,
    Button,
    Input,
    Table
} from "reactstrap";
import Loadable from "react-loading-overlay";
import "react-select/dist/react-select.css";
import Select from "react-select";
import swal from "sweetalert";

export default class Alur extends React.Component {

    state = {
        ready: false,
        purposes: [],
        steps: [],
        users: [],
        selected_purpose: null
    }

    componentWillMount() {
        this.props.models.Purpose.collection({
            attributes: ['id', 'name'],
            include: [{
                model: 'Step',
                attributes: ['id', 'name']
            }]
        })
        .then((data) => {
            return this.setState({ steps: data.rows });
        })
        .then(() => this.props.models.User.collection({
            attributes: ['id', 'name']
        }))
        .then((data) => {
            this.setState({ users: data.rows, ready: true });
        })
        .catch(this.props._apiReject);
    }

    _onChangeTujuan(e) {
        let { value: idx } = e.target;
        if (idx) {
            this.props.models.Step.collection({
                where: {
                    purpose_id: this.state.purposes[idx].id
                }
            }).then((data) => {
                
            })
            this.setState({ steps: this.state.purposes[idx].steps, selected_purpose: this.state.purposes[idx] });
        } else {
            this.setState({ selected_purpose: null });
        }
    }

    _onChangeMeta(e, idx) {
        let { name, value } = e.target;
        let { steps } = this.state;
        steps[idx][name] = value;
        this.setState({ steps });
    }

    _handleByChange(selected, idx) {
        let { steps } = this.state;
        steps[idx].handle_by = selected;
        this.setState({ steps });
    }

    _tambahStep() {
        let { steps } = this.state;
        steps.push({
            id_tujuan: this.state.id_tujuan,
            nama_step: "",
            deskripsi: "",
            step: this.state.steps.length + 1,
            handle_by: []
        });
        this.setState({ steps });
    }

    _simpanSteps() {
        this.props.models.authenticated.tujuan_set_steps(this.state.steps).then((data) => {
            if (data.status === true) {
                swal("Konfirmasi", "Alur tersimpan di database", "success");
            } else {
                swal("Error", data.message || `Tujuan terdeteksi masih terdaftar dalam sebuah dokumen. Alur tidak bisa dirubah saat masih ada dokumen yang berjalan di dalamnya \n\n\n${data.error}`, "error");
            }
        }).catch(this.props._apiReject);
    }

    _kurangStep(i) {
        console.log(i);
        let { steps } = this.state;
        console.log(steps);
        steps.splice(i, 1);
        console.log(steps);
        this.setState({ steps });
    }

    _up(i) {
        let { steps } = this.state;
        console.log(steps);
        let a = steps[i];
        let b = steps[i - 1];
        steps[i] = b;
        steps[i - 1] = a;
        console.log(steps);
        this.setState({ steps });
    }

    _down(i) {
        let { steps } = this.state;
        let a = steps[i];
        let b = steps[i + 1];
        steps[i] = b;
        steps[i + 1] = a;
        this.setState({ steps });
    }

    render() {
        return (
            (this.state.ready) ?
                <div className="animated fadeIn">
                    <Row>
                        <Col md="12" lg="12">
                            <Card className="with-react-select">
                                <CardHeader>
                                    <i className="fa fa-align-justify"></i> Atur alur pengerjaan tujuan
                            </CardHeader>
                                <CardBody>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <Button type="button" color="primary"><i className="fa fa-search"></i> Set</Button>
                                        </InputGroupAddon>
                                        <Input type="select" onChange={this._onChangeTujuan.bind(this)}>
                                            <option value="">Pilih tujuan</option>
                                            {(this.state.purposes.map((item, i) => (
                                                <option key={i} value={i}>{item.name}</option>
                                            )))}
                                        </Input>
                                    </InputGroup>
                                    <hr />
                                    {(this.state.selected_purpose) ?
                                        <Table responsive className="with-react-select">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tindakan</th>
                                                    <th>Nama Step</th>
                                                    <th>Deskripsi</th>
                                                    <th>Pengurus</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.steps.map((item, i) => (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>
                                                            <button onClick={() => this._up(i)} className="btn btn-success" disabled={i === 0} ><i className="fa fa-chevron-up"></i></button>{' '}
                                                            <button onClick={() => this._down(i)} className="btn btn-primary" disabled={i === this.state.steps.length - 1}><i className="fa fa-chevron-down"></i></button>{' '}
                                                            <button onClick={() => this._kurangStep(i)} className="btn btn-danger"><i className="fa fa-trash"></i></button>
                                                        </td>
                                                        <td><Input type="text" name="nama_step" value={this.state.steps[i].nama_step} onChange={(e) => this._onChangeMeta(e, i)} /></td>
                                                        <td><Input type="textarea" name="deskripsi" value={this.state.steps[i].deskripsi} onChange={(e) => this._onChangeMeta(e, i)} /></td>
                                                        <td>
                                                            <Select
                                                                name="form-field-name"
                                                                labelKey="nama_pengguna"
                                                                valueKey="id_pengguna"
                                                                value={this.state.steps[i].handle_by}
                                                                multi
                                                                onChange={(e) => this._handleByChange(e, i)}
                                                                options={this.state.pengguna}
                                                                valueRenderer={(option) => {
                                                                    return <span>{option.nama_pengguna} - {option.level}</span>
                                                                }}
                                                                optionRenderer={(option) => {
                                                                    return <span>{option.nama_pengguna} - {option.level}</span>
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td colSpan="5"><button onClick={this._tambahStep.bind(this)} className="btn btn-block btn-outline-success"><i className="fa fa-plus"></i> Tambah</button></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan="5"><button onClick={this._simpanSteps.bind(this)} className="btn btn-block btn-outline-primary"><i className="fa fa-save"></i> Simpan</button></td>
                                                </tr>
                                            </tbody>
                                        </Table> :
                                        <div className="hint-container">
                                            <h3 className="text-center">Pilih tujuan diatas untuk mengatur alur kerjanya</h3>
                                        </div>
                                    }

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
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