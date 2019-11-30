import React from 'react';
import ThreeBoxComments from '3box-comments-react';

const CommentComponent = ({ ethAddress, petHash, spaceName, box, myAddress, adminEthAddr}) => {
  return (
    <ThreeBoxComments 
        spaceName={spaceName}
        threadName={petHash}
        adminEthAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
        box={box}
        currentUserAddr={ethAddress}

        // // optional
        // members={false}
        // showCommentCount={10}
        // threadOpts={{}}
        // useHovers={false}
        // currentUser3BoxProfile={currentUser3BoxProfile}
        // userProfileURL={address => `https://mywebsite.com/user/${address}`}
    />
  )
}

export default CommentComponent;