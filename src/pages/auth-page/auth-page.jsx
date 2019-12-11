import React from 'react';

import './auth-page.styles.scss';

const AuthPage = ({ auth3box }) => (
  <div className='auth-page'>
    <button className='custom-button' onClick={auth3box}>
      3Box Auth
    </button>
  </div>
);

export default AuthPage;