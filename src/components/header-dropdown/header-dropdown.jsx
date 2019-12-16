import React from "react";
import CustomButton from "../custom-button/custom-button";
import { withRouter } from "react-router-dom";

import "./header-dropdown.styles.scss";

const HeaderDropdown = ({ handleLogout, history }) => (
  <div className="header-dropdown">
    <div>
      {history.location.pathname === "/main" ? (
        <CustomButton
          className="dropdown-items"
          onClick={() => history.push("/profile")}
        >
          MY PROFILE
        </CustomButton>
      ) : history.location.pathname === "/profile" ? (
        <CustomButton
          className="dropdown-items"
          onClick={() => history.push("/main")}
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

export default withRouter(HeaderDropdown);
