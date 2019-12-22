import React from "react";
import { connect } from 'react-redux';
import CustomButton from "../custom-button/custom-button";
import { withRouter } from "react-router-dom";
import { resetState } from '../../redux/ui/ui.actions';

import "./header-dropdown.styles.scss";

const mapDispatchToProps = dispatch => ({
  resetState: () => dispatch(resetState())
});

const HeaderDropdown = ({ handleLogout, history, resetState }) => (
  <div className="header-dropdown">
    <div>
      {history.location.pathname === "/main" ? (
        <CustomButton
          className="dropdown-items"
          onClick={() => {
            history.push("/profile")
            resetState()
            }
            }>
          MY PROFILE
        </CustomButton>
      ) : history.location.pathname === "/profile" ? (
        <CustomButton
          className="dropdown-items"
          onClick={() => {
          history.push("/main")
          resetState()
          }}
        >
          HOME
        </CustomButton>
      ) : null}
      <CustomButton className="dropdown-items" onClick={handleLogout}>
        SIGN OUT
      </CustomButton>
    </div>
  </div>
);

export default withRouter(connect(null, mapDispatchToProps)(HeaderDropdown));