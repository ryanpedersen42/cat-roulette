import React, { Component } from 'react';
// import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ReactLoading from "react-loading";

import { selectCurrentUserData } from '../../redux/user/user.selectors';
import { selectCurrentPosts } from '../../redux/posts/posts.selectors';
import { toggleAddImage, startLoading, endLoading } from '../../redux/ui/ui.actions';

import './add-image-modal.styles.scss';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
  posts: selectCurrentPosts,
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
      errorMessage: false,
      posting: false
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
    const dappSpace = user.dappSpace;
    // const date = moment().subtract(10, 'days').calendar().toString()
    // const randomString = Math.random().toString(36).substring(2, 6)
    // const key = `${date}_${randomString}`

    // const imageInfo = [
    //   {
    //     petHash: petHash,
    //     imageDescription: imageDescription,
    //   }
    // ]

    try { 
      await dappSpace.public.set(petHash, imageDescription);
    } catch(err) {
      console.err(err);
    }
  }

  showAlert = () => {
    this.setState({ errorMessage: true})
  
    setTimeout(() => {
      this.setState({ errorMessage: false });
    }, 1000);
  }

  onSubmit = (event) => {
    const { toggleAddImage, user, posts } = this.props;
    const { imageDescription, buffer } = this.state;
    event.preventDefault()

    const contract = posts.contract;

    if (!buffer || imageDescription.length < 1) {
      this.showAlert()
      return 
    }

    this.setState({ posting: true})
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
      contract.methods.addPetHash(result[0].hash).send({ from: user.ethAddress }).then((r) => {
        console.log('response', r)
      })
      this.setState({ posting: false})
      toggleAddImage()
    })
  }

render() {
  const { toggleAddImage } = this.props;
  const { posting } = this.state;

  return (
    <div className='image-modal'>
    {
      posting ?  
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