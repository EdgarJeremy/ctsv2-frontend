import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Table, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Loadable from "react-loading-overlay";
import ApiPopup from '../../components/ApiPopup';
import swal from 'sweetalert';

export default class Api extends React.Component {

  state = {
    ready: false,
    apis: [],
    limit: 10,
    offset: 0,
    total_page: 0,
    page: 1,
    modalTambah: false,
    modalEdit: false,
    selected: null
  }

  componentWillMount() {
    this._init();
  }

  _init() {
    this.props.models.Api.collection({
      attributes: ['id', 'name', 'url', 'return_values'],
      limit: this.state.limit,
      offset: this.state.offset
    }).then((data) => {
      this.setState({
        apis: data.rows,
        total_page: Math.ceil(data.count / this.state.limit),
        ready: true
      });
    }).catch(this.props._apiReject);
  }

  _setPage(page) {
    this.setState({ page, offset: (page - 1) * this.state.limit }, () => {
      this._init();
    });
  }

  _openEdit(api) {
    this.setState({
      modalEdit: true,
      selected: api
    });
  }

  _onDelete(api) {
    swal({
      title: "Anda yakin?",
      text: `Anda akan menghapus sumber dengan nama ${api.name} dari sistem?`,
      buttons: [
        "Tidak",
        "Ya"
      ],
      icon: "warning"
    }).then((isConfirm) => {
      if (isConfirm) {
        api.delete().then(() => {
          swal('Konfirmasi', `Sumber dengan nama ${api.name} berhasil dihapus dari sistem`, 'success').then(this._init.bind(this));
        }).catch((err) => {
          swal('Error', err.messsage, 'error').then(this._init.bind(this));
        });
      }
    });
  }

  render() {
    let links = [];
    for (let i = 0; i < this.state.total_page; i++) {
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
                  <i className="fa fa-align-justify"></i> Daftar sumber eksternal
                            </CardHeader>
                <CardBody>
                  <Button onClick={() => this.setState({ modalTambah: true })} color="success"><i className="icons icon-plus"></i> Tambah</Button>
                  <br /><br />
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>NAMA SUMBER</th>
                        <th>URL</th>
                        <th>FIELD KEMBALIAN</th>
                        <th>PILIHAN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.apis.map((a, i) => (
                        <tr key={i}>
                          <td>{a.name}</td>
                          <td>{a.url}</td>
                          <td>
                            <ul style={{ padding: 0, margin: 0 }}>
                              {
                                a.return_values.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))
                              }
                            </ul>
                          </td>
                          <td>
                            <button onClick={() => this._openEdit(a)} type="button" className="btn btn-outline-info">
                              <i className="fa fa-edit"></i>&nbsp;Edit
                                                                </button>{' '}
                            <button onClick={() => this._onDelete(a)} type="button" className="btn btn-outline-danger">
                              <i className="fa fa-trash"></i>&nbsp;Hapus
                                                                </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  {(this.state.total_page > 1) ?
                    <Pagination>
                      <PaginationItem onClick={(this.state.page === 1) ? undefined : () => this._setPage(this.state.page - 1)} disabled={this.state.page === 1}><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                      {links}
                      <PaginationItem onClick={(this.state.page === this.state.total_page) ? undefined : () => this._setPage(this.state.page + 1)} disabled={this.state.page === this.state.total_page} ><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                    </Pagination>
                    : ""}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ApiPopup
            {...this.props}
            open={this.state.modalTambah}
            toggle={() => this.setState({ modalTambah: !this.state.modalTambah })}
            onSuccess={() => {
              this.setState({ modalTambah: false });
              this._init();
            }}
          />
          <ApiPopup
            {...this.props}
            edit={true}
            open={this.state.modalEdit}
            api={this.state.selected}
            toggle={() => this.setState({ modalEdit: !this.state.modalEdit })}
            onSuccess={() => {
              this.setState({ modalEdit: false });
              this._init();
            }}
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
