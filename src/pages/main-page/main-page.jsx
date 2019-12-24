import React from "react";
import CommentComponent from "../../components/comments/comments";
import Header from "../../components/header/header";
import AddImageModal from "../../components/add-image-modal/add-image-modal";
import CustomButton from "../../components/custom-button/custom-button";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectCurrentPosts } from "../../redux/posts/posts.selectors.js";
import { selectCurrentUserData } from "../../redux/user/user.selectors.js";
import { selectCurrentUI } from "../../redux/ui/ui.selectors";
import { toggleAddImage } from "../../redux/ui/ui.actions";

import "./main-page.styles.scss";

const mapStateToProps = createStructuredSelector({
  posts: selectCurrentPosts,
  user: selectCurrentUserData,
  ui: selectCurrentUI
});

const mapDispatchToProps = dispatch => ({
  toggleAddImage: () => dispatch(toggleAddImage())
});

const MainPage = ({ handleLogout, newImageHandler, user, ui, posts, contract }) => (
  <>
    <Header handleLogout={handleLogout} />
    {ui.addImageOpen ? (
      <AddImageModal contract={posts.contract} />
    ) : (
      <>
        <div className="main-page">
          <div className="roulette-button">
            <CustomButton onClick={newImageHandler}>Spin</CustomButton>
          </div>
          <div className="image-container">
            <img
              className="image"
              src={`https://ipfs.infura.io/ipfs/${posts.currentResult}`}
              alt="current"
            />
            <p>&nbsp;</p>
          </div>
          {user.box && posts.currentResult && <CommentComponent />}
        </div>
      </>
    )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
