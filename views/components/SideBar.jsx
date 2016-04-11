// =========================================
// SideBar
// ----
// Contains a list of unrated transactions
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import $ from 'jquery';


// TODO: consolidate sidebar and untaggedtransactionlist into one thing
// the div wrapping untaggedtransactionlist might as well be the sidebarstyles div
const SideBar = React.createClass({
  render: function(){
    const sideBarStyles={
      backgroundColor: '#E7E7F6',
      width: '25%',
      height: '100%',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '10px',
      paddingBottom: '10px',
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

const NecessityIndicators = React.createClass({
  newNoteForTransaction: function(uuid, necessity){

    const notesApi = '/api/notes/';
    $.post(notesApi, {transaction_uuid: uuid, necessity: necessity})
      .done((data)=>{
        alert("noted! " + JSON.stringify(data));
      });
  },

  render: function(){
    const indicatorStyle = {
      flex: 0,
      display: 'block',
      width: '28px',
      height: '28px',
      padding: '0px',
      background: 'rgba(208,1,27,0.75)',
      border: '4px solid #FFFFFF',
      boxShadow: '0px 3px 4px 0px rgba(0,0,0,0.10)',
    }
    const uuid = this.props.uuid;

    return(
      <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 1)} } style={indicatorStyle}>1</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 2)} } style={indicatorStyle}>2</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 3)} } style={indicatorStyle}>3</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 4)} } style={indicatorStyle}>4</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 5)} } style={indicatorStyle}>5</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 6)} } style={indicatorStyle}>6</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 7)} } style={indicatorStyle}>7</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 8)} } style={indicatorStyle}>8</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 9)} } style={indicatorStyle}>9</a>
        <a href="#" onClick={ ()=>{this.newNoteForTransaction(uuid, 10)} } style={indicatorStyle}>10</a>
      </div>
    );
  }
});

const UntaggedTransactionSlice = React.createClass({
  render: function(){

    const sliceStyle = {
      backgroundColor: 'white',
      margin: '0 10px 10px 10px',
      padding: '10px',
      overflow: 'hidden',
      boxShadow: '0px 11px 10px 0px rgba(185,185,198,0.16), 0px 2px 4px 0px rgba(79,79,98,0.16)',
    }

    const {
      _id,
      uuid,
      description,
      bookkeeping_type,
    } = this.props.transaction;

    const time = this.props.transaction.times.when_recorded_local;
    const price = this.props.transaction.amounts.amount/10000;


    // don't make slices for events when money gets added
    // TODO: investigate positive balance events other than
    // credit, eg: returns, reversals, etc. Not sure what the
    // simple API returns for those ATM.

    if (bookkeeping_type === 'credit') {
      return null;
    }


    return(
      <div style={sliceStyle} data-id={_id} data-uuid={uuid}>
        <p>{uuid}</p>
        <p><strong>${price}</strong> {description}</p>
        <NecessityIndicators uuid={uuid}/>
      </div>
    );
  }
});



export default SideBar;