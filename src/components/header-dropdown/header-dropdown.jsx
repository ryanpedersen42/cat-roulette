import React from 'react';
import { connect } from 'react-redux';
import CustomButton from '../custom-button/custom-button';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './header-dropdown.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

const HeaderDropdown = ({ handleLogout, user, box }) => (
  <div className='header-dropdown'>
    <div className='dropdown-items'>
     <a className='option' href='https://github.com/ryanpedersen42/cat-roulette'>GitHub</a>
          {
            user.isAuth ? 
          <div className='' onClick={handleLogout}>Sign Out</div> :
          <div className=''>Sign In to 3Box</div> 
          }
    </div>
    <CustomButton onClick={handleLogout}>
    SIGN OUT</CustomButton>
  </div>
);

export default connect(mapStateToProps)(HeaderDropdown);