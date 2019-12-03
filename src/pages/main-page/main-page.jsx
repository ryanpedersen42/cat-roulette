import React from 'react';
import CommentComponent from '../../components/comments/comments';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPetHash } from '../../redux/posts/posts.selectors.js'

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
})

const MainPage = ({ match, location, ethAddress, adminEthAddress, spaceName, box, newImageHandler, currentPetHash }) => {
  return (
    <main role="main" className="col-lg-12 d-flex text-center">
    <button onClick={newImageHandler}>new image</button>
    <div className="content mr-auto ml-auto">
        <img 
        className='image'
        src={`https://ipfs.infura.io/ipfs/${currentPetHash}`} 
        alt='current'
        />
        {box &&
        <CommentComponent
          ethAddress={ethAddress}
          petHash={currentPetHash}
          adminEthAddress={adminEthAddress}
          spaceName={spaceName}
          box={box}
          myAddress={ethAddress}
         />
        }
      <p>&nbsp;</p>
    </div>
  </main>
  )
}

export default connect(mapStateToProps)(MainPage);