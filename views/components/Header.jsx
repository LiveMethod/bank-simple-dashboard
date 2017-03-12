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
    const headerStyles = {
    	backgroundColor: theme.colors.mediumDarkPurple,
    	width: '100%',
    	display: 'flex',
    	flexDirection: 'row',
    }

    const headerCenterAreaStyles = {
    	textTransform: 'uppercase',
    	textAlign: 'center',
    	color: theme.colors.headerDateText,
    	flex: 1,
    	padding: '24px',
    	letterSpacing: '0.32em',
    }

    return (
	    <div style={headerStyles}>
	      <div></div>
	      <div style={headerCenterAreaStyles}>{theme.monthNamesLong[this.props.targetMonth]} {this.props.targetYear}</div>
	      <div></div>
	    </div>
    )
  }
});


export default Header;