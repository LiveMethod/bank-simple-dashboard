// =========================================
// BarPanel
// ----
// Contains a bar graph of spend by day
// =========================================

import React from 'react';
import c3 from 'c3';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';

/*

Scratch:

bar panel data model could look like:

[
  {
    date: 2016-01-01,
    //dailySpend: 302, // dont calc this on create, its a pain
    txns:[
      {txn},
      {txn},
      ...
    ],
  },
  ...
]
*/

const BarPanel = React.createClass({
  render: function(){
    const txns = this.props.state.txns;

    const targetMonth = this.props.state.targetMonth;
    const targetYear = this.props.state.targetYear;

    /*
    Graphdata becomes an array of objects like this:
    [
      {
        data: 'yyyy-mm-dd',
        txns: [
          transaction,
          transaction,
          ...
        ]
      }
    ]
    */
    let graphData = [];

    // loop through transactions, adding or updating
    // the graphData for that txn's day
    for(var i in txns){
      if(txns[i].bookkeeping_type == 'debit'){
        var txnDateTime = txns[i].times.when_recorded_local;
        var txnDate = txnDateTime.split(' ')[0];

        // check for existing graphData objects w/ this date
        var hasThisDate = graphData.filter(function(val, index, array) {
            // returns array of matches (should only ever be one)
            return val.date === txnDate;
        });

        // if a graphData object w/ this date exists
        if(hasThisDate.length > 0){
          // push this transaction into the days array
          hasThisDate[0].txns.push(txns[i])
        // else create one w/ this date and txn
        } else {
          graphData.push({
            date: txnDate,
            txns:[txns[i]],
          });
        }
      }
    }

    // util to add a leading 0 to single digits
    function twoDigit(n){
      return n > 9 ? "" + n: "0" + n;
    }

    // trim the robust data into something lighter
    // for c3

    // clone
    var splitChartData = []; 
    var combinedChartData = ['spend']; 

    // for each of 31 days
    Array.apply(0, Array(31)).map(function (x, i){
      // create a target day that matches simple's local datetime
      var target = targetYear+'-'+targetMonth+'-'+twoDigit(i+1);

      // create an array of data that matches the filter
      // txnDate == targetDate
      var thisDate = graphData.filter(
        function(val,index,array){
          return val.date == target;
        }
      )[0];

      var txnsForDate = undefined;
      // init an array with DD as the first entry
      var splitAmountsForDate = [twoDigit(i+1)];

      // as long as there are some transactions
      // for the target date, store them.
      if(thisDate != undefined){
        txnsForDate = thisDate.txns;

        var combinedAmountForDate = 0;
        for(var j in txnsForDate){
          // add txn amount as an entry for separated array
          splitAmountsForDate.push(txnsForDate[j].amounts.amount/10000);
          // add txn amount for daily total for combined array
          combinedAmountForDate += (txnsForDate[j].amounts.amount/10000);
        }
        combinedChartData.push(Math.ceil(combinedAmountForDate));
      }

      splitChartData.push(splitAmountsForDate);
    })

    // splitChartData is available, and looks like this
    // [
    //   ['01',43,24,55],
    //   ['02',10,44,55,35,36],
    //   ...
    // ]
    // but I can't get c3 to play nice with that yet.
    
    // make a simple bar chart from an array
    // with daily total spends chronologically, like this
    // ["spend",34,25,500,93,...]

    var chart = c3.generate({
      bindto: '#spendbyday',
      data: {
        columns: [combinedChartData],
        type: 'bar',
        colors: {
          spend: theme.colors.lightPurple,
        }
      },
      bar: {
        width: 8,
        ratio: 0.1,
        zerobased: true,
      },
      legend: {
        show: false
      },
    });

    const chartStyle = {
      background: theme.colors.purpleGradient,
      margin: '20px 40px',
    };
    return(
      <div id="spendbyday" style={chartStyle} />
    )
  }
});

export default BarPanel;