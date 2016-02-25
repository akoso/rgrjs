import React from "react";
import Relay from "react-relay";
import {debounce} from "lodash";

import Link from "./Link";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

let _getAppState = () => {
  return { links: LinkStore.getAll() };
}

class Main extends React.Component {
  constructor(props){
    super(props);

    this.search = debounce(this.search, 300);
  }

  setSearchQuery = (e) => {
    this.search(e.target.value);
  }
  search = (query) => {
    this.props.relay.setVariables({ query });
  }
  setLimit = (e) => {
    let newLimit = Number(e.target.value);
    this.props.relay.setVariables({limit: newLimit});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    Relay.Store.commitUpdate(
      new CreateLinkMutation({
        title: this.refs.newTitle.value,
        url: this.refs.newUrl.value,
        store: this.props.store
      })
    );
    this.refs.newTitle.value = "";
    this.refs.newUrl.value = "";
  }
  render() {
    let content = this.props.store.linkConnection.edges.map(edge => {
      return <Link key={edge.node.id} link={edge.node} />;
    });
    return (
      <div>
        <h3>Links</h3>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Title" ref="newTitle" />
          <input type="text" placeholder="Url" ref="newUrl" />
          <button type="submit">Add</button>
        </form>
        Showing: &nbsp;
        <select onChange={this.setLimit} defaultValue={this.props.relay.variables.limit}>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
        <input type="text" placeholder="Search" onChange={this.setSearchQuery} />
        <ul>
          {content}
        </ul>
      </div>
    );
  }
}

// Declare the data requirement for this component
Main = Relay.createContainer(Main, {
  initialVariables: {
    limit: 10,
    query: ''
  },
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        id,
        linkConnection(first: $limit, query: $query) {
          edges{
            node {
              id,
              ${ Link.getFragment('link') }
            }
          }
        }
      }
    `
  }
});

export default Main;
