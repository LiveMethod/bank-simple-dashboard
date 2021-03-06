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
import ChronoSideBar from './components/ChronoSideBar.jsx';
import TxnTable from './components/TxnTable.jsx';
import NavBar from './components/NavBar.jsx';
import Header from './components/Header.jsx';
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
      // tracks which months have data, and how much
      monthlyDataCount: [],
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

  /*
  * Cycles through some months and checks
  * whether any data exists for that month.
  */
  calculateWhichMonthsHaveData(){
    console.log('called calculateWhichMonthsHaveData');

    // this is hardcoded for now in the interest of simplicity.
    const monthsToCheck = [
      ["2015","01"],
      ["2015","02"],
      ["2015","03"],
      ["2015","04"],
      ["2015","05"],
      ["2015","06"],
      ["2015","07"],
      ["2015","08"],
      ["2015","09"],
      ["2015","10"],
      ["2015","11"],
      ["2015","12"],
      ["2016","01"],
      ["2016","02"],
      ["2016","03"],
      ["2016","04"],
      ["2016","05"],
      ["2016","06"],
      ["2016","07"],
      ["2016","08"],
      ["2016","09"],
      ["2016","10"],
      ["2016","11"],
      ["2016","12"],
      ["2017","01"],
      ["2017","02"],
      ["2017","03"],
      ["2017","04"],
      ["2017","05"],
      ["2017","06"],
      ["2017","07"],
      ["2017","08"],
      ["2017","09"],
      ["2017","10"],
      ["2017","11"],
      ["2017","12"],
    ];

    // this an array of objects created when the check runs.
    // It expects a year array as a key and a data count as a vaue
    // like  {[yyyy,mm],n}
    //
    // WARNING: at this time no effort is made to ensure that these appear
    // in the array in chronological order! Data is added as it's returned.
    let monthlyDataCount = [
    ]

    for (const date of monthsToCheck){
      const txnsApi = '/api/transactions?y=' + date[0] + '&m=' + date[1];
      $.get(txnsApi, function(data){

        // make an object with the date and data count
        let tempDate = [date[0] , date[1]];
        let tempData = data.length;
        let tempObject = {tempDate, tempData};
        // push that object to the group array
        monthlyDataCount.push(tempObject);
        // log
        // console.log(data.length + " txns for " + date[0] + " " + date[1]);
        // console.log("monthly data count:" + monthlyDataCount.length);

        // wait until the data count has all values to push to state.
        if(this.isMounted() && monthlyDataCount.length == monthsToCheck.length){
          this.setState({
            monthlyDataCount: monthlyDataCount,
          });
          console.log("state monthlyDataCount: " + JSON.stringify(this.state.monthlyDataCount));
        }
      }.bind(this));
    }
  },

  /*
  *  Set the target year and month in the state
  */
  setTargetDate: function(year, month){
    console.log(`changing target date range to ${year} ${month}`);
    if(this.isMounted()){
      this.setState({
        targetYear: year,
        targetMonth: month,
      });
    }

    this.getTxnsForMonth();
  },

  componentDidMount(){
    this.getTxnsForMonth();
    this.calculateWhichMonthsHaveData();
  },

  render: function(){
    let realApp = (
      <div className="orchid-wrap">
        <Header
          targetYear={this.state.targetYear}
          targetMonth={this.state.targetMonth}
        />
        <NavBar
          targetYear={this.state.targetYear}
          targetMonth={this.state.targetMonth}
          monthlyDataCount = {this.state.monthlyDataCount}
          setTargetDate={this.setTargetDate}
        />

        <div className="orchid-dashboard">
          <div className="orchid-widgets">
            <PiePanel state={this.state}/>
            <BarPanel state={this.state}/>
            {/*
            <SliverPanel state={this.state}/>
            */}
          </div>

          <SideBar state={this.state} refresh={() => {this.getTxnsForMonth()}}/>
        </div>
      </div>
    );
    const tableWrapStyles = {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
    }

    let tableApp = (
      <div style={tableWrapStyles}>
        <ChronoSideBar
          targetYear={this.state.targetYear}
          targetMonth={this.state.targetMonth}
          monthlyDataCount = {this.state.monthlyDataCount}
          setTargetDate={this.setTargetDate} />
        <TxnTable
          txns={this.state.txns}
          notes={this.state.notes}
        />
      </div>
    )

    // return tableApp;
    return realApp;
  }
});

ReactDOM.render(<ReactApp/>, document.getElementById('appContainer'));