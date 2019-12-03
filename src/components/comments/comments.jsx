import React from 'react';
import ThreeBoxComments from '3box-comments-react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPetHash } from '../../redux/posts/posts.selectors.js'

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
})

const CommentComponent = ({ ethAddress, spaceName, box, currentPetHash }) => {
  return (
    <ThreeBoxComments 
        spaceName={spaceName}
        threadName={currentPetHash}
        adminEthAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
        box={box}
        currentUserAddr={ethAddress}
    />
  )
}

export default connect(mapStateToProps)(CommentComponent);