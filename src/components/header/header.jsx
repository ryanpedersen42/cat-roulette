import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';
import ProfileHover from 'profile-hover';

import HeaderDropdown from '../header-dropdown/header-dropdown';

import './header.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

class Header extends Component {
  constructor(props){
    super(props);

    this.state = {
      hidden: true
    }
  }

  toggleHeader = () => {
    this.setState({ hidden: !this.state.hidden})
  }

  render(){
    const { handleLogout, box, user } = this.props;
    const { hidden } = this.state;
    return (
      <div className='header'>
        <div className='logo'>
          Cat Roulette
        </div>
        <div className='options'>
        <a className='option' href='https://github.com/ryanpedersen42/cat-roulette'>GitHub</a>
        <ProfileHover className='option' orientation='left' showName noTheme address={user.ethAddress}><div className='option'>{user.userProfile.name}</div></ProfileHover>
        <div className='down-arrow' onClick={this.toggleHeader}></div>
        {
          hidden ? '' : <HeaderDropdown box={box} handleLogout={handleLogout} />
        }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(Header);