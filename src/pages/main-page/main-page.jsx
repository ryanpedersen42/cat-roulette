import React from 'react';
import CommentComponent from '../../components/comments/comments';
import Header from '../../components/header/header';
import CustomButton from '../../components/custom-button/custom-button';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPetHash } from '../../redux/posts/posts.selectors.js'
import ProfileHover from 'profile-hover'

import './main-page.styles.scss';

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
})

const MainPage = ({ ethAddress, adminEthAddress, handleLogout, spaceName, box, newImageHandler, currentPetHash }) => {
  return (
    <>
    <Header
      ethAddress={ethAddress}
      box={box}
      handleLogout={handleLogout}
     />
    <div className="main-page">
    { box && ethAddress ? (
      <ProfileHover
      address={ethAddress}
      orientation='right'
       /> 
      ) 
      : 
      null
      }
    <CustomButton onClick={newImageHandler}>New Image</CustomButton>
    <div className="image-container">
        <img 
        className='image'
        src={`https://ipfs.infura.io/ipfs/${currentPetHash}`} 
        alt='current'
        />
        {box &&
        <CommentComponent
          ethAddress={ethAddress}
          adminEthAddress={adminEthAddress}
          spaceName={spaceName}
          box={box}
          myAddress={ethAddress}
         />
        }
      <p>&nbsp;</p>
    </div>
  </div>
  </>
  )
}

export default connect(mapStateToProps)(MainPage);