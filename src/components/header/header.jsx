import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import { selectCurrentUI } from '../../redux/ui/ui.selectors';
import { toggleDropdown, toggleAddImage, resetState } from '../../redux/ui/ui.actions';
import { withRouter } from 'react-router-dom';
import ProfileHover from 'profile-hover';

import HeaderDropdown from '../header-dropdown/header-dropdown';

import './header.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData,
  ui: selectCurrentUI
})

const mapDispatchToProps = dispatch => ({
  toggleDropdown: () => dispatch(toggleDropdown()),
  toggleAddImage: () => dispatch(toggleAddImage()),
  resetState: () => dispatch(resetState())
});

const Header = ({ handleLogout, user, toggleImageModal, ui, toggleDropdown, toggleAddImage, history, resetState }) => (
  <div className='header'>
  <div className='logo' onClick={() => {
    history.push('/main')
    resetState()
    }
  }>
    Cat Roulette
  </div>
  <div className='options'>
  <ProfileHover className='option' orientation='left' showName noTheme address={user.ethAddress}><div className='option'>{user.userProfile.name ? user.userProfile.name : user.ethAddress}</div></ProfileHover>
  <div className='option' onClick={toggleAddImage}>Add New Image</div>
  <div className='option'>| </div>
  <div className='down-arrow' 
   onClick={toggleDropdown}>{    }</div>
  {
    ui.dropdownOpen ? <HeaderDropdown handleLogout={handleLogout} toggleImageModal={toggleImageModal} /> : ''
  }
  </div>
</div>
)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));