import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from 'moment';

export default class ReportPopup extends React.Component {
  state = {
    ready: false,
    start: moment(new Date()).format(moment.HTML5_FMT.DATE),
    end: moment(new Date()).format(moment.HTML5_FMT.DATE),
    rekap: []
  }

  componentDidMount() {
    this._initialize();
  }

  _initialize() {
    const { start, end } = this.state;
    this.props.models.Track.$http('tracks/report', 'GET', {
      params: { start, end, purpose_id: this.props.purpose ? this.props.purpose.id : '' }
    }).then(({ data }) => {
      this.setState({
        ready: true,
        rekap: data
      });
    }).catch(this.props._apiReject);
  }

  _handleDateRange(e, selectionRange) {
    this.setState({
      start: selectionRange.startDate.format(moment.HTML5_FMT.DATE),
      end: selectionRange.endDate.format(moment.HTML5_FMT.DATE)
    }, this._initialize.bind(this));
  }

  render() {
    return this.state.ready && (
      <Modal isOpen={true} className="modal-default">
        <ModalHeader>
          Rekapitulasi ({this.props.purpose ? this.props.purpose.name : 'Semua'}) : &nbsp;&nbsp;
                    <DateRangePicker onApply={this._handleDateRange.bind(this)}>
            <button className="btn btn-outline-primary"><i className="fa fa-angle-down"></i> {this.state.start} s/d {this.state.end}</button>
          </DateRangePicker>
        </ModalHeader>
        <ModalBody>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Pengurus</th>
                <th>Jumlah Dokumen Diurus</th>
              </tr>
            </thead>
            <tbody>
              {this.state.rekap.map((r, k) => (
                <tr key={k}>
                  <td>{r.name}</td>
                  <td>{r.total} dokumen</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-outline-warning" onClick={this.props.onCancel}><i className="fa fa-close"></i> Tutup</button>
        </ModalFooter>
      </Modal>
    )
  }
}
