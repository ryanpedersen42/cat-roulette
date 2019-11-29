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
      petHash: "QmeYUtP4yoAMbnXnLyGssUScMHWCpBiYYPN83jdRfn312k",
      contract: null,
      web3: null,
      ethAddress: '',
      box: null,
      userProfile: null,
      dappSpace: '',
      imageDescription: '',
      ipfsPosts: []
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
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

    //looking for 15 characters

    try {
      // const testThis = await dappSpace.public.get('11/21/2019')
      const testThis = await dappSpace.public.all()
      // console.log(testThis)
      
      // for (let value of Object.values(testThis)) {
      //   console.log(Array.isArray(JSON.parse(value)))
      //   // console.log('new one', value); // John, then 30
      // }
      const date = moment().subtract(10, 'days').calendar().toString()
      console.log(isString(date))
      console.log(date)

      Object.keys(testThis).forEach(function (values) {
        let returnArray = []

        // console.log(values); // key
        console.log(testThis[values]); // value

        console.log(Array.isArray(testThis[values]))
        // console.log(testThis[values]); // value
      });

      for (let key of Object.keys(testThis)) {
        console.log('length', key.length)

        console.log('new key', key); // John, then 30
      }
      // console.log(testThis[1])
      // console.log(JSON.parse(testThis[1]))
    } catch(err) {
      console.error(err)
    }
  }

  descriptionHandler = (event) => {
    //adjust timing here
    this.setState({ imageDescription: event.target.value})
    console.log(this.state.imageDescription)
  }

  
  getFrom3Box = async () => {
    const { dappSpace } = this.state;
    
    try {
      const testThis = await dappSpace.public.get('11/27/2019')
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
        console.error(error)
        return
      }
    })
  }

  onSubmit = async (event) => {
    event.preventDefault()

    try {
      await this.addToIPFS()
      await this.addTo3Box()
    } catch(err) {
      console.error(err)
    }
  }

  render() {
    const { ethAddress, box, dappSpace, petHash } = this.state;
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
          orientation='left' /> 
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
                <button onClick={this.getFrom3Box}>get single post 3box</button>
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