// =========================================
// SideBar
// ----
// Contains a list of unrated transactions
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';

const SideBar = React.createClass({
  render: function(){
    const sideBarStyles={
      backgroundColor: 'red',
      width: '100%',
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    };
    // <UntaggedTransactionList style={sideBarStyles} />
    return(
      <h1>fuuu</h1>
    );
  }
});

const UntaggedTransactionList = React.createClass({
  render: function(){
    return(
      <div>
        {transactions.map(function(txn) {
          <UntaggedTransactionSlice />
        })}
      </div>
    );
  }
});

const UntaggedTransactionSlice = React.createClass({
  render: function(){

    const sliceStyle = {
      backgroundColor: 'white',
      padding: '10px',
    }

    return(
      <div style={sliceStyle}>
        Slice
      </div>
    );
  }
});

export default SideBar;