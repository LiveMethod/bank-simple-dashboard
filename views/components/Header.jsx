// =========================================
// Header
// ----
// Currently: Displays the selected range as a title
// TODO: Sync button & last synced date on left side
// TODO: Search for TXN on right? Needs a spec for 
// search scope
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';

const Header = React.createClass({
  render: function(){
    return (
      <div className="orchid-header">
        <div></div>
        <div className="orchid-header__center">
            {theme.monthNamesLong[this.props.targetMonth]} {this.props.targetYear}
          </div>
        <div></div>
      </div>
    )
  }
});


export default Header;