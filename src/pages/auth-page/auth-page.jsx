import React from 'react';

import './auth-page.styles.scss';

const AuthPage = ({ auth3box, box }) => (
  <div className='auth-page'>
    <button className='custom-button' onClick={auth3box}>
      Auth with 3Box
    </button>
  </div>
);

export default AuthPage;