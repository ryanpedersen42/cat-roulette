import React, { useState } from 'react';
import ipfs from '../../ipfs';

const MainPage = (props) => {
  const [buffer, setBuffer] = useState(null);
  const [petHash, setPetHash] = useState('');

  const captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setBuffer(Buffer(reader.result))
    }
  }

  const onSubmit = (event) => {
    event.preventDefault()
    ipfs.add(buffer, (error, result) => {
      const petHash = result[0].hash
      setPetHash(petHash);

      if(error) {
        console.error(error)
        return
      }
      // this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
      //   return setPetHash(result[0].hash)
      // })
    })
  }

  return (
    <div>
      <form onSubmit={this.onSubmit} >
        <input type='file' onChange={this.captureFile} />
        <input type='submit' />
      </form>
    </div>
  )
}

export default MainPage;