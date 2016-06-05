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
      dotHover: 0,
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

  mouseOver: function(dotID){
    this.setState({dotHover: dotID});
  },

  mouseOut: function(){
    this.setState({dotHover: 0});
  },

  getIndicatorStyle: function(index){
    const dotBackgrounds = {
      0: '#F3F3F9',
      1: '#A90000',
      2: '#FD0000',
      3: '#FF7100',
      4: '#FFAE00',
      5: '#FFDE00',
      6: '#F4F502',
      7: '#CEF70B',
      8: '#8DF919',
      9: '#28F023',
      10: '#09D00A',
    };

    const dotColor = index <= this.state.dotHover 
      ? dotBackgrounds[index]
      : dotBackgrounds[0];


    return {
      display: 'block',
      width: '10px',
      height: '10px',
      marginTop: '20px',
      borderRadius: '5px',
      textDecoration: 'none',
      background: dotColor,
      boxShadow: 'inset 0px 1px 3px 0px rgba(126,126,215,0.28)',
    };
  },

  render: function(){
    const sliceStyle = {
      backgroundColor: 'white',
      padding: '20px',
      paddingBottom: '0px', // 20px is added to the bottom of dots. same visual effect, larger target area.
      overflow: 'hidden',
      boxShadow: '0px 11px 10px 0px rgba(185,185,198,0.16), 0px 2px 4px 0px rgba(79,79,98,0.16)',
      // opacity is halved when an action is pending
      opacity: this.state.pending ? 0.5 : 1,
    }

    const dotWrapStyle = {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
    
    const dotStyle = {
      flex: 1,
      paddingBottom: '20px',
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

    const refresh = this.props.refresh;

    return(
      <Motion
        defaultStyle={{anim: 1, height: 100}}
        style={this.getStyle()}
      >
        {(motion) => {
          // console.log(motion.anim);

          if(motion.anim <= 0){
            // refresh();
            return null;
          };
          
          return(<div style={{opacity: motion.anim, height: motion.height + 'px', margin: '0 10px 30 10px',}}>
            <div style={sliceStyle} data-id={_id} data-uuid={uuid}>
              <strong>${price}</strong> {description}

              <div style={dotWrapStyle}>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 1)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(1)} }
                >
                  <div style={this.getIndicatorStyle(1)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 2)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(2)} }
                >
                  <div style={this.getIndicatorStyle(2)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 3)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(3)} }
                >
                  <div style={this.getIndicatorStyle(3)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 4)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(4)} }
                >
                  <div style={this.getIndicatorStyle(4)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 5)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(5)} }
                >
                  <div style={this.getIndicatorStyle(5)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 6)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(6)} }
                >
                  <div style={this.getIndicatorStyle(6)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 7)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(7)} }
                >
                  <div style={this.getIndicatorStyle(7)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 8)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(8)} }
                >
                  <div style={this.getIndicatorStyle(8)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 9)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(9)} }
                >
                  <div style={this.getIndicatorStyle(9)} />
                </a>
                <a 
                  href="#"
                  style={dotStyle}
                  onClick={ ()=>{this.newNoteForTransaction(uuid, 10)} }
                  onMouseOut={this.mouseOut}
                  onMouseOver={ () => {this.mouseOver(10)} }
                >
                  <div style={this.getIndicatorStyle(10)} />
                </a>
              </div>

            </div>
          </div>
        )}}
      </Motion>
    );
  }
});

export default SideBar;