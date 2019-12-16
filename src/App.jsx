import React, { Component } from 'react';
import Web3 from 'web3';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';

import MainPage from './pages/main-page/main-page';
import AuthPage from './pages/auth-page/auth-page';
import ProfilePage from './pages/profile-page/profile-page';

import { setCurrentPetHash } from './redux/posts/posts.actions';
import { selectCurrentPetHash } from './redux/posts/posts.selectors';

import { setEthAddress, logUserIn, setUserProfile, setBoxTest, setDappTest, logUserOut } from './redux/user/user.actions';
import { selectCurrentUserData } from './redux/user/user.selectors';

import './App.css';

const Box = require('3box')

const mapDispatchToProps = dispatch => ({
  setCurrentPetHash: user => dispatch(setCurrentPetHash(user)),
  setEthAddress: user => dispatch(setEthAddress(user)),
  logUserIn: () => dispatch(logUserIn()),
  logUserOut: () => dispatch(logUserOut()),
  setUserProfile: user => dispatch(setUserProfile(user)),
  setBoxTest: box => dispatch(setBoxTest(box)),
  setDappTest: dapp => dispatch(setDappTest(dapp))
});

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
  user: selectCurrentUserData, 
})

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      petHash: '',
      currentResult: {},
      ipfsPosts: [],
      isAppReady: false,
      isLoaded: false,
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
    const { history, user } = this.props;
    const box = user.testBox;

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
    const { setCurrentPetHash, history, user } = this.props;
    const { ipfsPosts } = this.state;

    const dappSpace = user.dappSpace;
  
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const randomKeyNumber = getRandomInt(0, ipfsPosts.length - 1)
    
    try {
      const currentPost = await dappSpace.public.get(ipfsPosts[randomKeyNumber])
      const parsedResult = JSON.parse(currentPost)
      const currentResult = parsedResult[0]
      await this.setState({ currentResult, petHash: currentResult.petHash })
      await setCurrentPetHash(currentResult.petHash)

      //re-render component
      history.push('/')
      history.push('/main')
    } catch(err) {
      console.error(err)
    }
  }

  auth3Box = async () => {
    const { user, logUserIn, history, setUserProfile, setBoxTest, setDappTest } = this.props;

    const box = await Box.openBox(user.ethAddress, window.ethereum, {});
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const dappSpace = await box.openSpace('catSpace');
    const userProfile = await Box.getProfile(user.ethAddress)

    await setUserProfile(userProfile)
    await logUserIn()
    await setDappTest(dappSpace)
    await setBoxTest(box)
    await this.setState({ isLoaded: true })
    history.push('/main')
  }

  handleLogout = async () => {
    const { history, user } = this.props;
    const box = user.testBox;

    await box.logout();
    history.push('/');
  }

  fetchPosts = async () => {
    const { dappSpace } = this.state;
    try {
      const dappSpaceData = await dappSpace.public.all()
      let ipfsKeyArray = []
      Object.keys(dappSpaceData).forEach((values) => {
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
    const { dappSpace, isAppReady, currentResult, isLoaded } = this.state;
    return (
      <div className="App">
      { !isLoaded ?     <ReactLoading type={'bars'} color={'black'} height={'10%'} width={'20%'} />

      :
      (

        isAppReady && (<React.Fragment>
          <Switch>
            <Route
              exact
              path='/'
              render={() => <AuthPage 
                auth3box={this.auth3Box}
               />}
            />
            <Route
              exact
              path='/main'
              render={() => (
                <MainPage
                  currentResult={currentResult}

                  newImageHandler={this.newImageHandler}
                  handleLogout={this.handleLogout}
                />
              )}
            />
              <Route
              exact
              path='/profile'
              render={() => (
                <ProfilePage
                  dappSpace={dappSpace}
                />
                )}
                />
          </Switch>
        </React.Fragment>)
      )}
      </div>

    );

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));