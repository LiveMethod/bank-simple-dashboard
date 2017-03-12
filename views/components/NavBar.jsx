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
      let monthChickletActive = "";
      if(value.tempDate[0] == this.props.targetYear && value.tempDate[1] == this.props.targetMonth){
        monthChickletActive = "orchid-month-select__month-chicklet--active";
      }
      HeatMap.push(
        <a 
          className={`orchid-month-select__month-chicklet ${monthChickletActive}`}
          href=""
          key={index} 
          data-month={value.tempDate[1]}
          data-year={value.tempDate[0]}
          data-count={value.tempData}
          onClick={(e) => {e.preventDefault(); this.props.setTargetDate(value.tempDate[0], value.tempDate[1])}}
        >
          <small>{value.tempDate[0]}</small>
          <br/>
          <big>{theme.monthNamesShort[value.tempDate[1]]}</big>
          
        </a>
      )
    }

    return (
    <div className="orchid-month-select">
      <div className="orchid-month-select__arrow">
        &#10140;
      </div>
      <div className="orchid-month-select__heat-map">
        {HeatMap}
      </div>
      <div className="orchid-month-select__arrow">
        &#10140;
      </div>
    </div>)
  }
});

export default NavBar;