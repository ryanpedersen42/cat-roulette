import React from 'react';
import ThreeBoxComments from '3box-comments-react';

const CommentComponent = (props) => {
  return (
    <ThreeBoxComments 
        // required
        // spaceName="mySpaceName"
        // threadName="myThreadName"
        // adminEthAddr={adminEthAddr}


        // // Required props for context A) & B)
        // box={box}
        // currentUserAddr={myAddress}

        // // Required prop for context B)
        // loginFunction={handleLogin}

        // // Required prop for context C)
        // ethereum={ethereum}

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