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
  Table,
  Form,
  FormGroup
} from "reactstrap";
import Loadable from "react-loading-overlay";
import "react-select/dist/react-select.css";
import Select from "react-select";
import helper from '../../services/helper';
import swal from "sweetalert";

export default class Alur extends React.Component {
  state = {
    ready: false,
    purposes: [],
    steps: [],
    users: [],
    new_step_users: [],
    selected_purpose: null
  };

  componentWillMount() {
    this.props.models.Purpose.collection({
      attributes: ["id", "name"]
    })
      .then(data => {
        return this.setState({ purposes: data.rows });
      })
      .then(
        this.props.models.User.collection.bind(this.props.models.User, { attributes: ['id', 'name', 'level', 'pending_user'] })
      )
      .then(data => {
        this.setState({ users: data.rows, ready: true });
      })
      .catch(this.props._apiReject);
  }

  _fetchSteps(purpose_id) {
    return this.props.models.Step.collection({
      attributes: ['id', 'name', 'step', 'purpose_id'],
      where: { purpose_id },
      include: [{ attributes: ['id', 'name', 'level', 'pending_user'], model: 'User' }],
      order: [['step', 'asc']]
    }).then(data => {
      this.setState({
        steps: data.rows,
      });
    });
  }

  _onChangeTujuan(e) {
    let { value: idx } = e.target;
    if (idx) {
      this._fetchSteps(this.state.purposes[idx].id).then(() => {
        this.setState({
          selected_purpose: this.state.purposes[idx]
        });
      })
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

  _tambahStep(e) {
    e.persist();
    e.preventDefault();
    const formData = helper.inspect(new FormData(e.target));
    formData.purpose_id = this.state.selected_purpose.id;
    formData.users = this.state.new_step_users;
    this.props.models.Step.create(formData).then((step) => {
      this._fetchSteps(this.state.selected_purpose.id).then(() => {
        this.setState({ new_step_users: []}, () => {
          e.target.reset();
        });
      });
    })
      .catch(this.props._apiReject);
  }

  _saveChangedStep() {
    const { steps } = this.state;
    const updatedData = steps.map((s) => ({
      name: s.name,
      description: s.description,
      users: s.users.map((u) => u.id),
      purpose_id: s.purpose_id
    }));
    const pUpdate = steps.map((s, i) => s.update(updatedData[i]));
    Promise.all(pUpdate).then((res) => {
      swal('Berhasil diupdate', 'Data step berhasil diupdate', 'success');
    }).catch(this.props._apiReject);
  }

  _deleteStep(idx) {
    this.state.steps[idx].delete().then(() => {
      this._fetchSteps(this.state.selected_purpose.id);
    }).catch(this.props._apiReject);
  }

  render() {
    return this.state.ready ? (
      <div className="animated fadeIn">
        <Row>
          <Col md="12" lg="12">
            <Card className="with-react-select">
              <CardHeader>
                <i className="fa fa-align-justify" /> Atur alur pengerjaan
								tujuan
              </CardHeader>
              <CardBody>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">
                    <Button type="button" color="primary">
                      <i className="fa fa-search" /> Set
                    </Button>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    onChange={this._onChangeTujuan.bind(this)}
                  >
                    <option value="">Pilih tujuan</option>
                    {this.state.purposes.map((item, i) => (
                      <option key={i} value={i}>
                        {item.name}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
                <hr />
                {this.state.selected_purpose ? (
                  <Row>
                    <Col md="3" lg="3">
                      <Card>
                        <CardHeader>Tambah Step Baru</CardHeader>
                        <CardBody>
                          <Form onSubmit={this._tambahStep.bind(this)}>
                            <FormGroup>
                              <Input type="text" placeholder="Nama Step" name="name" />
                            </FormGroup>
                            <FormGroup>
                              <Input type="textarea" placeholder="Deskripsi" name="description" />
                            </FormGroup>
                            <FormGroup>
                              <Select
                                name="users"
                                labelKey="name"
                                valueKey="id"
                                placeholder="Daftar pengurus"
                                multi
                                value={this.state.new_step_users}
                                onChange={(selected) => this.setState({ new_step_users: selected.map((s) => s.id) })}
                                options={this.state.users}
                                valueRenderer={option => {
                                  return (
                                    <span>
                                      {option.name} ({option.pending_user ? 'Pending' : 'Regular'})
                                    </span>
                                  );
                                }}
                                optionRenderer={option => {
                                  return (
                                    <span>
                                      {option.name} - {option.level} ({option.pending_user ? 'Pending' : 'Regular'})
                                    </span>
                                  );
                                }}
                              />
                            </FormGroup>
                            <Button type="submit" color="primary">Tambah</Button>
                          </Form>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="9" lg="9">
                      <Card>
                        <CardHeader>Step Tersimpan</CardHeader>
                        <CardBody>
                          <Table responsive className="with-react-select">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Nama Step</th>
                                <th>Deskripsi</th>
                                <th>Pengurus</th>
                                <th>Tindakan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.steps.map((item, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>
                                    <Input
                                      type="text"
                                      name="name"
                                      value={this.state.steps[i].name}
                                      onChange={e => this._onChangeMeta(e, i)}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      type="textarea"
                                      name="description"
                                      value={this.state.steps[i].description}
                                      onChange={e => this._onChangeMeta(e, i)}
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      name="form-field-name"
                                      labelKey="name"
                                      valueKey="id"
                                      value={this.state.steps[i].users.map((u) => u.id)}
                                      multi
                                      onChange={selected => {
                                        const { steps } = this.state;
                                        steps[i].users = selected;
                                        this.setState({ steps });
                                      }}
                                      options={this.state.users}
                                      valueRenderer={option => {
                                        return (
                                          <span>
                                            {option.name} ({option.pending_user ? 'Pending' : 'Regular'})
                                          </span>
                                        );
                                      }}
                                      optionRenderer={option => {
                                        return (
                                          <span>
                                            {option.name} - {option.level} ({option.pending_user ? 'Pending' : 'Regular'})
                                          </span>
                                        );
                                      }}
                                    />
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => this._deleteStep(i)}
                                      className="btn btn-danger"
                                    >
                                      <i className="fa fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {this.state.steps.length === 0 && (
                                <tr>
                                  <td colSpan="5">
                                    <center>Belum ada step yang disimpan</center>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                          <button className="btn btn-primary" onClick={this._saveChangedStep.bind(this)}>Simpan</button>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                ) : (
                    <div className="hint-container">
                      <h3 className="text-center">
                        Pilih tujuan diatas untuk mengatur alur kerjanya
                    </h3>
                    </div>
                  )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    ) : (
        <Loadable
          spinnerSize="100px"
          className="loading-full"
          active={true}
          spinner
          color="#000000"
          text="Memuat data.."
        />
      );
  }
}
