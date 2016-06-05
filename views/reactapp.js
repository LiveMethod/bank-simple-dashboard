// =========================================
// App
// ----
// Fetches transaction data from api and renders dashboard
// =========================================

import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';
import c3 from 'c3';
import $ from 'jquery';
import {Motion, spring} from 'react-motion';
import PiePanel from './components/PiePanel.jsx';
import BarPanel from './components/BarPanel.jsx';
import SliverPanel from './components/SliverPanel.jsx';
import SideBar from './components/SideBar.jsx';
import secrets from '../secrets/secrets';
import theme from './theme.js';

const ReactApp = React.createClass ({
  getInitialState() {
    return {
      targetYear: '2016',
      targetMonth: '01',
      notes: [],
      txns: [],
      untagged: [],
      // Possible savings = income not allocated for expenses
      monthlyIncome: secrets.monthlyIncome,
      possibleSavings: secrets.monthlyIncome - secrets.expenses,
    };
  },
  /*
  * Calls the API with the month and year specified in the initial state
  */
  getTxnsForMonth(){
    console.log('called getTxnsForMonth');
    const txnsApi = '/api/transactions?y=' + this.state.targetYear + '&m=' + this.state.targetMonth;
    $.get(txnsApi, function(data){
      if(this.isMounted()){
        this.setState({
          txns: data,
        });
        // console.log('got txns');
        this.getNotesForTxns();
      }
    }.bind(this));
  },

  /*
  * Called after the transactions API call finishes.
  * Gets notes for each uuid in the transactions repsonse.
  */
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
        // console.log('notes data from reactapp.js: ', data);
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

  /*
  * populates the state.untagged array with only transactions
  * that have no corresponding note
  */
  calculateUntaggedTransactions(){
    // a transaction is untagged if it has no corresponding note.
    // start with an array of all transactions
    // for each note, slice out the txn with that uuid
    // from the larger group

    // clone the array of transaction objects
    var untaggedTransactions = JSON.parse(JSON.stringify(this.state.txns));
    console.log('matching txns against ' +  this.state.notes.length + ' notes');
    console.log(untaggedTransactions.length + ' transactions before filtration');
    console.log('filtering....');
    // for every note
    for (var n in this.state.notes){
      // set the target to this iterations uuid
      var target = this.state.notes[n].transaction_uuid;
      
      untaggedTransactions.filter(function(txn){
        var match = txn.uuid === target;
        if(match){
          // console.log('Matched ' + txn.uuid);
          var matchIndex = untaggedTransactions.indexOf(txn);
          untaggedTransactions.splice(matchIndex, 1);
        };
        return match;
      });
    }
    console.log(this.state.txns.length + ' total transactions after filtration');
    console.log(this.state.untagged.length + ' untagged transactions after filtration');
    this.setState({
      untagged: untaggedTransactions,
    })
  },

  componentDidMount(){
    this.getTxnsForMonth();
  },

  render: function(){
    const wrapStyles = {
      width: '1100px', // set back to 100% for responsive
      margin: '0 auto',
      padding: 0,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: theme.colors.darkPurple,
      overflow: 'hidden',
      fontFamily: 'Proxima Nova, helvetica, arial, sans-serif',
    };

    return(
      <div style={wrapStyles}>
        
        <div style={{width: '75%'}}>
          <PiePanel state={this.state}/>
          {/*
          <BarPanel state={this.state}/>
          <SliverPanel state={this.state}/>
          */}
        </div>
        <SideBar state={this.state} refresh={() => {this.getTxnsForMonth()}}/>
      </div>
    )
  }
});

ReactDOM.render(<ReactApp/>, document.getElementById('appContainer'));