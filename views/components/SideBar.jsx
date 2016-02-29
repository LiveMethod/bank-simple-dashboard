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
      width: '25%',
      height: '100%',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      padding: '10px',
      overflowY: 'scroll',
    };
    // <UntaggedTransactionList style={sideBarStyles} />
    return(
      <div style={sideBarStyles}>
        <UntaggedTransactionList untagged={this.props.state.untagged}/>
      </div>
    );
  }
});

const UntaggedTransactionList = React.createClass({
  render: function(){
    console.log('untagged: ', this.props.untagged.length)
    return(
      <div>
        {this.props.untagged.map(function(txn) {
          return <UntaggedTransactionSlice transaction={txn} key={txn.uuid} />
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
      marginBottom: '10px',
    }

    return(
      <div style={sliceStyle}>
        {this.props.transaction.uuid}
      </div>
    );
  }
});

export default SideBar;