// =========================================
// PiePanel
// ----
// Contains overal monthly expendature as a
// pie graph and numerical breakdown
// =========================================

import React from 'react';
import {Motion, spring} from 'react-motion';

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

    let savedAbs = monthlyIncome - totalSpend;
    let savedPct = savedAbs/monthlyIncome * 100;

    let possibleSavedAbs = possibleSavings;
    let possibleSavedPct = possibleSavedAbs/monthlyIncome * 100;

    let efficiency = savedAbs/possibleSavedAbs * 100;

    return (<ul>
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
    </ul>)
  }
});

// a ruled list item, displayed beside pie chart
const PieStat = React.createClass({
  render: function(){
    return(<li className="pie-stat">
      <p>{this.props.description}</p>
      <h2>{this.props.leftContent}</h2>
      <h2>{this.props.rightContent}</h2>
      <hr/>
    </li>)
  }
})


export default PiePanel;