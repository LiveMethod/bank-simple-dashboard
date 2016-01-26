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

    // this is a funky way to do this, but it works.

    // mongo's find many expects an array, and a fast
    // way to send an array via url queries is something
    // like endpoint&a=1&a=2 which will be interpreted as
    // a=[1,2] on the backend.

    // given the above, loop through all the txns, get the
    // uuids, and concat them into the ugliest string ever.

    var txnUuidArray = '';
    for(var t in this.state.txns){
      var leadingChar = '';
      t == 0 ? leadingChar = '?' : leadingChar = '&';
      var tempUuid = this.state.txns[t].uuid;

      txnUuidArray += leadingChar + 'array='+ tempUuid;
    }
    // console.log(txnUuidArray);
    const notesApi = '/api/notes/array/' + txnUuidArray;
    console.log('calling ', notesApi)

    $.get(notesApi, function(data){
      if(this.isMounted()){
        console.log(data);
        this.setState({
          notes: data,
        });
        // console.log(this.state.notes);
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