import React, { Component } from 'react';
import CommentComponent from '../../components/comments/comments';
import Header from '../../components/header/header';
import AddImageModal from '../../components/add-image-modal/add-image-modal';
import CustomButton from '../../components/custom-button/custom-button';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPetHash } from '../../redux/posts/posts.selectors.js'

import './main-page.styles.scss';

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
})

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    }
  }

  toggleImageModal = () => {
    const { modalVisible } = this.state;
    // console.log(this.props.currentResult)
    this.setState({ modalVisible: !modalVisible})
  }

  render() {
    const { ethAddress, adminEthAddress, handleLogout, spaceName, box, newImageHandler, currentPetHash, dappSpace, currentResult } = this.props;
    const { modalVisible } = this.state

  return (
    <>
    <Header
      box={box}
      handleLogout={handleLogout}
      toggleImageModal={this.toggleImageModal}
     />
     {
       modalVisible ? (
        <AddImageModal toggleImageModal={this.toggleImageModal} modalVisible={modalVisible} dappSpace={dappSpace}/>
       )
       :
       (
         <>
          <div className="main-page">
          <div className='roulette-button'>
          <CustomButton onClick={newImageHandler}>Spin</CustomButton>
          </div>
          <div className="image-container">
            <img 
            className='image'
            src={`https://ipfs.infura.io/ipfs/${currentPetHash}`} 
            alt='current'
            />
            <p>{currentResult.imageDescription}</p>
            <p>&nbsp;</p>
          </div>
            {box &&
            <CommentComponent
              ethAddress={ethAddress}
              adminEthAddress={adminEthAddress}
              spaceName={spaceName}
              box={box}
              myAddress={ethAddress}
            />
          }
        </div>
    </>
       )
     }
  </>
  )
  }
}

export default connect(mapStateToProps)(MainPage);