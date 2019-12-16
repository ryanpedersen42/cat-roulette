import React, { Component } from 'react';
import Web3 from 'web3';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import MainPage from './pages/main-page/main-page';
import AuthPage from './pages/auth-page/auth-page';
import ProfilePage from './pages/profile-page/profile-page';

import { setCurrentResult, setCurrentIPFS } from './redux/posts/posts.actions';
import { selectCurrentPosts } from './redux/posts/posts.selectors';

import { setEthAddress, logUserIn, setUserProfile, setBox, setDappSpace, logUserOut } from './redux/user/user.actions';
import { startLoading, endLoading } from './redux/ui/ui.actions';
import { selectCurrentUserData } from './redux/user/user.selectors';

import './App.css';

const Box = require('3box')

const mapDispatchToProps = dispatch => ({
  setEthAddress: user => dispatch(setEthAddress(user)),
  logUserIn: () => dispatch(logUserIn()),
  logUserOut: () => dispatch(logUserOut()),
  setUserProfile: user => dispatch(setUserProfile(user)),
  setBox: box => dispatch(setBox(box)),
  setDappSpace: dapp => dispatch(setDappSpace(dapp)),
  startLoading: () => dispatch(startLoading()),
  endLoading: () => dispatch(endLoading()),
  setCurrentResult: currentResult => dispatch(setCurrentResult(currentResult)),
  setCurrentIPFS: currentIPFS => dispatch(setCurrentIPFS(currentIPFS))
});

const mapStateToProps = createStructuredSelector({
  posts: selectCurrentPosts,
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
    const { startLoading, endLoading } = this.props;
    try {
      await startLoading()
      await this.loadWeb3()
      await this.auth3Box()
      await this.fetchPosts()
      await this.newImageHandler()
      await endLoading()
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
    const { history, user, setCurrentResult } = this.props;
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
      await setCurrentResult(currentResult)

      //re-render component
      history.push('/')
      history.push('/main')
    } catch(err) {
      console.error(err)
    }
  }

  auth3Box = async () => {
    const { user, logUserIn, history, setUserProfile, setBox, setDappSpace } = this.props;

    const box = await Box.openBox(user.ethAddress, window.ethereum, {});
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const dappSpace = await box.openSpace('catSpace');
    const userProfile = await Box.getProfile(user.ethAddress)

    await setUserProfile(userProfile)
    await logUserIn()
    await setDappSpace(dappSpace)
    await setBox(box)
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
    const { user, setCurrentIPFS } = this.props;
    const dappSpace = user.dappSpace;
    try {
      const dappSpaceData = await dappSpace.public.all()
      let ipfsKeyArray = []
      Object.keys(dappSpaceData).forEach((values) => {
        if (values.length === 15) {
          ipfsKeyArray.push(values)
        }
      });
      await setCurrentIPFS(ipfsKeyArray)
      this.setState({ ipfsPosts: ipfsKeyArray})
    } catch(err) {
      console.error('error hereee', err)
    }
  }

  render() {
    const { isAppReady } = this.state;
    return (
      <div className="App">
      {isAppReady && (<React.Fragment>
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
                  // currentResult={currentResult}

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
                  // dappSpace={dappSpace}
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