import React from 'react';

import './add-page.styles.scss';

const AuthPage = ({ auth3box }) => (
  <div className='add-page'>
    <button className='custom-button' onClick={handleAuth}>
      Auth with 3Box
    </button>
  </div>
);

export default AuthPage;