import React, { Component } from 'react';
import ProfileHover from 'profile-hover';
import Web3 from 'web3';
import CommentComponent from './components/comments/comments';
import moment from 'moment';

import './App.css';
import { isString } from 'util';
const Box = require('3box')

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      buffer: null,
      account: null,
      petHash: 'QmeYUtP4yoAMbnXnLyGssUScMHWCpBiYYPN83jdRfn312k',
      contract: null,
      web3: null,
      adminEthAddress: '0x55c4eb985536f74f354dbaf7dd2d8891e9373504',
      ethAddress: '',
      box: null,
      userProfile: null,
      dappSpace: '',
      imageDescription: '',
      ipfsPosts: []
    }
  }

  async componentWillMount() {
    // await this.loadWeb3()
    // await this.auth3Box()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected!')
    }
  }
  
  auth3Box = async () => {
    const ethAddresses = await window.ethereum.enable();
    const ethAddress = ethAddresses[0];

    const box = await Box.openBox(ethAddress, window.ethereum, {});

    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const userProfile = await Box.getProfile(ethAddress)

    const dappSpace = await box.openSpace('catSpace');

    await this.setState({ box, dappSpace, ethAddress, userProfile });
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

  fetchPosts = async () => {
    const { dappSpace } = this.state;

    try {
      const testThis = await dappSpace.public.all()

      let returnArray = []
      Object.keys(testThis).forEach(function (values) {
        if (values.length === 15) {
          returnArray.push(values)
        }
      });
      this.setState({ ipfsPosts: returnArray})
    } catch(err) {
      console.error(err)
    }
    console.log(this.state.ipfsPosts)
  }

  descriptionHandler = (event) => {
    //adjust timing here
    this.setState({ imageDescription: event.target.value})
  }

  consoleTest = () => {
    console.log(this.state.buffer)
  }
  
  getFrom3Box = async () => {
    const { dappSpace } = this.state;
    
    try {
      const testThis = await dappSpace.public.get('11/20/2019_w0ll')
      console.log(JSON.parse(testThis))
    } catch(err) {
      console.error(err)
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
    })

    // try {
    //   await console.log('first')
    //   await this.addToIPFS()
    //   await console.log('second')
    //   await this.addTo3Box()
    // } catch(err) {
    //   console.error(err)
    // }
  }

  render() {
    const { ethAddress, box, dappSpace, petHash, adminEthAddress } = this.state;
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
           Cat Roulette
          </div>
          {
          box 
          ? 
          <ProfileHover address={ethAddress}
          showName
          // orientation='left'
           /> 
          :
          <button onClick={this.auth3Box}>auth 3box</button>
          }
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  <img 
                  src={`https://ipfs.infura.io/ipfs/${this.state.petHash}`} 
                  alt='current'
                  />
                  {box && 
                  <CommentComponent
                    ethAddress={ethAddress}
                    petHash={petHash}
                    adminEthAddress={adminEthAddress}
                    spaceName={dappSpace._name}
                    box={box}
                    myAddress={ethAddress}
                   />
                  }
                <p>&nbsp;</p>
                <h2>New Pic</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
                <button onClick={this.addTo3Box}>try this</button>
                <button onClick={this.fetchPosts}>get from 3box</button>
                <button onClick={this.getFrom3Box}>test buffer</button>
                <input 
                  value={this.state.imageDescription}
                  onChange={this.descriptionHandler} 
                  name="imageDescription"
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;