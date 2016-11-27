// =========================================
// NavBar
// ----
// Displays and modifies the apps date range
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';

const NavBar = React.createClass({
  render: function(){
    const navStyles = {
      width: '100%',
      backgroundColor: theme.colors.white,
    };

    const monthNames = {
      "01": "Jan",
      "02": "Feb",
      "03": "Mar",
      "04": "Apr",
      "05": "May",
      "06": "Jun",
      "07": "Jul",
      "08": "Aug",
      "09": "Sep",
      "10": "Oct",
      "11": "Nov",
      "12": "Dec",
    }

    return (
    <div style={navStyles}>
      <h1>{monthNames[this.props.targetMonth]} {this.props.targetYear}</h1>
    </div>)
  }
});


export default NavBar;