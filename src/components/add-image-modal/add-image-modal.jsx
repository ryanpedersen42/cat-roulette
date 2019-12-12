import React, { Component } from 'react';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import CustomButton from '../custom-button/custom-button';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './add-image-modal.styles.scss';

const Box = require('3box')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 


const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

class AddImageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageDecription: '',
      buffer: null,
      petHash: null,
      ethAddress: '',
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
    const { petHash, imageDescription } = this.state;
    const { dappSpace, ethAddress } = this.props;
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
  const { toggleImageModal, modalVisible } = this.props;

  if(!modalVisible) {
    return null
  }
  return (
  <div className='image-modal' onClick={toggleImageModal}>
      <h1>Add a new pic</h1>
      <form onSubmit={this.onSubmit} className='image-form' >
        <input className='form-field' type='file' onChange={this.captureFile} />
        <input className='custom-button' type='submit' />
      </form>
    </div>
  )
}
}

export default connect(mapStateToProps)(AddImageModal);