import React from 'react';
import { Modal, ModalHeader, ModalBody, Table, Input, Button } from 'reactstrap';
import Loadable from "react-loading-overlay";

export default class SourceListPopup extends React.Component {

  state = {
    ready: false,
    apis: [],
    source_list: [],
    selected_api: null,
    new_data: {
      api_id: '',
      reference: '',
      method: '',
      param_name: '',
      mapping: {}
    }
  }

  componentDidMount() {
    this._init();
  }

  _init() {
    this.props.models.Api.collection({
      attributes: ['id', 'name', 'url', 'return_values']
    }).then((data) => {
      this.setState({
        apis: data.rows
      });
    }).then(
      this.props.models.SourceList.collection.bind(this.props.models.SourceList, {
        attributes: ['id', 'reference', 'method', 'param_name', 'mapping'],
        where: {
          purpose_id: this.props.purpose.id,
        },
        include: [{
          model: 'Api',
          attributes: ['name']
        }]
      })
    ).then((data) => {
      this.setState({
        ready: true,
        source_list: data.rows
      });
    }).catch(this.props._apiReject);
  }

  _onChangeApi(e) {
    const { value } = e.target;
    this._getApi(value);
  }

  _getApi(id) {
    if (id) {
      this.props.models.Api.single(id).then((api) => {
        const { new_data } = this.state;
        new_data.api_id = id;
        const fields = this._getMappingFields();
        new_data.mapping = {};
        fields.forEach((f) => {
          new_data.mapping[f.name] = '';
        });
        this.setState({
          new_data,
          selected_api: api
        });
      }).catch(this.props._apiReject);
    } else {
      const { new_data } = this.state;
      new_data.api_id = '';
      new_data.mapping = {};
      this.setState({
        new_data,
      });
    }
  }

  _getMappingFields() {
    return this.props.purpose.form.filter((f, i) => f.name !== this.state.new_data.reference);
  }

  _onAdd() {
    const { new_data } = this.state;
    new_data.purpose_id = this.props.purpose.id;
    this.props.models.SourceList.create(new_data).then((newSource) => {
      this.setState({
        new_data: {
          api_id: '',
          reference: '',
          method: '',
          param_name: '',
          mapping: {}
        }
      }, () => {
        this._init();
      })
    }).catch(this.props._apiReject);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open} size="lg" className="modal-success modal-wide">
          <ModalHeader toggle={this.props.toggle}>Integrasi Sumber</ModalHeader>
          {this.state.ready ? (
            <ModalBody>
              <Table responsive striped>
                <thead>
                  <tr>
                    <th>Referensi</th>
                    <th>Sumber</th>
                    <th>Method</th>
                    <th>Parameter</th>
                    <th>Mapping</th>
                    <th>Pilihan</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.source_list.map((s, i) => (
                    <tr key={i}>
                      <td>{s.reference}</td>
                      <td>{s.api.name}</td>
                      <td>{s.method}</td>
                      <td>{s.param_name}</td>
                      <td>
                        {
                          Object.keys(s.mapping).map((m, i) => (
                            <div key={i}>{m} — {s.mapping[m] ? s.mapping[m] : '(kosong)'}</div>
                          ))
                        }
                      </td>
                      <td>
                        <Button color="danger" block><i className="fa fa-trash"></i></Button>
                      </td>
                    </tr>
                  ))}
                  {/* add new */}
                  <tr className="tr-new-data">
                    <td>
                      <Input type="select" value={this.state.new_data.reference} onChange={(e) => {
                        const { new_data } = this.state;
                        new_data.reference = e.target.value;
                        this.setState({ new_data }, () => {
                          this._getApi(this.state.new_data.api_id);
                        });
                      }}>
                        <option value="">-referensi-</option>
                        {this.props.purpose.form.map((f, i) => (
                          <option key={i} value={f.name}>{f.name}</option>
                        ))}
                      </Input>
                    </td>
                    <td>
                      {this.state.new_data.reference ? (
                        <Input type="select" value={this.state.new_data.api_id} onChange={this._onChangeApi.bind(this)}>
                          <option value="">-sumber-</option>
                          {this.state.apis.map((a, i) => (
                            <option key={i} value={a.id}>{a.name}</option>
                          ))}
                        </Input>
                      ) : (
                          <p>Pilih referensi terlebih dahulu</p>
                        )}
                    </td>
                    <td>
                      <Input type="select" value={this.state.new_data.method} onChange={(e) => {
                        const { new_data } = this.state;
                        new_data.method = e.target.value;
                        this.setState({ new_data });
                      }}>
                        <option value="">-method-</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                      </Input>
                    </td>
                    <td><Input type="text" value={this.state.new_data.param_name} onChange={(e) => {
                      const { new_data } = this.state;
                      new_data.param_name = e.target.value;
                      this.setState({ new_data });
                    }} /></td>
                    <td>
                      {this.state.new_data.reference && this.state.new_data.api_id ? (
                        <table className="mapping-table">
                          <tbody>
                            {Object.keys(this.state.new_data.mapping).map((f, i) => (
                              <tr key={i}>
                                <td><Input value={f} readOnly /></td>
                                <td className="td-exchange"><i className="fa fa-exchange"></i></td>
                                <td>
                                  <Input type="select" value={this.state.new_data.mapping[f]} onChange={(e) => {
                                    const { new_data } = this.state;
                                    new_data.mapping[f] = e.target.value;
                                    this.setState({ new_data });
                                  }}>
                                    <option value="">-kosong-</option>
                                    {this.state.selected_api.return_values.map((r, i) => (
                                      <option value={r} key={i}>{r}</option>
                                    ))}
                                  </Input>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                          <p>Pilih sumber & referensi terlebih dahulu</p>
                        )}
                    </td>
                    <td>
                      <Button onClick={this._onAdd.bind(this)} color="success" block><i className="fa fa-check"></i></Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </ModalBody>
          ) : (
              <Loadable
                spinnerSize="100px"
                style={{ height: 200 }}
                background="#ffffff"
                active={true}
                spinner
                color="#000000"
                text="Menyiapkan.." />
            )}
        </Modal>
      </div>
    )
  }

}
