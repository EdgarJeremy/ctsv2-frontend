import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import saveAs from 'save-as';

export default class ExportPopup extends React.Component {
  state = {
    selected_fields: []
  };

  _onChooseField(checked, field) {
    const { selected_fields } = this.state;
    if (checked) {
      selected_fields.push(field);
    } else {
      let idx = -1;
      selected_fields.forEach((s, i) => {
        if (s.name === field.name) {
          idx = i;
        }
      });
      selected_fields.splice(idx, 1);
    }
    this.setState({ selected_fields });
  }

  _fetchRegistrations() {
    return this.props.models.Registration.collection({
      attributes: ['id', 'name', 'nik', 'data', 'created_at', 'purpose_id', 'step_id'],
      where: {
        step_id: {
          $ne: null
        },
        user_id: this.props._userdata.id,
        purpose_id: this.props.purpose.id,
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
    })
  }

  _onDownload() {
    const { selected_fields } = this.state;
    this._fetchRegistrations().then((data) => {
      const { count, rows: registrations } = data;
      let content = '';
      registrations.forEach((r) => {
        let line = '';
        selected_fields.forEach((f,i) => {
          line += `${r.data[f.name].trim()}`;
          line += i === selected_fields.length - 1 ? '' : ',';
        });
        line += '\n';
        content += line;
      });
      console.log(content);
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8'});
      saveAs(blob, `Export - ${this.props.purpose.name}.csv`);
    }).catch(this.props._apiReject);
  }

  render() {
    return (
      <Modal isOpen={true} toggle={this.props.onCancel} className="modal-default">
        <ModalHeader toggle={this.props.onCancel}>Export Pendaftaran</ModalHeader>
        <ModalBody>
          <h5>{this.props.purpose.name}</h5>
          <p>Pilih field yang ingin dieksport</p>
          <div>
            {this.props.purpose.form.map((f, i) => (
              <div key={i} style={{ display: 'inline-block', marginRight: 10 }}>
                <input id={f.name} type="checkbox" onClick={(e) => this._onChooseField(e.target.checked, f)} />{' '}
                <label htmlFor={f.name}>{f.name}</label>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button disabled={this.state.selected_fields.length === 0} onClick={this._onDownload.bind(this)} block><i className="fa fa-download"></i> Download</Button>
        </ModalFooter>
      </Modal>
    )
  }
}
