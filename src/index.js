import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Input, Card, CardTitle, CardBody, Button } from 'reactstrap';

function A() {
  const integrated_source = localStorage.getItem('integrated_source');
  const [is, setIs] = useState('');

  return (
    integrated_source ? <App /> : (
      <div style={{ maxWidth: '500px', margin: '100px auto' }}>
        <Card>
          <CardBody>
            <CardTitle>Pilih Sumber Data</CardTitle>
            <Input type="select" onChange={(e) => {
              setIs(e.target.value);
              // console.log(e.target.value);
            }}>
              <option></option>
              <option value="http://antriancapil.manadokota.go.id">AntrianCapil</option>
              <option value="http://paarsel.manadokota.go.id">PAARSEL</option>
            </Input><br />
            <Button onClick={() => {
              localStorage.setItem('integrated_source', is);
              window.location.reload();
            }} block>SUBMIT</Button>
          </CardBody>
        </Card>
      </div>
    )
  )
}

ReactDOM.render(<A />, document.getElementById('root'));
registerServiceWorker();
