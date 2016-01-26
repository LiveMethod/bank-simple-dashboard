// =========================================
// BarPanel
// ----
// Contains a bar graph of spend by day
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';

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

    const barPanelStyles = {
      'backgroundColor':'#cccccc',
      'position':'relative',
      'display':'table'
    }

    // FIXME: this is a fucking abomination
    return (<div style={barPanelStyles}>
      {Array.apply(0, Array(31)).map(function (x, i){
        
        var target = targetYear+'-'+targetMonth+'-'+twoDigit(i+1);
        var thisDate = graphData.filter(
          function(val,index,array){
            return val.date == target;
          }
        )[0];
        var txnsForDate = undefined;
        if(thisDate != undefined){
          txnsForDate = thisDate.txns;
        }


        return (<GraphBar 
          date={target}
          txns={txnsForDate}

          key={i + 1}
        />)
      })}
    </div>)
  }
});



const GraphBar = React.createClass({
  render: function(){

    const date = this.props.date;
    const txns = this.props.txns;

    // get a total of all spending
    var totalSpend = 0;
    for(var t in txns){
      totalSpend += txns[t].amounts.amount;
    }

    const barStyles = {
      'width':'20px',
      'overflow':'hidden',
      'display':'table-cell',
      'verticalAlign':'bottom'
    }

    const dateStyles = {
    }

    // TODO: data-importance
    return (<div style={barStyles} data-count={txns ? txns.length : 0} data-spend={totalSpend}>
      {txns && txns.map(function(txn){
        return (<div
          style={{
            'height':txn.amounts.amount/20000+'px',
            'backgroundColor':'red',
            'margin':'1px 2px',
          }}
          key={txn.uuid}
          data-uuid={txn.uuid}
          data-amount={txn.amounts.amount/10000}
        >
        </div>)
      })}
    </div>)
  }
});
export default BarPanel;