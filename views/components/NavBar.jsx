// =========================================
// NavBar
// ----
// Displays and modifies the apps date range
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';
import firstBy from 'thenby';

const NavBar = React.createClass({
  render: function(){
    const navStyles = {
      width: '100%',
      backgroundColor: theme.colors.veryLightPurple,
    };

    const heatMapStyles = {
      display: 'flex',
    };

    const heatMapEntryStyles = {
      flex: 1,
    };

    let HeatMap = [];

    // date sort the data
    let sortedMonthlyDataCount = this.props.monthlyDataCount.sort(
      firstBy(function(a,b){ return parseInt(a.tempDate[0]) - parseInt(b.tempDate[0]) })
      .thenBy(function(a,b){ return parseInt(a.tempDate[1]) - parseInt(b.tempDate[1]) })
    );

    // track the max data count per month
    let HeatMapMaxCount = 0;
    for (const [index,value] of sortedMonthlyDataCount.entries()){
      parseInt(value.tempData) > HeatMapMaxCount ? HeatMapMaxCount = parseInt(value.tempData) : '' ;
    }

    // calculate buckets for the heatmap color ranges based on the max data.
    function setHeatMapEntryBackgroundColor(count){
      // theme.colors.spectrum
      const base = HeatMapMaxCount/10;
      let color = theme.colors.white;

      count >= base*1 ? color = theme.colors.spectrum[10] : null;
      count >= base*2 ? color = theme.colors.spectrum[9] : null;
      count >= base*3 ? color = theme.colors.spectrum[8] : null;
      count >= base*4 ? color = theme.colors.spectrum[7] : null;
      count >= base*5 ? color = theme.colors.spectrum[6] : null;
      count >= base*6 ? color = theme.colors.spectrum[5] : null;
      count >= base*7 ? color = theme.colors.spectrum[4] : null;
      count >= base*8 ? color = theme.colors.spectrum[3] : null;
      count >= base*9 ? color = theme.colors.spectrum[2] : null;
      count >= base*10 ? color = theme.colors.spectrum[1] : null;

      return color;
    };

    for (const [index,value] of sortedMonthlyDataCount.entries()){
      let monthChickletOpacity = (value.tempDate[0] == this.props.targetYear && value.tempDate[1] == this.props.targetMonth) ? 1 : 0.3;

      const monthChickletStyles = {
        // Uncomment to access heatmap color
        // backgroundColor: setHeatMapEntryBackgroundColor(value.tempData)
        backgroundColor: theme.colors.white,
        borderTopWidth: '4px',
        borderTopColor: setHeatMapEntryBackgroundColor(value.tempData),
        borderTopStyle: 'solid',
        boxShadow: '0 11px 10px 0 rgba(185,185,198,0.16), 0 2px 4px 0 rgba(79,79,98,0.16)',
        textAlign: 'center',
        margin: '12px 6px',
        padding: '6px 12px',
        opacity: monthChickletOpacity,
      }

      const monthChickletYearStyles ={
        fontSize: '16px',
        color: theme.colors.monthChickletText,
        width: '100%',
      }

      const monthChickletMonthStyles ={
        fontSize: '18px',
        color: theme.colors.monthChickletText,
        width: '100%',
        textTransform: 'uppercase',
        fontWeight: '700',
      }
      HeatMap.push(
        <div 
          style={monthChickletStyles}
          key={index} 
          data-month={value.tempDate[1]}
          data-year={value.tempDate[0]}
          data-count={value.tempData}
          onClick={() => {this.props.setTargetDate(value.tempDate[0], value.tempDate[1])}}
        >
          <span style={monthChickletYearStyles}>
            {value.tempDate[0]}
          </span>
          <br/>
          <span style={monthChickletMonthStyles}>
            {theme.monthNamesShort[value.tempDate[1]]}
          </span>
          
        </div>
      )
    }

    const navArrowStyles = {
      backgroundColor: theme.colors.mediumDarkPurple,
    }

    return (
    <div style={navStyles}>
      <div style={navArrowStyles}>
        &#10140;
      </div>
      <div style={heatMapStyles}>
        {HeatMap}
      </div>
      <div style={navArrowStyles}>
        &#10140;
      </div>
    </div>)
  }
});

export default NavBar;