import React from 'react';
import CustomButton from '../custom-button/custom-button';
import { withRouter } from 'react-router-dom';

import './header-dropdown.styles.scss';

const HeaderDropdown = ({ handleLogout, history, toggleImageModal }) => (
  <div className='header-dropdown'>
    <div>
    <CustomButton className='dropdown-items' onClick={toggleImageModal}>
      ADD IMAGE
    </CustomButton>
    <CustomButton className='dropdown-items' onClick={() => history.push('/profile')}>
      MY PROFILE
    </CustomButton>
    <CustomButton className='dropdown-items' onClick={handleLogout}>
      SIGN OUT
    </CustomButton>
    </div>
  </div>
);

export default withRouter(HeaderDropdown);