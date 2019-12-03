import React, { Component } from 'react';
import Web3 from 'web3';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import { connect } from 'react-redux';
import MainPage from './pages/main-page/main-page';
import AuthPage from './pages/auth-page/auth-page';

import { setCurrentPetHash } from './redux/posts/posts.actions';
import { selectCurrentPetHash } from './redux/posts/posts.selectors';
import './App.css';

const Box = require('3box')
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) 

const mapDispatchToProps = dispatch => ({
  setCurrentPetHash: user => dispatch(setCurrentPetHash(user))
});

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
})

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      buffer: null,
      account: null,
      petHash: '',
      contract: null,
      web3: null,
      adminEthAddress: '0x55c4eb985536f74f354dbaf7dd2d8891e9373504',
      ethAddress: '',
      currentResult: {},
      box: null,
      userProfile: null,
      dappSpace: '',
      imageDescription: '',
      ipfsPosts: [],
      isAppReady: false,
    }
  }

  async componentWillMount() {
    try {
      await this.loadWeb3()
      await this.auth3Box()
      await this.fetchPosts()
      await this.newImageHandler()
    } catch(err) {
      console.error(err)
    }
  }

  async componentDidMount() {
    const { box } = this.state;
    const { history } = this.props;

    // if you haven't openedBox, return to login
    if (!box) history.push('/');
    this.setState({ isAppReady: true });
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

  newImageHandler = async () => {
    const { setCurrentPetHash, history } = this.props;

    const { ipfsPosts, dappSpace } = this.state;
  
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const randomKeyNumber = getRandomInt(0, ipfsPosts.length - 1)
    
    try {
      const testThis = await dappSpace.public.get(ipfsPosts[randomKeyNumber])
      const parsedResult = JSON.parse(testThis)
      const currentResult = parsedResult[0]
      await this.setState({ currentResult, petHash: currentResult.petHash })
      await setCurrentPetHash(currentResult.petHash)

      //workaround to get the component to reload
      history.push('/')
      history.push('/main')
    } catch(err) {
      console.error(err)
    }
  }

  auth3Box = async () => {
    const ethAddresses = await window.ethereum.enable();
    const ethAddress = ethAddresses[0];

    const box = await Box.openBox(ethAddress, window.ethereum, {});
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const dappSpace = await box.openSpace('catSpace');
    const userProfile = await Box.getProfile(ethAddress)

    await this.setState({ box, dappSpace, ethAddress, userProfile });
    // history.push(`/${this.props.currentPetHash}`)

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
      const dappSpaceData = await dappSpace.public.all()
      let ipfsKeyArray = []
      Object.keys(dappSpaceData).forEach(function (values) {
        if (values.length === 15) {
          ipfsKeyArray.push(values)
        }
      });
      this.setState({ ipfsPosts: ipfsKeyArray})
    } catch(err) {
      console.error(err)
    }
  }

  descriptionHandler = (event) => {
    this.setState({ imageDescription: event.target.value})
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
    this.addToIPFS()
    this.addTo3Box()
    this.setState({ buffer: null, imageDecription: ''})
  }

  render() {
    const { ethAddress, box, dappSpace, adminEthAddress, isAppReady } = this.state;
    return (

      <div className="App">
        {isAppReady && (<React.Fragment>
          <Switch>
            <Route
              exact
              path='/'
              render={() => <AuthPage 
                auth3box={this.auth3Box}
                box={box}
               />}
            />
            <Route
              exact
              path='/main'
              render={() => (
                <MainPage
                  ethAddress={ethAddress}
                  petHash={this.props.currentPetHash}
                  adminEthAddress={adminEthAddress}
                  spaceName={dappSpace._name}
                  box={box}
                  myAddress={ethAddress}

                  newImageHandler={this.newImageHandler}
                />
              )}
            />
          </Switch>
        </React.Fragment>)}
      </div>

    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));