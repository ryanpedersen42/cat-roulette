import React from 'react';
import EditProfile from '3box-profile-edit-react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import Header from '../../components/header/header';
import { selectCurrentPosts } from "../../redux/posts/posts.selectors.js";
import AddImageModal from "../../components/add-image-modal/add-image-modal";
import { selectCurrentUI } from "../../redux/ui/ui.selectors";

import './profile-page.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
  posts: selectCurrentPosts,
  ui: selectCurrentUI
})

const ProfilePage = ({ user, ui }) => (
  <>
  <Header />
  {
    ui.addImageOpen ? (
      <AddImageModal />
    ) : (
      <>
        <h1>My Profile Page</h1>
        <div className='profile-page'>
            <div className='profile-edit'>
              <EditProfile
                  box={user.box}
                  space={user.dappSpace}
                  currentUserAddr={user.ethAddress}
                  currentUser3BoxProfile={user.userProfile}
              />
            </div>
          </div>
      </>
    )
  }
  </>
)

export default connect(mapStateToProps)(ProfilePage);