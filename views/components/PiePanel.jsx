// =========================================
// PiePanel
// ----
// Contains overal monthly expendature as a
// pie graph and numerical breakdown
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';
import theme from '../theme.js';

/*

Scratch:

info needed for the pie panel:

total spend (all debit transactions added)

saved (income - spend)
saved_%: saved/income

possible_saved (income - fixed expenses)
possible_%: possible_saved/income

efficiency: saved/possible_saved

*/

const PiePanel = React.createClass({
  render: function(){
    const txns = this.props.state.txns;
    const possibleSavings = this.props.state.possibleSavings;
    const monthlyIncome = this.props.state.monthlyIncome;

    let totalSpend = 0;
    // add every debit event to the monthly spend
    for(var i in txns){
      if(txns[i].bookkeeping_type == 'debit'){
        totalSpend += txns[i].amounts.amount/10000;
      }
    }

    let savedAbs = Math.floor(monthlyIncome - totalSpend);
    let savedPct = Math.floor(savedAbs/monthlyIncome * 100);

    let possibleSavedAbs = Math.floor(possibleSavings);
    let possibleSavedPct = Math.floor(possibleSavedAbs/monthlyIncome * 100);

    let efficiency = Math.floor(savedAbs/possibleSavedAbs * 100);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        margin:'0 40px',
      }}>
        <ul style={{
          flex: 1,
          backgroundColor: theme.colors.mediumPurple,
          padding: '55px 0',
        }}>
          <PieStat
            description="Saved"
            leftContent={'$'+savedAbs}
            rightContent={savedPct+'%'}
          />
          <PieStat 
            description="Of A Possible"
            leftContent={'$'+possibleSavedAbs}
            rightContent={possibleSavedPct+'%'}
          />
          <PieStat 
            description="Total"
            leftContent={'Efficiency'}
            rightContent={efficiency}
          />
        </ul>
        <div style={{
          flex: 1,
          backgroundColor: theme.colors.white,
        }}>
          pie graph here
        </div>
      </div>
    )
  }
});

// a ruled list item, displayed beside pie chart
const PieStat = React.createClass({
  render: function(){
    const pieStatStyle = {
      margin: 0,
      padding: '0 55px',
      listStyleType: 'none',
    };

    const pieStatContent = {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    };

    const pieStatTitleText = {
      color: theme.colors.white,
      fontSize: '16px',
      fontWeight: 'bold',
      margin: 0,
    };

    const pieStatContentText = {
      color: theme.colors.white,
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
      width: '50%',
      flex: 0,
    };

    const pieStatRuling = {
      margin: '24px auto',
    };

    return(<li className="pie-stat" style={pieStatStyle}>
      <p style={pieStatTitleText}>
        {this.props.description}
      </p>

      <div style={pieStatContent}>
        <h2 style={pieStatContentText}>
          {this.props.leftContent}
        </h2>

        <h2 style={pieStatContentText}>
          {this.props.rightContent}
        </h2>
      </div>

      <hr style={pieStatRuling}/>
    </li>)
  }
})


export default PiePanel;