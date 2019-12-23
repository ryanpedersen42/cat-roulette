import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import Header from '../../components/header/header';
import AddImageModal from "../../components/add-image-modal/add-image-modal";
import { selectCurrentPosts } from '../../redux/posts/posts.selectors';
import { selectCurrentUI } from "../../redux/ui/ui.selectors";


import PostImage from '../../components/post-image/post-image';
import './user-posts.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData,
  posts: selectCurrentPosts,
  ui: selectCurrentUI
})

const UserPosts = ({ user, ui, posts }) => {
  const userPosts = user.userPosts;
  return (
    <>
  <Header />
  {
    ui.addImageOpen ? (
      <AddImageModal />
    ) : (
      <>
        <h1>My Posts</h1>
          {
            userPosts.map((userPost, i) => {
                  return (
                    <PostImage
                      key={i}
                      petHash={userPost}
                      />
                  );
              })
          }
      </>
    )
  }
  </>

  )
}

export default connect(mapStateToProps)(UserPosts);