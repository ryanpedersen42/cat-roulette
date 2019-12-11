import React from 'react';
import EditProfile from '3box-profile-edit-react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './profile-page.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

const ProfilePage = ({ box, dappSpace, user }) => (
  <>
  <h1>Profile Page</h1>
  <div className='profile-page'>
      <div className='profile-edit'>
        <EditProfile
            box={box}
            space={dappSpace}
            currentUserAddr={user.ethAddress}
            currentUser3BoxProfile={user.userProfile}
        />
      </div>
     </div>
  </>
)

export default connect(mapStateToProps)(ProfilePage);