import React from "react";
import CommentComponent from "../../components/comments/comments";
import Header from "../../components/header/header";
import AddImageModal from "../../components/add-image-modal/add-image-modal";
import CustomButton from "../../components/custom-button/custom-button";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectCurrentPetHash } from "../../redux/posts/posts.selectors.js";
import { selectCurrentUserData } from "../../redux/user/user.selectors.js";
import { selectCurrentUI } from "../../redux/ui/ui.selectors";
import { toggleAddImage } from "../../redux/ui/ui.actions";

import "./main-page.styles.scss";

const mapStateToProps = createStructuredSelector({
  currentPetHash: selectCurrentPetHash,
  user: selectCurrentUserData,
  ui: selectCurrentUI
});

const mapDispatchToProps = dispatch => ({
  toggleAddImage: () => dispatch(toggleAddImage())
});

const MainPage = ({ handleLogout, newImageHandler, currentPetHash, currentResult, user, ui }) => (
  <>
    <Header handleLogout={handleLogout} />
    {ui.addImageOpen ? (
      <AddImageModal />
    ) : (
      <>
        <div className="main-page">
          <div className="roulette-button">
            <CustomButton onClick={newImageHandler}>Spin</CustomButton>
          </div>
          <div className="image-container">
            <img
              className="image"
              src={`https://ipfs.infura.io/ipfs/${currentPetHash}`}
              alt="current"
            />
            <p>{currentResult.imageDescription}</p>
            <p>&nbsp;</p>
          </div>
          {user.box && <CommentComponent />}
        </div>
      </>
    )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
