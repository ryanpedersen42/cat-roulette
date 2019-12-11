import React, { Component } from 'react';
import Web3 from 'web3';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { connect } from 'react-redux';
import MainPage from './pages/main-page/main-page';
import AuthPage from './pages/auth-page/auth-page';

import { setCurrentPetHash } from './redux/posts/posts.actions';
import { selectCurrentPetHash } from './redux/posts/posts.selectors';

import { setEthAddress, logUserIn, logUserOut } from './redux/user/user.actions';
import { selectCurrentUserData } from './redux/user/user.selectors';

import './App.css';

const Box = require('3box')

const mapDispatchToProps = dispatch => ({
  setCurrentPetHash: user => dispatch(setCurrentPetHash(user)),
  setEthAddress: user => dispatch(setEthAddress(user)),
  logUserIn: () => dispatch(logUserIn()),
  logUserOut: () => dispatch(logUserOut())
});

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
  user: selectCurrentUserData, 
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

    if (!box) history.push('/');
    this.setState({ isAppReady: true });
  }

  async loadWeb3() {
    const { setEthAddress } = this.props;

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      const ethAddresses = await window.ethereum.enable()
      const ethAddress = ethAddresses[0]
      await setEthAddress(ethAddress)
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

  handleLogout = async () => {
    const { history } = this.props;
    const { box } = this.state;

    await box.logout();
    history.push('/');
  }

  auth3Box = async () => {
    const { user, logUserIn } = this.props;

    const box = await Box.openBox(user.ethAddress, window.ethereum, {});
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const dappSpace = await box.openSpace('catSpace');

    await this.setState({ box, dappSpace });
    await logUserIn()
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
                  adminEthAddress={adminEthAddress}
                  spaceName={dappSpace._name}
                  box={box}
                  myAddress={ethAddress}

                  newImageHandler={this.newImageHandler}
                  handleLogout={this.handleLogout}
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