import React, { Component } from "react";
import * as api from "../api";
import alertTypes from "./alertTypes";
import MultiSelect from "@khanacademy/react-multi-select";
import Paginator from "./Paginator";

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      servers: [],
      selectedServers: [],
      searchParameters: {},
      isSearching: false,
      searchResults: [],
      currentPageSearchResults: []
      // hasError: false
    };

    this.handleServersSelectedChange = this.handleServersSelectedChange.bind(
      this
    );
    this.handleSearchPathChange = this.handleSearchPathChange.bind(this);
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.handleSearchClick = this.handleSearchClick.bind(this);

    this.setCurrentPageItems = this.setCurrentPageItems.bind(this);
  }

  fetchServers() {
    // debugger;
    api
      .getServers()
      .then(json => {
        // debugger;
        const options = json.map(s => {
          return { label: s, value: s };
        });
        this.setState({ servers: options });
        // this.setState({ hasError: false });
        this.setState({ isSearching: false });
      })
      .catch(error => {
        // debugger;
        console.log(error);
        this.props.alert(
          alertTypes.WARNING,
          "Cannot get servers, an error occured!"
        );
        // this.setState({ hasError: true });
        this.setState({ isSearching: false });
      });
  }

  componentDidMount() {
    this.fetchServers();
  }

  handleServersSelectedChange(selected) {
    this.setState({ selectedServers: selected });
  }

  handleSearchPathChange(event) {
    const searchParameters = {
      ...this.state.searchParameters,
      searchPath: event.target.value
    };
    this.setState({ searchParameters: searchParameters });
  }

  handleSearchTermChange(event) {
    const searchParameters = {
      ...this.state.searchParameters,
      searchTerm: event.target.value
    };
    this.setState({ searchParameters: searchParameters });
  }

  handleSearchClick(event) {
    event.preventDefault();
    const pars = this.state.searchParameters;
    debugger;
    if (
      this.state.selectedServers.length === 0 ||
      !pars.searchPath ||
      !pars.searchTerm
    ) {
      this.props.alert(
        alertTypes.WARNING,
        "Server, search path and search term are required!"
      );
      return;
    }

    this.setState({ searchResults: [] });
    this.setState({ isSearching: true });

    for (let i = 0; i < this.state.selectedServers.length; i++) {
      api.search(
        this.state.selectedServers[i],
        pars.searchPath,
        pars.searchTerm,
        text => {
          var additionalResults = text.split("*").filter(s => s.length !== 0);
          // console.log(additionalResults);
          this.setState(prevState => ({
            searchResults: [...prevState.searchResults, ...additionalResults]
          }));
        },
        () => {
          this.setState({ isSearching: false });
          if (this.state.searchResults.length === 0)
            this.props.alert(
              alertTypes.WARNING,
              "Search complete, no results found!"
            );
          else this.props.alert(alertTypes.WARNING, "Search complete!");
        },
        () => {
          this.setState({ isSearching: false });
          this.props.alert(
            alertTypes.WARNING,
            "Cannot search further, an error occured!"
          );
        }
      );
    }
  }

  setCurrentPageItems(currentPageItems) {
    this.setState({ currentPageSearchResults: currentPageItems });
  }

  render() {
    const disabledProp = this.state.isSearching ? { disabled: true } : {};

    const searchResultRows = this.state.currentPageSearchResults.map(r => {
      return (
        <tr key={r}>
          <td>{r}</td>
        </tr>
      );
    });

    const searchResultsTable =
      this.state.searchResults.length === 0 ? null : (
        <div className="table-responsive">
          <p />
          <h4>Search Results</h4>
          <p />
          <table className="table table-striped table-bordered table-hover table-sm table-responsive">
            <thead className="thead-dark">
              <tr>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>{searchResultRows}</tbody>
          </table>
          <Paginator
            items={this.state.searchResults}
            setCurrentPageItems={this.setCurrentPageItems}
          />
        </div>
      );

    return (
      <>
        <p />
        <h4>Welcome</h4>
        <p />
        <form>
          <div className="form-group">
            <div className="col-4">
              <label htmlFor="servers">Servers</label>
              {/* <input
                {...disabledProp}
                type="text"
                className="form-control"
                placeholder="Enter servers"
                value={this.state.searchParameters.searchServers || ""}
                onChange={this.handleSearchServersChange}
              /> */}

              <MultiSelect
                {...disabledProp}
                options={this.state.servers}
                selected={this.state.selectedServers}
                onSelectedChanged={this.handleServersSelectedChange}
              />
            </div>
            <div className="col-4">
              <label htmlFor="searchPath">Search path</label>
              <input
                {...disabledProp}
                type="text"
                className="form-control"
                placeholder="Enter search path"
                value={this.state.searchParameters.searchPath || ""}
                onChange={this.handleSearchPathChange}
              />
            </div>
            <div className="col-4">
              <label htmlFor="searchTerm">Search term</label>
              <input
                {...disabledProp}
                type="text"
                className="form-control"
                placeholder="Enter search term"
                value={this.state.searchParameters.searchTerm || ""}
                onChange={this.handleSearchTermChange}
              />
            </div>
          </div>
          <div className="col-8">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={this.state.isSearching}
              onClick={this.handleSearchClick}
            >
              {this.state.isSearching ? "Search in Progress" : "Search"}
            </button>
          </div>
        </form>
        <p />

        {searchResultsTable}
      </>
    );
  }
}

export default Welcome;
