import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Badge, Card, CardBody, CardHeader, Col, Table, Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Loadable from "react-loading-overlay";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from 'moment';
import NextPopup from '../../components/NextPopup';
import "bootstrap-daterangepicker/daterangepicker.css";
import DetailPopup from '../../components/DetailPopup';

export default class Diproses extends React.Component {

  state = {
    ready: false,
    purposes: [],
    selected_purpose: '',
    registrations: [],
    formInput: null,
    formData: [],
    limit: 10,
    offset: 0,
    total_page: 0,
    page: 1,
    openNext: false,
    selected_registration: null,
    openDetail: false,
    filters: {
      nik: '',
      name: '',
      form: {}
    },
    me: false,
    startDate: moment(new Date()).format(moment.HTML5_FMT.DATE),
    endDate: moment(new Date()).format(moment.HTML5_FMT.DATE),
  }

  componentWillMount() {
    this._init();
  }

  _init() {
    this.props.models.Purpose.collection({
      attributes: ['id', 'name', 'form'],
      order: [['name', 'asc']]
    }).then((data) => {
      this.setState({
        ready: true,
        purposes: data.rows
      });
    }).catch(this.props._apiReject);
  }

  // _onSearch(e) {
  //     this.setState({ searchValue: e.target.value }, () => {
  //         this._initialize();
  //     });
  // }

  _setPage(page) {
    this.setState({ page, offset: (page - 1) * this.state.limit }, () => {
      this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id);
    });
  }

  // _openNext(id_pendaftaran) {
  //     this.setState({ selectedNext: id_pendaftaran, modalNext: true });
  // }

  // _openDetail(id_pendaftaran) {
  //     this.setState({ selectedDetail: id_pendaftaran, modalDetail: true });
  // }

  // _handleDateRange(e, selectionRange) {
  //     this.setState({
  //         startDate: selectionRange.startDate.format(moment.HTML5_FMT.DATE),
  //         endDate: selectionRange.endDate.format(moment.HTML5_FMT.DATE)
  //     }, this._initialize.bind(this));
  //     console.log(selectionRange.startDate.format(moment.HTML5_FMT.DATE));
  // }

  // _handleEntryChange() {
  //     this.setState({ allEntry: !this.state.allEntry }, () => {
  //         this._initialize();
  //     });
  // }

  // _handleTujuanChange(e) {
  //     this.setState({ selectedTujuan: e.target.value }, () => {
  //         this._initialize();
  //     });
  // }

  _onChangePurpose(e) {
    const { value: idx } = e.target;
    if (idx) {
      const purpose = this.state.purposes[idx];
      const filters = {
        nik: '',
        name: '',
        form: {}
      };
      purpose.form.forEach((f => {
        filters.form[f.name] = '';
      }));
      this.setState({
        filters
      }, () => {
        this._fetchRegistrations(this.state.purposes[idx].id).then(() => {
          this.setState({
            selected_purpose: idx
          });
        }).catch(this.props._apiReject);
      })
    } else {
      this.setState({
        registration: [],
        selected_purpose: '',
        filters: {}
      });
    }
  }

  _fetchRegistrations(purpose_id) {
    const w = this._filterToWhereQuery();
    return this.props.models.Registration.collection({
      attributes: ['id', 'name', 'nik', 'data', 'created_at', 'purpose_id', 'step_id'],
      limit: this.state.limit,
      offset: this.state.offset,
      where: {
        ...w,
        step_id: {
          $ne: null
        },
        user_id: {
          [this.state.me ? '$eq' : '$ne']: this.state.me ? this.props._userdata.id : null
        },
        purpose_id: purpose_id,
        created_at: {
          $between: [this.state.startDate + ' 00:00:00', this.state.endDate + ' 23:59:59']
        }
      },
      include: [{
        model: 'Step',
        attributes: ['id', 'name', 'step', 'description'],
      }, {
        model: 'User',
        attributes: ['id', 'name', 'level']
      }, {
        model: 'Purpose',
        attributes: ['id', 'name', 'form']
      }],
      order: [['created_at', 'desc']]
    }).then((data) => {
      this.setState({
        registrations: data.rows,
        total_page: Math.ceil(data.count / this.state.limit),
      });
    });
  }

  _filterToWhereQuery() {
    const { filters } = this.state;
    const where = {
      nik: {},
      name: {},
      data: {}
    };
    where.nik.$iLike = `%${filters.nik}%`;
    where.name.$iLike = `%${filters.name}%`;

    Object.keys(filters.form).forEach((f) => {
      where.data[f] = {};
      where.data[f].$iLike = `%${filters.form[f]}%`;
    });
    return where;
  }

  _onChangeFilter(e) {
    const { name, value } = e.target;
    const { filters } = this.state;
    if (name === 'nik' || name === 'name') {
      filters[name] = value;
    } else {
      filters.form[name] = value;
    }
    this.setState({
      filters
    });
  }

  _handleDateRange(e, selectionRange) {
    this.setState({
      startDate: selectionRange.startDate.format(moment.HTML5_FMT.DATE),
      endDate: selectionRange.endDate.format(moment.HTML5_FMT.DATE)
    }, () => {
      console.log(this.state);
      this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id);
    });
  }

  render() {
    const selected_purpose = this.state.purposes[this.state.selected_purpose];
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
                  <i className="fa fa-align-justify"></i> Daftar pendaftaran dalam proses
                            </CardHeader>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <Button type="button" color="primary"><i className="fa fa-search"></i> Search</Button>
                    </InputGroupAddon>
                    {/* <Input type="text" value={this.state.searchValue} onChange={this._onSearch.bind(this)} id="input1-group2" name="input1-group2" placeholder="Nama atau NIK pendaftar.." /> */}
                    <Input type="select" onChange={this._onChangePurpose.bind(this)} value={this.state.selected_purpose}>
                      <option value="">Pilih Tujuan</option>
                      {this.state.purposes.map((p, i) => (
                        <option key={i} value={i}>{p.name}</option>
                      ))}
                    </Input>
                  </InputGroup>
                  <hr />
                  {
                    selected_purpose && (
                      <div>
                        <h5><i className="fa fa-filter"></i> Filter</h5>
                        <div className="ctrl-table">
                          <div className="ctrl-table-item">
                            <span className="ctrl-table-label">Jangka waktu</span>
                            <div>
                              <DateRangePicker onApply={this._handleDateRange.bind(this)}>
                                <button className="btn btn-outline-success"><i className="fa fa-calendar"></i> {this.state.startDate} s/d {this.state.endDate}</button>
                              </DateRangePicker>
                            </div>
                          </div>
                          {
                            selected_purpose.form.map(({ name, type }, i) => (
                              <div className="ctrl-table-item" key={i}>
                                <Input placeholder={name} type={type} value={this.state.filters.form[name]} name={name} onChange={this._onChangeFilter.bind(this)} />
                              </div>
                            ))
                          }
                          <div className="ctrl-table-item">
                            <Input placeholder="NIK Pemohon" type="number" value={this.state.filters.nik} name="nik" onChange={this._onChangeFilter.bind(this)} />
                          </div>
                          <div className="ctrl-table-item">
                            <Input placeholder="Nama Pemohon" value={this.state.filters.name} name="name" onChange={this._onChangeFilter.bind(this)} />
                          </div>
                        </div>
                        <div className="">
                          <Button color="success" onClick={() => this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id)}>Terapkan</Button>{' '}
                          <Button color="warning" onClick={() => {
                            this.setState({
                              filters: {
                                nik: '',
                                name: '',
                                form: {}
                              }
                            }, () => {
                              this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id)
                            })
                          }}>Reset</Button>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <input defaultChecked={this.state.me} id="me" type="checkbox" onClick={(e) => {
                            this.setState({
                              me: e.target.checked
                            }, () => {
                              this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id)
                            });
                          }} />{' '}
                          <label htmlFor="me">Inbox</label>
                        </div>
                        <br />
                        <Table responsive striped>
                          <thead>
                            <tr>
                              <th>#</th>
                              {
                                selected_purpose.form.map(({ name }, i) => (
                                  <th key={i}>{name.toUpperCase()}</th>
                                ))
                              }
                              <th>NAMA PEMOHON</th>
                              <th>NIK PEMOHON</th>
                              <th>PENGURUS SAAT INI</th>
                              <th>STEP SAAT INI</th>
                              <th>PILIHAN</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.registrations.map((t, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  {
                                    selected_purpose.form.map(({ name }, j) => (
                                      <td key={j}>{t.data[name]}</td>
                                    ))
                                  }
                                  <td>{t.name.toUpperCase()}</td>
                                  <td>{t.nik}</td>
                                  <td>{t.user.name}</td>
                                  <td><Badge color="success">{t.step.name}</Badge></td>
                                  <td>
                                    <button onClick={() => {
                                      this.setState({
                                        openDetail: true,
                                        selected_registration: this.state.registrations[i]
                                      })
                                    }} type="button" className="btn btn-outline-primary">
                                      <i className="fa fa-eye"></i>&nbsp;Detail
                                                                </button>{' '}
                                    <button disabled={this.props._userdata.id !== t.user.id} onClick={() => {
                                      this.setState({
                                        openNext: true,
                                        selected_registration: this.state.registrations[i]
                                      })
                                    }} type="button" className="btn btn-outline-success">
                                      <i className="fa fa-mail-forward"></i>&nbsp;Proses
                                                                </button>
                                  </td>
                                </tr>
                              ))
                            }
                          </tbody>
                        </Table>
                      </div>
                    )
                  }
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
          {this.state.openNext && <NextPopup
            {...this.props}
            onSuccess={() => {
              this.setState({ openNext: false });
              this._fetchRegistrations(this.state.purposes[this.state.selected_purpose].id);
            }}
            onCancel={() => this.setState({ openNext: false })}
            registration={this.state.selected_registration}
          />}
          {this.state.openDetail && <DetailPopup
            {...this.props}
            onCancel={() => this.setState({ openDetail: false })}
            registration={this.state.selected_registration}
          />}
        </div > :
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
