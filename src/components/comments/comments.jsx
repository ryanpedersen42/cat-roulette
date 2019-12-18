import React from 'react';
import ThreeBoxComments from '3box-comments-react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectCurrentPosts } from '../../redux/posts/posts.selectors.js';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './comments.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
  posts: selectCurrentPosts,
})

const CommentComponent = ({ user, posts, currentPost, box, dappSpace }) => (
  <div className='comment-component'>
    <ThreeBoxComments 
        spaceName='catRoulette'
        threadName={currentPost}
        adminEthAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
        members={false}
        showCommentCount={15}

        box={box}
        currentUserAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
    />
  </div>
);

export default connect(mapStateToProps)(CommentComponent);