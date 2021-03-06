import React from 'react';
import { render } from 'react-dom';
import gql from 'apollo-client/gql';
import ApolloClient from 'apollo-client';
import { ApolloProvider, connect } from 'react-apollo';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';

const networkInterface = {
  query() {
    return new Promise((resolve) => {
      resolve({
        data: {
          viewer: {
            name: 'Daniel',
          },
        },
      });
    });
  },
};

const client = new ApolloClient({
  networkInterface,
});

const store = createStore(
  combineReducers({
    apollo: client.reducer(),
  }),
  applyMiddleware(client.middleware(), createLogger()),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

function HelloComponent(props) {
  if (props.data.loading) {
    return null;
  }

  const name = props.data.viewer.name;
  return <p>Hi {name}</p>;
}

HelloComponent.propTypes = {
  data: React.PropTypes.object.isRequired,
};

function mapQueriesToProps() {
  return {
    data: {
      query: gql`
        query sample {
          viewer {
            name
          }
        }
      `,
    },
  };
}

const HelloContainer = connect({
  mapQueriesToProps,
})(HelloComponent);

render(
  <ApolloProvider store={store} client={client}>
    <HelloContainer />
  </ApolloProvider>,
  document.getElementById('root')
);
