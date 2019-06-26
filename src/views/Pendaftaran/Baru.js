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
  Input
} from "reactstrap";
import Loadable from "react-loading-overlay";
import swal from 'sweetalert';

export default class Baru extends React.Component {

  state = {
    purposes: null,
    selected_purpose: '',
    name: '',
    nik: '',
    formData: {},
    ready: false
  }

  componentWillMount() {
    this._init();
  }

  _init() {
    this.props.models.Purpose.collection({
      attributes: ['id', 'name', 'form'],
      include: [{ model: 'Step' }]
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
          formData: formData
        });
      })
    } else {
      this.setState({
        selected_purpose: '',
        formData: {}
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
      purpose_id: this.state.selected_purpose.id
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
        });
      }).catch(this.props._apiReject);
  }

  render() {
    return (
      (this.state.ready) ?
        <div className="animated fadeIn">
          <Row>
            <Col xs="12" sm="12">
              <form ref={(e) => this._main_form = e} onSubmit={this._onSave.bind(this)}>
                <Card>
                  <CardHeader>
                    <strong>Formulir Pendaftaran</strong>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12">
                        <FormGroup>
                          <Label><b>NIK Pendaftar</b></Label>
                          <Input onChange={(e) => this.setState({ nik: e.target.value })} value={this.state.nik} placeholder="NIK Pendaftar" required />
                        </FormGroup>
                        <FormGroup>
                          <Label><b>Nama Pendaftar</b></Label>
                          <Input onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} placeholder="Nama Pendaftar" required />
                        </FormGroup>
                        <FormGroup>
                          <Label><b>Tujuan</b></Label>
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
                                    <Label for={form.name}><b>{form.name}</b></Label>
                                    <Input accept="image/*" onChange={this._onChangeInput.bind(this)} name={form.name} type={form.type} placeholder={form.name} value={this.state.formData[form.name]} />
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
                      <Button type="submit" color="primary">Simpan</Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
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
