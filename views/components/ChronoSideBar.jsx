// =========================================
// ChronoSideBar
// ----
// Shows years and months with their txn counts
// for use navigating bulk transactions
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';
import firstBy from 'thenby';

const ChronoSideBar = React.createClass({
  render: function(){
    const navStyles = {
      width: '400px',
      backgroundColor: theme.colors.white,
    };

    const heatMapStyles = {
      display: 'flex',
      flexDirection: 'column',
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
      // If it's january, append a div thing
      if(value.tempDate[1] == '01'){
        HeatMap.push(
          <div style={{
            backgroundColor: '#eeeeee',
            padding: '15px',
          }}>
          {value.tempDate[0]}
          </div>
        )
      }
      HeatMap.push(
        <div 
          style={{
            backgroundColor: setHeatMapEntryBackgroundColor(value.tempData),
            padding: '15px',
          }}
          key={index} 
          data-month={value.tempDate[1]}
          data-year={value.tempDate[0]}
          data-count={value.tempData}
          onClick={() => {this.props.setTargetDate(value.tempDate[0], value.tempDate[1])}}
        >
          {theme.monthNamesShort[value.tempDate[1]]} {value.tempDate[0]} : {value.tempData}
        </div>
      )
    }

    return (
    <div style={navStyles}>
      <h1>{theme.monthNamesShort[this.props.targetMonth]} {this.props.targetYear}</h1>
      <div style={heatMapStyles}>
        {HeatMap}
      </div>
    </div>)
  }
});


export default ChronoSideBar;