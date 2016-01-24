// =========================================
// App
// ----
// Fetches transaction data from api and renders dashboard
// =========================================

import React from 'react';
import ReactDOM from 'react-dom';
import {Motion, spring} from 'react-motion';

const ReactApp = React.createClass ({
  getInitialState() {
    return {
      // todo: make initial state
    };
  },

  render: function(){

    return(
      <div>
        <h1>YEAH</h1>
      </div>
    )
  }
});

ReactDOM.render(<ReactApp/>, document.getElementById('appContainer'));