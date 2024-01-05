import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    setCurrent(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills mt-2 bg-light rounded-3"> {/* Use Bootstrap classes for light background and rounded corners */}
      <NavLink to="/user/dashboard" className="nav-link" activeClassName="active">
        Dashboard
      </NavLink>
      {/* Add additional nav links here as needed */}
    </div>
  );
};

export default UserNav;
