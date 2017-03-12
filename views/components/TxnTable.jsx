// =========================================
// TxnTable
// ----
// Takes transactions, and displays a table
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';

const TxnTable = React.createClass({
  render: function(){

    function makeRow(txn){
      const rowStyle = {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderBottomColor: '#DDDDDD',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        padding: '15px',
        display: 'flex',
        flexDirection: 'row',
      }

      const rowDataStyle = {
        padding: '0 10px',
      }

      return (
        <div
          style={rowStyle}
          transaction={txn}
          key={txn.uuid}
        >
          <div style={rowDataStyle}>{txn.times.when_recorded_local.split(' ')[0]}</div>
          
          <div style={rowDataStyle}>{txn.description}</div>

          <div style={rowDataStyle}>{txn.amounts.amount/10000} </div>
          
        </div>
      )
    };
    return (<div>
      <h1>Table hizzere</h1>
      {this.props.txns.map(function(txn) {
        return(makeRow(txn))
      })}
    </div>)
  }
});


export default TxnTable;