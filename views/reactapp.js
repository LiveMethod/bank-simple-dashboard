// =========================================
// App
// ----
// Fetches transaction data from api and renders dashboard
// =========================================

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';

const ReactApp = React.createClass ({
  getInitialState() {
    return {
      // todo: make initial state
      notes: {},
      txns: {},
    };
  },

  componentDidMount(){
    const notesApi = '/api/notes';
    $.get(notesApi, function(data){
      if(this.isMounted()){
        this.setState({
          notes: data,
        });
        console.log(this.state.notes);
      }
    }.bind(this));

    const txnsApi = '/api/transactions';
    $.get(txnsApi, function(data){
      if(this.isMounted()){
        this.setState({
          txns: data,
        });
        console.log(this.state.txns);
      }
    }.bind(this));
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