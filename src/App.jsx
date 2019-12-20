import React, { Component } from 'react';
import Web3 from 'web3';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import MainPage from './pages/main-page/main-page';
import AuthPage from './pages/auth-page/auth-page';
import ProfilePage from './pages/profile-page/profile-page';
import Pet from './abis/Pet.json';

import { setCurrentResult, setCurrentIPFS, setContract } from './redux/posts/posts.actions';
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
  setCurrentIPFS: currentIPFS => dispatch(setCurrentIPFS(currentIPFS)),
  setContract: contract => dispatch(setContract(contract))
});

const mapStateToProps = createStructuredSelector({
  posts: selectCurrentPosts,
  user: selectCurrentUserData, 
})

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isAppReady: false,
    }
  }

  async componentWillMount() {
    const { startLoading, endLoading } = this.props;
    try {
      await startLoading()
      await this.loadWeb3()
      await this.auth3Box()
      await this.getContractAndPosts()
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

  getContractAndPosts = async () => {
    const { setCurrentIPFS, setContract } = this.props
    const contract = await new web3.eth  // eslint-disable-line
      .Contract(Pet.abi, '0x5621A96b6C3dfeA14e48a88291c37356bD892503');
      await setContract(contract)
      await this.setState({ contract })
      const petHashes = await contract.methods.getHashes().call()
      await setCurrentIPFS(petHashes)
  }

  loadWeb3 = async () => {
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
    const { history, setCurrentResult, posts } = this.props;

    const ipfsPosts = posts.ipfsPosts
  
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const randomKeyNumber = getRandomInt(0, ipfsPosts.length - 1)
    
    try {
      const currentResult = ipfsPosts[randomKeyNumber]
      await setCurrentResult(currentResult)

      //re-render component
      history.push('/')
      history.push('/main')
    } catch(err) {
      console.error(err)
    }
  }

  auth3Box = async () => {
    const { user, logUserIn, setUserProfile, setBox, setDappSpace } = this.props;

    const box = await Box.openBox(user.ethAddress, window.ethereum, {});
    await new Promise((resolve, reject) => box.onSyncDone(resolve));

    const dappSpace = await box.openSpace('catRoulette');
    const userProfile = await Box.getProfile(user.ethAddress)

    await setUserProfile(userProfile)
    await logUserIn()
    await setDappSpace(dappSpace)
    await setBox(box)
    // history.push('/main')
  }

  handleLogout = async () => {
    const { history, user } = this.props;
    const box = user.box;

    await box.logout();
    history.push('/');
  }

  fetchPosts = async () => {
    //fetch users posts
    const { user } = this.props;
    const dappSpace = user.dappSpace;
    try {
      const dappSpaceData = await dappSpace.public.all()
      let ipfsKeyArray = []
      Object.keys(dappSpaceData).forEach((values) => {
        if (values.length === 15) {
          ipfsKeyArray.push(values)
        }
      });
      // set my posts here? might be better to define elsewhere 
    } catch(err) {
      console.error(err)
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
                  newImageHandler={this.newImageHandler}
                  handleLogout={this.handleLogout}

                  contract={this.state.contract}

                />
              )}
            />
              <Route
              exact
              path='/profile'
              render={() => (
                <ProfilePage
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