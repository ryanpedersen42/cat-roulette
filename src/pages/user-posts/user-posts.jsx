import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import Header from '../../components/header/header';

import PostImage from '../../components/post-image/post-image';
import './user-posts.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData,
})

const UserPosts = ({ user }) => {
  const posts = user.userPosts;
  return (
    <>
  <Header />
    {
      posts.map((userPost, i) => {
            return (
              <PostImage
                key={i}
                petHash={userPost}
                // imageDescription={userPost[i].imageDescription}
                />
            );
        })
    }
  </>

  )
}

export default connect(mapStateToProps)(UserPosts);