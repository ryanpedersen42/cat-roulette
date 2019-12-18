import React, { Component } from 'react';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ReactLoading from "react-loading";

import { selectCurrentUI } from '../../redux/ui/ui.selectors';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import { toggleAddImage, startLoading, endLoading } from '../../redux/ui/ui.actions';

import './add-image-modal.styles.scss';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
  ui: selectCurrentUI
})

const mapDispatchToProps = dispatch => ({
  toggleAddImage: () => dispatch(toggleAddImage()),
  startLoading: () => dispatch(startLoading()),
  endLoading: () => dispatch(endLoading())
});

class AddImageModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageDescription: '',
      buffer: null,
      petHash: null,
      errorMessage: false
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
    const myDappSpace = user.dappSpace;
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

  showAlert = () => {
    this.setState({ errorMessage: true})
  
    setTimeout(() => {
      this.setState({ errorMessage: false });
    }, 1000);
  }

  onSubmit = (event) => {
    const { toggleAddImage, startLoading, endLoading } = this.props;
    const { imageDescription, buffer } = this.state;
    event.preventDefault()

    if (!buffer || imageDescription.length < 1) {
      this.showAlert()
      return 
    }

    startLoading()
    //add to IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      const petHash = result[0].hash
      this.setState({ petHash })
      if(error) {
        console.error(error)
        return
      }
      //add to 3Box
      this.addTo3Box()
      this.setState({ buffer: null, imageDecription: ''})
      endLoading()
      toggleAddImage()
    })
  }

render() {
  const { toggleAddImage, ui } = this.props;

  return (
    <div className='image-modal'>
    {
      ui.isLoading ?  
      (     
      <div className='image-form'>
      <h3>Submitting post...</h3>
        <ReactLoading
          type={"bars"}
          color={"black"}
          height={"10%"}
          width={"15%"}
        />
      </div>
      ) : (
      <>
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
        {
          this.state.errorMessage && <p>complete the whole input form please</p>
        }
      </form>
      </>
      )
    }
    </div>
  )
}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddImageModal);