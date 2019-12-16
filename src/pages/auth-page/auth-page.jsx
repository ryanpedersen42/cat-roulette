import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import ReactLoading from "react-loading";

import AuthHeader from "../../components/auth-header/auth-header";
import { selectCurrentUI } from "../../redux/ui/ui.selectors";

import "./auth-page.styles.scss";

const mapStateToProps = createStructuredSelector({
  ui: selectCurrentUI
});

const AuthPage = ({ auth3box, ui }) => (
  <>
    <AuthHeader />
    {ui.isLoading ? (
      <div className="auth-page">
        <h3>Hold tight. We are confirming web3 and signing in with 3Box...</h3>
        <ReactLoading
          type={"bars"}
          color={"black"}
          height={"10%"}
          width={"15%"}
        />
      </div>
    ) : (
      <div className="auth-page">
        <button className="custom-button" onClick={auth3box}>
          3Box Auth
        </button>
      </div>
    )}
  </>
);

export default connect(mapStateToProps)(AuthPage);
