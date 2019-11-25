import React, { Component } from 'react';
import ProfileHover from 'profile-hover';
import Web3 from 'web3';

import './App.css';
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
      dappSpace: ''
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    // await this.loadBlockchainData()
  }
  
  // async loadBlockchainData() {
  //   const web3 = window.web3
  //   const accounts = await web3.eth.getAccounts()
  //   this.setState({ account: accounts[0] })
  //   const networkId = await web3.eth.net.getId()
  //   const networkData = Pet.networks[networkId]
  //   if(networkData) {
  //     const contract = web3.eth.Contract(Pet.abi, networkData.address)
  //     this.setState({ contract })
  //     const petHash = await contract.methods.get().call()
  //     this.setState({ petHash })

  //   } else {
  //     window.alert('contract not deployed to detected network')
  //   }
  // }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
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

  auth3Box = async () => {
    // web3 actions to authenticate with metamask or other provider
    const ethAddresses = await window.ethereum.enable();
    const ethAddress = ethAddresses[0];
    // authenticate and get profile data
    const box = await Box.openBox(ethAddress, window.ethereum, {});
    await console.log(box)
    // promise resolution.. waiting from 3Box onSyncDone confirmation
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    //open s3cretkeep3r space
    const dappSpace = await box.openSpace('catSpace');

    // set all to state and continue
    await this.setState({ box, dappSpace, ethAddress });
  }

  addTo3Box = async () => {
    const { ethAddress, dappSpace, petHash } = this.state;

    const toJsonExample = [
      {
        poster: 'some name',
        ethAddress: ethAddress,
        image: petHash,
        imageDecription: 'my little woofer',
        location: '3box location from profile'
      }
    ]

    try {
      await dappSpace.public.set('11/21/2019', JSON.stringify(toJsonExample));
    } catch(err) {
      console.log(err);
    }
    
  }

  getFrom3Box = async () => {
    const { ethAddress, dappSpace, petHash } = this.state;

    try {
      const testThis = await dappSpace.public.get('11/21/2019')
      console.log(JSON.parse(testThis))
    } catch(err) {
      console.error(err)
    }
  }

  onSubmit = (event) => {
    event.preventDefault()
    ipfs.add(this.state.buffer, (error, result) => {
      const petHash = result[0].hash
      this.setState({ petHash })
      if(error) {
        console.error(error)
        return
      }
      this.state.contract.methods.set(result[0].hash).send({ from: this.state.account }).then((r) => {
        return this.setState({ petHash: result[0].hash })
      })
    })
  }

  render() {
    const { ethAddress, box } = this.state;
    return (
      <div>
      
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        {box && <> </>}
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            target="_blank"
            rel="noopener noreferrer"
          >
           Cat Roulette
          </a>
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
                <p>&nbsp;</p>
                <h2>New Pic</h2>
                <form onSubmit={this.onSubmit} >
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit' />
                </form>
                <button onClick={this.addTo3Box}>try this</button>
                <button onClick={this.getFrom3Box}>get from 3box</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
