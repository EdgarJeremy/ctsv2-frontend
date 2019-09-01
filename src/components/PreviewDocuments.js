import React, { Component } from 'react';
import { Modal, ModalBody, Card, CardImg, CardBody, ModalHeader } from 'reactstrap';

export default class PreviewDocuments extends Component {
  state = {
    open: false,
    preview: false,
    img: '',
    documents : [],
    name : '',
    loading : false
  }

  getDocuments = () => {
    const { models : {Queue}, id } = this.props;
    this.setState({ loading : true })
    Queue.single(id, {
      include : [{
        model : 'Document',
        attributes: ['name', 'id', 'data']
      }],
      attributes : ['id', 'name']
    }).then(({ name, documents }) => this.setState({ name, documents, loading : false })).catch(e => console.log(e))
  }

  open = () => this.setState({ open: true }, this.getDocuments);
  close = () => this.setState({ open: false });
  preview = img => this.setState({ img, preview: true });

  render() {
    return (
      <Modal size="lg" modalClassName="modal-preview" toggle={this.close} isOpen={this.state.open}>
        <ModalHeader className={this.state.loading ? "bg-white text-dark" : "bg-primary text-white"} toggle={this.close} >{this.state.loading ? 'Loading...' : `Lihat dokumen ${this.state.name}`}</ModalHeader>
        <ModalBody>
          {!this.state.loading && this.state.documents.length === 0 &&
            <Card color="info">
              <CardBody className="text-center text-white">Tidak ada dokumen yang di-upload</CardBody>
            </Card>
          }
          <div className="row">
            {!this.state.loading && this.state.documents.map(doc => (<Doc preview={this.preview} {...doc} key={doc.id} />))}
          </div>
          {/* {
            this.state.loading  &&
            <Card className="border-0 shadow">
              <CardBody><Spinner color="success" size="sm"></Spinner>&nbsp;Loading</CardBody>
            </Card>
          } */}
          <Modal size="lg" toggle={() => this.setState({ preview: false, img: '' })} isOpen={this.state.preview}>
            <ModalBody className="p-0 overflow-hidden">
              <img src={this.state.img} alt="" className="w-100" />
            </ModalBody>
          </Modal>
        </ModalBody>
      </Modal>
    )
  }
}

const Doc = props => (
  <div className="col-md-6 my-2">
    <Card>
      <CardImg onClick={() => props.preview(props.data)} top src={props.data} />
      <CardBody>
        {props.name}
      </CardBody>
      {/* <CardFooter>
        <Button size="sm" color="success"><FaPrint /></Button>
      </CardFooter> */}
    </Card>
  </div>
)
