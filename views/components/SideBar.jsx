// =========================================
// SideBar
// ----
// Contains a list of unrated transactions
// =========================================

import React from 'react';
import { Animated } from 'react';
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

    const refresh = this.props.refresh.bind(this);

    // TODO: figure out why there needs to be a nested div here
    return(
      <div style={sideBarStyles}>
        <div>
          {this.props.state.untagged.map(function(txn) {
            return <UntaggedTransactionSlice transaction={txn} key={txn.uuid} refresh={()=>{refresh()}} />
          })}
        </div>
      </div>
    );
  }
});

const UntaggedTransactionSlice = React.createClass({
  getInitialState() {
    return {
      isPending: false,
      shouldRetire: false,
      didRetire: false,
      anim: 1,
    };
  },

  //
  getStyle(key) {
    if(this.state.shouldRetire && !this.state.didRetire){
      const data = {
        anim: spring(0, [90, 14]),
        height: spring(0, [90, 14]),
      };

      return data;
    }

    else {
      // should be 1 when not fading out
      return {
        anim: spring(1, [90, 14]),
        height: spring(100, [90, 14]),
      };
    }
  },

  retireTransaction: function(){
    console.log('shitfuck');
    this.setState({isRetired: true});
  },

  newNoteForTransaction: function(uuid, necessity){
    // set state to pending before making API call
    this.setState({isPending: true});


    const notesApi = '/api/notes/';
    console.log('sending a note');
    $.post(notesApi, {transaction_uuid: uuid, necessity: necessity})
      .done((data)=>{
        console.log("noted! " + JSON.stringify(data));
        // TODO: make it not pending anymore
        this.setState({shouldRetire: true});
      })
      .fail((data)=>{
        console.log("Failed to create note: " + JSON.stringify(data.statusText));
        // this.setState({isPending: false});
        this.setState({shouldRetire: true});
      });
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('uhhhhh');
  },
  render: function(){

    const sliceStyle = {
      backgroundColor: 'white',
      padding: '10px',
      overflow: 'hidden',
      height: '100px',
      boxShadow: '0px 11px 10px 0px rgba(185,185,198,0.16), 0px 2px 4px 0px rgba(79,79,98,0.16)',
      // opacity is halved when an action is pending
      opacity: this.state.pending ? 0.5 : 1,
    }

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

    const {
      _id,
      uuid,
      description,
      bookkeeping_type,
    } = this.props.transaction;

    const time = this.props.transaction.times.when_recorded_local;
    const price = this.props.transaction.amounts.amount/10000;

    const NecessityIndicators = (
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

    // don't make slices for events when money gets added
    // TODO: investigate positive balance events other than
    // credit, eg: returns, reversals, etc. Not sure what the
    // simple API returns for those ATM.

    if (bookkeeping_type === 'credit') {
      return null;
    }

    const refresh = this.props.refresh;

    return(
      <Motion
        defaultStyle={{anim: 1, height: 100}}
        style={this.getStyle()}
      >
        {(motion) => {
          console.log(motion.anim);

          if(motion.anim <= 0){
            // refresh();
            return null;
          };

          return(<div style={{opacity: motion.anim, height: motion.height + 'px', margin: '0 10px 30px 10px',}}>
            <div style={sliceStyle} data-id={_id} data-uuid={uuid}>
              <p><strong>${price}</strong> {description}</p>
              {NecessityIndicators}
            </div>
          </div>
        )}}
      </Motion>
    );
  }
});



export default SideBar;