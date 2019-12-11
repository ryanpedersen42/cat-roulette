import React, { Component } from 'react';
import HeaderDropdown from '../header-dropdown/header-dropdown';

import './header.styles.scss';

//todo
//redux action for handle logout 

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
    const { handleLogout, box } = this.props;
    const { hidden } = this.state;
    return (
      <div className='header'>
        <div className='logo'>
          Cat Roulette
        </div>
        <div className='options'>
        <a className='option' href='https://github.com/ryanpedersen42/cat-roulette'>GitHub</a>
        <button onClick={this.toggleHeader}>toggle header</button>
          {
            hidden ? '' : <HeaderDropdown box={box} handleLogout={handleLogout} />
          }
          {/* <a className='option' href='https://github.com/ryanpedersen42/cat-roulette'>GitHub</a>
          {
            box ? 
          <div className='option' onClick={handleLogout}>Sign Out</div> :
          <div className='option'>Sign In to 3Box</div> 
          } */}
        </div>
      </div>
    )
  }
}

export default Header;