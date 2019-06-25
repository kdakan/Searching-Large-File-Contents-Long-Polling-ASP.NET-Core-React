import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";

class Nav extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand">
          File Search App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto" />
        </div>
      </nav>
    );
  }
}

export default withRouter(Nav);
