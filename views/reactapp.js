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
import SideBar from './components/SideBar.jsx'

const ReactApp = React.createClass ({
  getInitialState() {
    return {
      monthlyBudget: 6500,
      targetYear: '2016',
      targetMonth: '01',
      notes: [],
      txns: [],
      untagged: [],
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

    // mongo's findMany expects an array, and a fast
    // way to send an array via url queries is something
    // like endpoint?a=1&a=2 which will be interpreted as
    // a=[1,2] on the backend.

    // given the above, this loops through all the txns, gets the
    // uuids, and concats them into the ugliest string ever to get
    // every note that corresponds to a TXN UUID in the current result set

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
        console.log('notes data from reactapp.js: ', data);
        this.setState({
          notes: data,
          // there are no notes for any txns yet,
          // so the exact mechanics of this are TBD
        });
        this.calculateUntaggedTransactions();
        // console.log(this.state.notes);
      }
    }.bind(this));
  },

  calculateUntaggedTransactions(){
    // start with an array of all transactions
    // for each note, slice out the txn with that uuid
    // from the larger group

    // an array of objects
    var untaggedTransactions = this.state.txns;
    console.log('matching txns for this many notes: ', this.state.notes.length);
    console.log('untagged transactions length before filter:', untaggedTransactions.length);
    for (var n in this.state.notes){
      var target = this.state.notes[n].transaction_uuid;
      var result = untaggedTransactions.filter(function(txn){return txn.uuid = target});
      // splice out xhere depends on whether untaggedTransactions is an object or an array...
    }
    console.log('untagged transactions length after filter:', untaggedTransactions.length);
    this.setState({
      untagged: untaggedTransactions,
    })
  },

  componentDidMount(){
    this.getTxnsForMonth();
  },

  render: function(){
    const wrapStyles = {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: 'yellow',
      overflow: 'hidden',
    };

    return(
      <div style={wrapStyles}>
        
        <div style={{width: '75%'}}>
          <PiePanel state={this.state}/>
          <BarPanel state={this.state}/>
          <SliverPanel state={this.state}/>
        </div>
        <SideBar state={this.state}/>
      </div>
    )
  }
});

ReactDOM.render(<ReactApp/>, document.getElementById('appContainer'));