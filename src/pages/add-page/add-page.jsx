import React, { Component } from 'react';
import CustomButton from '../../components/custom-button/custom-button';
import moment from 'moment';

const Box = require('3box')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

import './add-page.styles.scss';

class AddPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageDecription: '',
      buffer: null,
      petHash: null,
      ethAddress: '',
      dappSpace: '',
    }
  }

  descriptionHandler = (event) => {
    this.setState({ imageDescription: event.target.value})
  }

  captureFile = (event) => {
    event.preventDefault()
    //process file for IPFS
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result)})
    }
  }
  addTo3Box = async () => {
    const { ethAddress, dappSpace, petHash, imageDescription } = this.state;
    const date = moment().subtract(10, 'days').calendar().toString()
    const randomString = Math.random().toString(36).substring(2, 6)
    const key = `${date}_${randomString}`

    const imageInfo = [
      {
        ethAddress: ethAddress,
        petHash: petHash,
        imageDecription: imageDescription,
      }
    ]

    try {   
      await dappSpace.public.set(key, JSON.stringify(imageInfo));
    } catch(err) {
      console.log(err);
    }
  }

  addToIPFS = () => {
    ipfs.add(this.state.buffer, (error, result) => {
      const petHash = result[0].hash
      this.setState({ petHash })
      if(error) {
        console.log(error)
        return
      }
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.addToIPFS()
    this.addTo3Box()
    this.setState({ buffer: null, imageDecription: ''})
  }

  render() {
    return (
      <div className='add-page'>

      </div>
    )
  }
}

export default AddPage;