import React, { Component } from 'react';
import ThreeBoxComments from '3box-comments-react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUserData } from '../../redux/user/user.selectors';

import './post-image.styles.scss';

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUserData, 
})

class PostImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    }
  }

  toggleSelected = () => {
    this.setState({selected: !this.state.selected})
  }

  render() {
    const { petHash, imageDescription, user } = this.props;
    const { selected } = this.state;
    return (
      <div className='image-container'>
        <img
          className={selected ? 'selected' : 'image' }
          src={`https://ipfs.infura.io/ipfs/${petHash}`}
          alt="current"
          onClick={this.toggleSelected}
        />  
        <div>
        {selected ? 
        <div className='image-comments'>
        <p>{imageDescription}</p>
          <ThreeBoxComments
            spaceName={user.dappSpace._name}
            threadName={petHash}
            adminEthAddr='0x55c4eb985536f74f354dbaf7dd2d8891e9373504'
            members={false}
            showCommentCount={4}

            box={user.box}
            currentUserAddr={user.ethAddress}
          /> 
         </div>
        : null }
      </div>
    </div>
    )
  }
}

export default connect(mapStateToProps)(PostImage);