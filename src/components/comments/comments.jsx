import React from 'react';
import ThreeBoxComments from '3box-comments-react';

const CommentComponent = ({ ethAddress, petHash, spaceName, box, myAddress}) => {
  return (
    <ThreeBoxComments 
        spaceName={spaceName}
        threadName={petHash}
        adminEthAddr={ethAddress}
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