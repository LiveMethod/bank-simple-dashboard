// =========================================
// App
// ----
// Fetches transaction data from api and renders dashboard
// =========================================

import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';
import PiePanel from './components/PiePanel.jsx'
import BarPanel from './components/BarPanel.jsx'
import SliverPanel from './components/SliverPanel.jsx'

const ReactApp = React.createClass ({
  getInitialState() {
    return {
      monthlyBudget: 6500,
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

  getNotesForTxns(){

    // this is a funky way to do this, but it works.

    // mongo's find many expects an array, and a fast
    // way to send an array via url queries is something
    // like endpoint?a=1&a=2 which will be interpreted as
    // a=[1,2] on the backend.

    // given the above, this loops through all the txns, gets the
    // uuids, and concats them into the ugliest string ever.

    var txnUuidArray = '';
    for(var t in this.state.txns){
      var leadingChar = '';
      t == 0 ? leadingChar = '?' : leadingChar = '&';
      var tempUuid = this.state.txns[t].uuid;

      txnUuidArray += leadingChar + 'array='+ tempUuid;
    }
    // console.log(txnUuidArray);
    const notesApi = '/api/notes/array/' + txnUuidArray;
    // console.log('calling ', notesApi)

    $.get(notesApi, function(data){
      if(this.isMounted()){
        // console.log(data);
        this.setState({
          // there are no notes for any txns yet,
          // so the exact mechanics of this are TBD
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
        <PiePanel state={this.state}/>
        <BarPanel state={this.state}/>
        <SliverPanel state={this.state}/>
      </div>
    )
  }
});

ReactDOM.render(<ReactApp/>, document.getElementById('appContainer'));