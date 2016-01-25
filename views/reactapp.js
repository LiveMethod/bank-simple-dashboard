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
      targetYear: '2016',
      targetMonth: '01',
      notes: {},
      txns: {},
    };
  },

  getTxnsForMonth(){
    const txnsApi = '/api/transactions?y=' + this.state.targetYear + '&m=' + this.state.targetMonth;
    console.log('txnsApi')
    $.get(txnsApi, function(data){
      if(this.isMounted()){
        this.setState({
          txns: data,
        });
        console.log('got txns');
        this.getNotesForTxns();
      }
    }.bind(this));
  },

  // TODO - this should loop through txns and look up
  // notes by UUID. There may be a way to make the API
  // accept an array of uuids instead of doing like 300
  // individual lookups.
  getNotesForTxns(){
    const notesApi = '/api/notes';
    $.get(notesApi, function(data){
      if(this.isMounted()){
        this.setState({
          notes: data,
        });
        console.log(this.state.notes);
      }
    }.bind(this));
  },

  componentDidMount(){
    this.getTxnsForMonth();
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