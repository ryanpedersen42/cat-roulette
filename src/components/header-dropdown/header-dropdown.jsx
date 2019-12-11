import React from 'react';
import { connect } from 'react-redux';
import CustomButton from '../custom-button/custom-button';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './header-dropdown.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

const HeaderDropdown = ({ handleLogout }) => (
  <div className='header-dropdown'>
    <CustomButton className='dropdown-items' onClick={() => ('do something')}>
      PROFILE
    </CustomButton>
    <CustomButton className='dropdown-items' onClick={handleLogout}>
      SIGN OUT
    </CustomButton>
  </div>
);

export default connect(mapStateToProps)(HeaderDropdown);