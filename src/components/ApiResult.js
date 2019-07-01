import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Button } from "reactstrap";

export default class ApiResult extends React.Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Modal isOpen={this.props.open} className="modal-wide">
          <ModalHeader toggle={this.props.toggle}>Hasil</ModalHeader>
          <ModalBody>
            <Table striped responsive>
              <thead>
                <tr>
                  {this.props.source.api.return_values.map((r, i) => (
                    <th key={i}>{r}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.props.result.map((r, i) => (
                  <tr key={i}>
                    {this.props.source.api.return_values.map((v, j) => (
                      <td key={j}>{r[v]}</td>
                    ))}
                    <td><Button onClick={() => {
                      this.props.setData(r);
                    }} color="success"><i className="fa fa-check"></i></Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}
