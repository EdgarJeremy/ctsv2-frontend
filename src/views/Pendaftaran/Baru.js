import React from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  FormGroup,
  Label,
  CardFooter,
  Button,
  Input,
  InputGroup,
  InputGroupButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import Loadable from "react-loading-overlay";
import swal from 'sweetalert';
import axios from 'axios';
import ApiResult from '../../components/ApiResult';
import Queue from '../../components/Queue';

const integrated_source = localStorage.getItem('integrated_source');

export default class Baru extends React.Component {

  state = {
    purposes: null,
    selected_purpose: '',
    name: '',
    nik: '',
    formData: {},
    toggles: [],
    ready: false,
    hoverAct: {},
    modalResult: false,
    result: [],
    source: null,
    startWorkingTime: null,
    queue_id: null
  }

  componentWillMount() {
    this._init();
  }

  _init() {
    this.props.models.Purpose.collection({
      attributes: ['id', 'name', 'form'],
      include: [{
        attributes: ['reference', 'method', 'param_name', 'mapping'],
        model: 'SourceList',
        include: [{
          model: 'Api',
          attributes: ['id', 'name', 'url', 'return_values']
        }]
      }],
      order: [['name', 'asc']]
    }).then((data) => {
      this.setState({
        ready: true,
        purposes: data.rows
      });
    }).catch(this.props._apiReject);
  }

  _changePurpose(e) {
    const idx = e.target.value;
    if (idx) {
      const purpose = this.state.purposes[idx];
      const formData = {};
      purpose.form.forEach((f) => {
        formData[f.name] = "";
      });
      this.setState({
        formData: {}
      }, () => {
        this.setState({
          selected_purpose: purpose,
          formData: formData,
          toggles: purpose.form.map(f => false)
        });
      })
    } else {
      this.setState({
        selected_purpose: '',
        formData: {},
        toggles: []
      });
    }
  }

  _onChangeInput(e) {
    const { value, type, name, checked, files } = e.target;
    const { formData } = this.state;
    if (type === 'checkbox') {
      formData[name] = checked;
      this.setState({ formData });
    } else if (type === 'file') {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        formData[name] = reader.result;
        this.setState({ formData });
      }
      reader.onerror = (err) => console.log(err);
    } else {
      formData[name] = value;
      this.setState({ formData });
    }
  }

  _onSave(e) {
    e.preventDefault();
    e.persist();
    const data = {
      name: this.state.name,
      nik: this.state.nik,
      data: this.state.formData,
      purpose_id: this.state.selected_purpose.id,
      queue_id: this.state.queue_id,
      start_work: this.state.startWorkingTime ? this.state.startWorkingTime : new Date(),
      source: integrated_source
    }
    this.props.models.Registration.create(data)
      .then((registration) => {
        e.target.reset();
        this.setState({
          selected_purpose: '',
          name: '',
          nik: '',
          formData: {},
        }, () => {
          swal('Data Terinput', 'Data berhasil disimpan di sistem', 'success');
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1000);
        });
      }).catch(this.props._apiReject);
  }

  _getSources(reference) {
    const purpose = this.state.selected_purpose;
    return purpose.source_lists.filter((sl, i) => sl.reference === reference);
  }

  _fetchSource(source) {
    if (this.state.formData[source.reference]) {
      if (source.method === 'GET') {
        const params = { [source.param_name]: this.state.formData[source.reference] };
        axios.get(source.api.url, { params }).then((res) => {
          const data = res.data;
          if (Array.isArray(data)) {
            this.setState({
              modalResult: true,
              result: data,
              source: source
            });
          } else {
            this.setState({
              source
            }, () => {
              this._setData(data);
            })
          }
        }).catch((err) => alert(err.message));
      } else {
        const body = { [source.param_name]: this.state.formData[source.reference] };
        axios.post(source.api.url, body).then((res) => {
          const data = res.data;
          this.setState({
            source
          }, () => {
            this._setData(data);
          })
        }).catch((err) => alert(err.message));
      }
    } else {
      alert(`Isi field ${source.reference}`);
    }
  }

  _setData(data) {
    const { formData, source } = this.state;
    Object.keys(source.mapping).forEach((f) => {
      if (source.mapping[f]) {
        formData[f] = data[source.mapping[f]];
      }
    });
    this.setState({ formData, hoverAct: {}, modalResult: false });
  }

  _onStartWorking() {
    this.setState({
      startWorkingTime: new Date()
    });
  }

  render() {
    return (
      (this.state.ready) ?
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="6">
              <Card>
                <CardHeader>
                  <strong>Daftar Antrian</strong>
                </CardHeader>
                <CardBody>
                  <Queue {...this.props} selected={this.state.queue_id} onSelect={(queue) => {
                    if (queue) {
                      this.setState({ queue_id: queue.id, nik: queue.nik, name: queue.name });
                    } else {
                      this.setState({ queue_id: null, nik: '', name: '' });
                    }
                  }} onStartWorking={this._onStartWorking.bind(this)} />
                </CardBody>
              </Card>
            </Col>
            <Col xs="12" sm="6">
              <form ref={(e) => this._main_form = e} onSubmit={this._onSave.bind(this)}>
                <Card>
                  <CardHeader>
                    <strong>Formulir Pendaftaran</strong>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label><b>NIK PEMOHON</b></Label>
                          <Input onChange={(e) => this.setState({ nik: e.target.value })} value={this.state.nik} placeholder="NIK PEMOHON" required />
                        </FormGroup>
                        <FormGroup>
                          <Label><b>NAMA PEMOHON</b></Label>
                          <Input onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} placeholder="NAMA PEMOHON" required />
                        </FormGroup>
                        <FormGroup>
                          <Label><b>TUJUAN</b></Label>
                          <Input
                            onChange={this._changePurpose.bind(this)}
                            type="select"
                            required
                          >
                            <option value="">Pilih tujuan</option>
                            {this.state.purposes.map((p, i) => (
                              <option key={i} value={i}>
                                {p.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup><hr />
                        {
                          this.state.selected_purpose && this.state.selected_purpose.form.map((form, i) => (
                            <FormGroup key={i} check={form.type === 'checkbox'}>
                              {form.type === 'checkbox' ? (
                                <div style={{ marginBottom: 10 }}>
                                  <Label check>
                                    <Input onChange={this._onChangeInput.bind(this)} type={form.type} name={form.name} value={this.state.formData[form.name]} />{' '}
                                    <b>{form.name}</b>
                                  </Label>
                                </div>
                              ) : (
                                <div>
                                  <Label for={form.name} className={this.state.hoverAct[form.name] ? 'will-autocomplete' : ''}><b>{form.name}</b></Label>
                                  {this._getSources(form.name).length > 0 ? (
                                    <InputGroup>
                                      <Input valid={this.state.hoverAct[form.name] ? true : false} accept="image/*" onChange={this._onChangeInput.bind(this)} name={form.name} type={form.type} placeholder={form.name} value={this.state.formData[form.name]} />
                                      <InputGroupButtonDropdown addonType="append" isOpen={this.state.toggles[i]} toggle={() => {
                                        const { toggles } = this.state;
                                        toggles[i] = !toggles[i];
                                        this.setState({
                                          toggles,
                                          hoverAct: {}
                                        });
                                      }}>
                                        <DropdownToggle color="info" caret>
                                          Sumber Eksternal
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          {this._getSources(form.name).map((s, i) => (
                                            <DropdownItem onMouseEnter={() => {
                                              this.setState({
                                                hoverAct: s.mapping
                                              });
                                            }} onMouseLeave={() => this.setState({ hoverAct: {} })} onClick={() => this._fetchSource(s)} key={i}>(#{i + 1}) {s.api.name}</DropdownItem>
                                          ))}
                                        </DropdownMenu>
                                      </InputGroupButtonDropdown>
                                    </InputGroup>
                                  ) : (
                                    <Input valid={this.state.hoverAct[form.name] ? true : false} accept="image/*" onChange={this._onChangeInput.bind(this)} name={form.name} type={form.type} placeholder={form.name} value={this.state.formData[form.name]} />
                                  )}
                                </div>
                              )}
                            </FormGroup>
                          ))
                        }
                      </Col>
                    </Row>
                  </CardBody>
                  <CardFooter>
                    <div className="form-actions">
                      <Button disabled={!this.state.queue_id} type="submit" color="primary">Simpan</Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Col>
          </Row>
          {this.state.modalResult && <ApiResult
            open={this.state.modalResult}
            result={this.state.result}
            source={this.state.source}
            setData={this._setData.bind(this)}
            onClose={() => {
              this.setState({
                modalResult: false
              })
            }}
          />}
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
