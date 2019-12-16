import React, { Component } from 'react';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';

import { selectCurrentUI } from '../../redux/ui/ui.selectors';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import { toggleAddImage } from '../../redux/ui/ui.actions';

import './add-image-modal.styles.scss';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
  ui: selectCurrentUI
})

const mapDispatchToProps = dispatch => ({
  toggleAddImage: () => dispatch(toggleAddImage())
});

class AddImageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageDescription: '',
      buffer: null,
      petHash: null,
      ethAddress: '',
      loadingOverlay: false,
    }
  }

  descriptionHandler = (event) => {
    this.setState({ imageDescription: event.target.value })
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
    const { user } = this.props;
    const myDappSpace = user.testDappSpace
    const date = moment().subtract(10, 'days').calendar().toString()
    const randomString = Math.random().toString(36).substring(2, 6)
    const key = `${date}_${randomString}`

    const imageInfo = [
      {
        ethAddress: user.ethAddress,
        petHash: petHash,
        imageDescription: imageDescription,
      }
    ]

    try { 
      await myDappSpace.public.set(key, JSON.stringify(imageInfo));
    } catch(err) {
      console.log(err);
    }
  }

  toggleLoadingOverlay = () => {
    const { loadingOverlay } = this.state;
    this.setState({ loadingOverlay: !loadingOverlay})
  }

  setPetHash = async (hash) => {
    await this.setState({ petHash: hash})
  }

  addToIPFS = async () => {
    await ipfs.add(this.state.buffer, (error, result) => {
      const petHash = result[0].hash
      this.setPetHash(petHash)

      if(error) {
        console.log(error)
        return
      }
    })
  }

  onSubmit = (event) => {
    const { toggleAddImage } = this.props;
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      const petHash = result[0].hash
      this.setState({ petHash })
      if(error) {
        console.error(error)
        return
      }
      this.addTo3Box()
      this.setState({ buffer: null, imageDecription: ''})
      toggleAddImage()
    })
  }

render() {
  const { toggleAddImage } = this.props;

  return (
    <LoadingOverlay
      active={this.state.loadingOverlay}
      spinner
      text='Loading your content...'
    >
    <div className='image-modal'>
      <div className='modal-close' onClick={toggleAddImage}>&times;</div>
      <h1>Add a new pic</h1>
      <form onSubmit={this.onSubmit} className='image-form' >
        <input className='form-field' type='file' onChange={this.captureFile} />
        <input 
         type='text'
         className='form-input' 
         onChange={this.descriptionHandler} 
         placeholder='Image description' 
         />
        <input className='custom-button' type='submit' />
      </form>
    </div>
    </LoadingOverlay>
  )
}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddImageModal);