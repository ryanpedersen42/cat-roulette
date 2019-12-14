import React from 'react';
import ThreeBoxComments from '3box-comments-react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPetHash } from '../../redux/posts/posts.selectors.js';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './comments.styles.scss';

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
  user: selectCurrentUserData, 
})

const CommentComponent = ({ spaceName, box, currentPetHash, user }) => (
  <div className='comment-component'>
    <ThreeBoxComments 
        spaceName={spaceName}
        threadName={currentPetHash}
        adminEthAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
        box={box}
        currentUserAddr={user.ethAddress}
    />
  </div>
);

export default connect(mapStateToProps)(CommentComponent);