import React from 'react';

import './post-image.styles.scss';

const PostImage = ({ imageDescription, petHash }) => (
  <div className='image-container'>
      <img
        className='image'
        src={`https://ipfs.infura.io/ipfs/${petHash}`}
        alt="current"
      />  
    <div>
    <p>{imageDescription}</p>
  </div>
</div>
)

export default PostImage;