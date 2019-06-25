import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import Home from "./Home";
import Welcome from "./Welcome";
import PageNotFound from "./PageNotFound";
import { AlertList } from "react-bs-notifier";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alerts: []
    };

    this.alert = this.alert.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  alert(type, message) {
    const newAlert = {
      id: new Date().getTime(),
      type: type,
      headline: "",
      message: message
    };

    this.setState({
      alerts: [...this.state.alerts, newAlert]
    });
  }

  dismissAlert(alert) {
    const alerts = this.state.alerts;
    const idx = alerts.indexOf(alert);

    if (idx >= 0) {
      this.setState({
        alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
      });
    }
  }

  render() {
    return (
      <>
        <Nav />
        <div className="container-fluid">
          <Switch>
            <Route
              exact
              path="/"
              render={props => {
                return <Welcome {...props} alert={this.alert.bind(this)} />;
              }}
            />
            <Route component={PageNotFound} />
          </Switch>
          <AlertList
            position="top-right"
            alerts={this.state.alerts}
            timeout={5000}
            onDismiss={this.dismissAlert}
          />
        </div>
      </>
    );
  }
}

export default App;
