import React from 'react';

import './auth-header.styles.scss';

const AuthHeader = () => (
  <div className='header'>
  <div className='logo'>
    Cat Roulette
  </div>
  <div className='options'>
  <a className='option' href='https://github.com/ryanpedersen42/cat-roulette'>GitHub</a>
  </div>
</div>
)

export default AuthHeader;