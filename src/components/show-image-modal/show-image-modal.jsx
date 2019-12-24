import React, { Component } from 'react';

import './show-image-modal.styles.scss';

const ShowImageModal = ({ petHash }) => (
  <div className='image-modal'>
      <>
      <div className='modal-close' onClick={toggleAddImage}>&times;</div>
      <h1>Wow great pic!</h1>
          <div className="image-container">
            <img
              className="image"
              src={`https://ipfs.infura.io/ipfs/${petHash}`}
              alt="current"
            />
            {/* <p>{posts.currentResult.imageDescription}</p> */}
            <p>&nbsp;</p>
          </div>
          {user.box && posts.currentResult && <CommentComponent />}
      </>
      )
  </div>
);

export default ShowImageModal;