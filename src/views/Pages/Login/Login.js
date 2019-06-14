import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert } from 'reactstrap';
import helper from "../../../services/helper";
import Loadable from "react-loading-overlay";


class Login extends Component {

  state = {
    msg: {
      error: ""
    },
    ready: false,
    models: null
  }

  componentWillMount() {
    this.props.authProvider.get().then((user) => {
      this.props.history.replace('/dashboard');
    }).catch((err) => {
      this.setState({ ready: true });
    });
  }

  _onSubmit(e) {
    e.preventDefault();
    const formData = helper.inspect(new FormData(e.target));
    console.log(formData);
    this.props.authProvider.set(formData).then((res) => {
      this.props.history.replace('/dashboard');
    }).catch((err) => {
      this.setState({ msg: { error: err.response.data.errors.map((e) => e.msg).join('\n')}});
    });
  }

  render() {
    return (
      (this.state.ready) ?
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <CardGroup>
                  <Card className="p-4">
                    <CardBody>
                      <h1>Login</h1>
                      <p className="text-muted">Masuk menggunakan akun yang terdaftar</p>
                      <form onSubmit={this._onSubmit.bind(this)}>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="username" placeholder="Username" required />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" name="password" placeholder="Password" required />
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button color="primary" className="px-4">Login</Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">Lupa password?</Button>
                          </Col>
                        </Row>
                      </form>
                      <hr />
                      <Alert color="danger" hidden={!this.state.msg.error} >
                        {this.state.msg.error}
                      </Alert>
                    </CardBody>
                  </Card>
                  <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                    <CardBody className="text-center">
                      <div>
                        <h2>Control Tracking System</h2><hr />
                        <img alt="Logo Kota Manado" className="manado-logo" src={require("../../../images/manado.png")} /><hr />
                        <p>Aplikasi kontrol dokumen pengurusan untuk Dinas Kependudukan dan Pencatatan Sipil Kota Manado</p>
                      </div>
                    </CardBody>
                  </Card>
                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div> :
        <Loadable
            spinnerSize="100px"
            className="loading-full"
            active={true}
            spinner
            color="#000000"
            text="Memuat data.." />
    );
  }
}

export default Login;
